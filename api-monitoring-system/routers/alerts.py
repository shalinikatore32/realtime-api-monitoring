# routers/alerts.py
from fastapi import APIRouter, Request, HTTPException
from bson import ObjectId
from database.connection import db
from middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Alerts"])


# ----------------------------------------------------
# 1️⃣ ALL ALERTS (For Alerts Table)
# ----------------------------------------------------
@router.get("/alerts")
async def get_all_alerts(request: Request):
    user_id = await get_current_user(request)

    alerts = list(
        db.alerts.find({"user_id": user_id})
        .sort("timestamp", -1)
    )

    for alert in alerts:
        alert["_id"] = str(alert["_id"])

    return alerts


# ----------------------------------------------------
# 2️⃣ ONLY UNREAD ALERTS (For NotificationBell)
# ----------------------------------------------------
@router.get("/alerts/unread")
async def get_unread_alerts(request: Request):
    user_id = await get_current_user(request)

    alerts = list(
        db.alerts.find({"user_id": user_id, "read": False})
        .sort("timestamp", -1)
    )

    for alert in alerts:
        alert["_id"] = str(alert["_id"])

    return alerts


# ----------------------------------------------------
# 3️⃣ Mark a single alert as read
# ----------------------------------------------------
@router.patch("/alerts/read/{alert_id}")
async def mark_alert_as_read(alert_id: str, request: Request):
    user_id = await get_current_user(request)

    if not ObjectId.is_valid(alert_id):
        raise HTTPException(400, "Invalid alert ID")

    db.alerts.update_one(
        {"_id": ObjectId(alert_id), "user_id": user_id},
        {"$set": {"read": True}}
    )

    return {"status": "ok", "message": "Alert marked as read"}


# ----------------------------------------------------
# 4️⃣ Mark all unread alerts as read
# ----------------------------------------------------
@router.patch("/alerts/read-all")
async def mark_all_read(request: Request):
    user_id = await get_current_user(request)

    db.alerts.update_many(
        {"user_id": user_id, "read": False},
        {"$set": {"read": True}}
    )

    return {"status": "ok", "message": "All alerts marked read"}
