from database.connection import get_db
from datetime import datetime

def log_event(url: str, status_code: int | None, response_time_ms: int | None, ok: bool, message: str):
    db = get_db()
    logs = db.logs
    doc = {
        "timestamp": datetime.utcnow().isoformat(),
        "url": url,
        "status_code": status_code,
        "response_time_ms": response_time_ms,
        "ok": ok,
        "message": message
    }
    logs.insert_one(doc)
    return doc

def log_alert(issue: str, observed: str, threshold: str, url: str):
    db = get_db()
    alerts = db.alerts
    doc = {
        "timestamp": datetime.utcnow().isoformat(),
        "issue": issue,
        "observed": observed,
        "threshold": threshold,
        "url": url
    }
    alerts.insert_one(doc)
    return doc

def fetch_recent_logs(limit: int = 10):
    db = get_db()
    return list(db.logs.find().sort("_id", -1).limit(limit))
