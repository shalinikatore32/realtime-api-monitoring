# routers/logs.py
from fastapi import APIRouter, Request
from database.connection import db
from middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Logs"])

@router.get("/logs")
async def get_logs(request:Request):
    user_id= await get_current_user(request)
    logs = list(db.logs.find({"user_id": user_id}).sort("timestamp", -1))
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs

@router.get("/response-trend")
async def response_trend(request:Request):
    user_id= await get_current_user(request)
    trend = list(db.logs.find({"user_id":user_id}, {"timestamp": 1, "response_time": 1}).sort("timestamp", 1))
    for t in trend:
        t["_id"] = str(t["_id"])
    return trend

