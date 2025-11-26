# routers/logs.py
from fastapi import APIRouter
from database.connection import db

router = APIRouter(prefix="/api", tags=["Logs"])

@router.get("/logs")
def get_logs():
    logs = list(db.logs.find().sort("timestamp", -1))
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs

@router.get("/response-trend")
def response_trend():
    trend = list(db.logs.find({}, {"timestamp": 1, "response_time": 1}).sort("timestamp", 1))
    for t in trend:
        t["_id"] = str(t["_id"])
    return trend

