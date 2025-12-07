# routers/alerts.py
from fastapi import APIRouter, Request, HTTPException
from bson import ObjectId
from database.connection import db
from middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Alerts"])

async def _get_user_api_ids(user_id: str):
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1}))
    return [str(a["_id"]) for a in apis]
# ----------------------------------------------------
# 1️⃣ ALL ALERTS (For Alerts Table)
# ----------------------------------------------------
@router.get("/alerts")
async def get_all_alerts(request: Request):
    user_id = await get_current_user(request)

    api_ids = await _get_user_api_ids(user_id)

    alerts = list(
        db.alerts.find({"api_id": {"$in": api_ids}}).sort("timestamp", -1)
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

    api_ids = await _get_user_api_ids(user_id)

    alerts = list(
        db.alerts.find({"api_id": {"$in": api_ids}, "read": False}).sort("timestamp", -1)
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

    # verify ownership: alert -> api -> owner
    alert = db.alerts.find_one({"_id": ObjectId(alert_id)})
    if not alert:
        raise HTTPException(404, "Alert not found")

    api_doc = db.apis.find_one({"_id": ObjectId(alert["api_id"]), "user_id": user_id})
    if not api_doc:
        raise HTTPException(403, "Not authorized for this alert")

    db.alerts.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"read": True}}
    )

    return {"status": "ok", "message": "Alert marked as read"}
# ----------------------------------------------------
# 4️⃣ Mark all unread alerts as read
# ----------------------------------------------------
@router.patch("/alerts/read-all")
async def mark_all_read(request: Request):
    user_id = await get_current_user(request)
    api_ids = await _get_user_api_ids(user_id)

    db.alerts.update_many(
        {"api_id": {"$in": api_ids}, "read": False},
        {"$set": {"read": True}}
    )

    return {"status": "ok", "message": "All alerts marked read"}
