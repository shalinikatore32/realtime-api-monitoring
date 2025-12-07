# core/fetcher.py
import os
import time
from datetime import datetime, timedelta
from typing import Optional, Tuple

import requests
from database.connection import db
from utils.email_alert import send_alert_email
# add:
from database.redis_client import make_key, set_json, push_recent_list,publish_json
from config.settings import REDIS_TTL_SECONDS


ALERT_TO = os.getenv("ALERT_TO")

# -------------------------------
# CONFIGURATION
# -------------------------------
SLOW_THRESHOLD_MS = 4000                 # More realistic threshold
REQUEST_TIMEOUT_SEC = 10                 # HTTP timeout
EMAIL_ON_STATES = {"DOWN"}               # Only email on DOWN
COOLDOWN_SECONDS = 120                   # 2-minute cooldown per API
SAMPLE_WINDOW = 3                        # Require 3 consistent samples


def classify_state(status_code: Optional[int], response_time: float) -> Tuple[str, str]:
    """Convert raw response data into (state, severity)."""
    if status_code is None:
        return "DOWN", "CRITICAL"

    if status_code >= 500:
        return "DOWN", "CRITICAL"

    if response_time > SLOW_THRESHOLD_MS:
        return "SLOW", "WARNING"

    return "UP", "OK"


def normalize(url: str) -> str:
    return url.lower().rstrip("/")


def record_sample(api_id: str,user_id: str, state: str, at: datetime):
    """Store tiny sample record (only last 3)."""
    db.state_samples.insert_one({
        "api_id": api_id,
        "user_id":user_id,
        "state": state,
        "timestamp": at
    })
    # Keep only last 3 samples
    samples = list(
        db.state_samples.find({"api_id": api_id,"user_id": user_id})
        .sort("timestamp", -1)
    )
    if len(samples) > SAMPLE_WINDOW:
        # delete older samples
        for s in samples[SAMPLE_WINDOW:]:
            db.state_samples.delete_one({"_id": s["_id"]})


def get_consensus(api_id: str, user_id:str) -> Optional[str]:
    """Return dominant state if consistent for SAMPLE_WINDOW samples."""
    samples = list(
        db.state_samples.find({"api_id": api_id, "user_id": user_id})
        .sort("timestamp", -1)
        .limit(SAMPLE_WINDOW)
    )

    if len(samples) < SAMPLE_WINDOW:
        return None  # Not enough data

    states = [s["state"] for s in samples]

    # All must match → true state
    if len(set(states)) == 1:
        return states[0]

    return None  # inconsistent, fluctuating


def cooldown_active(api_id: str,user_id:str, now: datetime) -> bool:
    """Returns True if cooldown period is active."""
    last_alert = db.alerts.find_one(
        {"api_id": api_id, "user_id": user_id},
        sort=[("timestamp", -1)]
    )
    if not last_alert:
        return False

    if (now - last_alert["timestamp"]) < timedelta(seconds=COOLDOWN_SECONDS):
        return True

    return False


def check_api(api: dict):
    raw_url = api["url"]
    url = normalize(raw_url)
    method = api["method"]
    name = api.get("name", "Unnamed API")
    api_id = str(api["_id"])
    user_id=api["user_id"]

    # -------------------------------
    # GET PREVIOUS STATUS
    # -------------------------------
    previous = db.api_status.find_one({"api_id": api_id, "user_id": user_id})

    # -------------------------------
    # SEND HTTP REQUEST
    # -------------------------------
    start = time.time()
    try:
        resp = requests.request(method, raw_url, timeout=REQUEST_TIMEOUT_SEC)
        status_code = resp.status_code
    except Exception:
        status_code = None

    response_time_ms = round((time.time() - start) * 1000, 2)
    state, severity = classify_state(status_code, response_time_ms)
    now = datetime.utcnow()

    # -------------------------------
    # LOG ENTRY
    # -------------------------------
    db.logs.insert_one({
        "api_id": api_id,
        "user_id": user_id,
        "name": name,
        "url": raw_url,
        "status_code": status_code,
        "response_time": response_time_ms,
        "is_up": state != "DOWN",
        "timestamp": now
    })

        # --- WRITE TO REDIS (fast access for dashboard) ---
    try:
        latest_key = make_key("latest_log", api_id)
        set_json(latest_key, {
            "api_id": api_id,
            "user_id": user_id,
            "name": name,
            "url": raw_url,
            "status_code": status_code,
            "response_time": response_time_ms,
            "is_up": state != "DOWN",
            "timestamp": now.isoformat()
        }, ex=REDIS_TTL_SECONDS)

        # maintain recent logs list (bounded)
        recent_key = make_key("logs", api_id)
        push_recent_list(recent_key, {
            "api_id": api_id,
            "user_id": user_id,
            "status_code": status_code,
            "response_time": response_time_ms,
            "is_up": state != "DOWN",
            "timestamp": now.isoformat()
        }, maxlen=50)

        # update status snapshot
        status_key = make_key("status", api_id)
        set_json(status_key, {
            "api_id": api_id,
            "user_id": user_id,
            "url": raw_url,
            "state": state,
            "last_checked": now.isoformat(),
            "last_changed": now.isoformat()
        }, ex=REDIS_TTL_SECONDS)
    except Exception as e:
        # Redis should be non-fatal — log to console and continue
        print("⚠ Redis write failed:", str(e))


    # -------------------------------
    # STATE SAMPLING (multi-sample detection)
    # -------------------------------
    record_sample(api_id,user_id, state, now)
    consensus = get_consensus(api_id, user_id)

    # If consensus isn't stable yet → just update last_checked
    if not consensus:
        if previous:
            db.api_status.update_one(
                {"_id": previous["_id"]},
                {"$set": {"last_checked": now}}
            )
        return  # no alert

    # -------------------------------
    # FIRST TIME STATUS CREATION
    # -------------------------------
    if not previous:
        db.api_status.insert_one({
            "api_id": api_id,
            "user_id": user_id,
            "url": raw_url,
            "state": consensus,
            "last_checked": now,
            "last_changed": now,
            "previous_state": None
        })

        # Only alert if first-ever is DOWN
        if consensus == "DOWN":
            msg = (
                f"FIRST CHECK — API is DOWN\n"
                f"Name: {name}\n"
                f"URL: {raw_url}\n"
                f"Status: {status_code}\n"
                f"Response time: {response_time_ms} ms\n"
                f"Time: {now.isoformat()}Z"
            )
            db.alerts.insert_one({
                "api_id": api_id,
                "user_id": user_id,
                "name": name,
                "url": raw_url,
                "previous_state": None,
                "current_state": consensus,
                "severity": severity,
                "message": msg,
                "timestamp": now,
                "resolved": False,
                "read": False
            })
            # ---- REAL-TIME WS ALERT (First-time alert) ----
            try:
                channel = make_key("alerts", user_id)
                publish_json(channel, {
                    "api_id": api_id,
                    "user_id": user_id,
                    "name": name,
                    "url": raw_url,
                    "previous_state": None,
                    "current_state": consensus,
                    "severity": severity,
                    "message": msg,
                    "timestamp": now.isoformat(),
                    "resolved": False,
                    "read": False
                })
            except Exception as e:
                print("⚠ Redis WebSocket publish failed:", e)

        return

    # -------------------------------
    # TRANSITION DETECTION
    # -------------------------------
    last_state = previous.get("state", "UNKNOWN")

    # NO CHANGE → just update check time
    if last_state == consensus:
        db.api_status.update_one(
            {"_id": previous["_id"]},
            {"$set": {"last_checked": now}}
        )
        return

    # -------------------------------
    # COOL-DOWN LOGIC (prevent spam)
    # -------------------------------
    if cooldown_active(api_id,user_id, now):
        # Update status silently without alert
        db.api_status.update_one(
            {"_id": previous["_id"]},
            {
                "$set": {
                    "state": consensus,
                    "last_checked": now,
                    "last_changed": now,
                    "previous_state": last_state
                }
            }
        )

            # update redis cached status (best-effort)
        try:
            status_key = make_key("status", api_id)
            set_json(status_key, {
                "api_id": api_id,
                "user_id": user_id,
                "url": raw_url,
                "state": consensus,
                "last_checked": now.isoformat(),
                "last_changed": now.isoformat(),
                "previous_state": last_state
            }, ex=REDIS_TTL_SECONDS)
        except Exception as e:
            print("⚠ Redis status update failed:", str(e))

        return

    # -------------------------------
    # CREATE ALERT (stable + no cooldown)
    # -------------------------------
    msg = (
        f"API: {name}\n"
        f"URL: {raw_url}\n"
        f"Previous state: {last_state}\n"
        f"Current state: {consensus}\n"
        f"Status code: {status_code}\n"
        f"Response time: {response_time_ms} ms\n"
        f"Time: {now.isoformat()}Z"
    )

    db.alerts.insert_one({
        "api_id": api_id,
        "user_id": user_id,
        "name": name,
        "url": raw_url,
        "previous_state": last_state,
        "current_state": consensus,
        "severity": severity,
        "message": msg,
        "timestamp": now,
        "resolved": False,
        "read": False
    })
    # ---- REAL-TIME WS ALERT (State transition) ----
    try:
        channel = make_key("alerts", user_id)
        publish_json(channel, {
            "api_id": api_id,
            "user_id": user_id,
            "name": name,
            "url": raw_url,
            "previous_state": last_state,
            "current_state": consensus,
            "severity": severity,
            "message": msg,
            "timestamp": now.isoformat(),
            "resolved": False,
            "read": False
        })
    except Exception as e:
        print("⚠ Redis WebSocket publish failed:", e)

    # Email only for CRITICAL states
    if consensus in EMAIL_ON_STATES and ALERT_TO:
        send_alert_email(
            subject=f"🚨 API {consensus} — {name}",
            message=msg,
            to_email=ALERT_TO,
            api_url=raw_url
        )

    # Update status doc
    db.api_status.update_one(
        {"_id": previous["_id"]},
        {
            "$set": {
                "state": consensus,
                "user_id": user_id,
                "last_checked": now,
                "last_changed": now,
                "previous_state": last_state
            }
        }
    )
        # update redis cached status (best-effort)
    try:
        status_key = make_key("status", api_id)
        set_json(status_key, {
            "api_id": api_id,
            "user_id": user_id,
            "url": raw_url,
            "state": consensus,
            "last_checked": now.isoformat(),
            "last_changed": now.isoformat(),
            "previous_state": last_state
        }, ex=REDIS_TTL_SECONDS)
    except Exception as e:
        print("⚠ Redis status update failed:", str(e))

