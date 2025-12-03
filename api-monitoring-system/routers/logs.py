# routers/logs.py
from fastapi import APIRouter, Request
from database.connection import db
from middleware.auth import get_current_user
from database.redis_client import make_key, get_recent_list


router = APIRouter(prefix="/api", tags=["Logs"])

@router.get("/logs")
async def get_logs(request: Request):
    user_id = await get_current_user(request)
    # fetch user's apis to read their log lists
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1}))
    combined = []
    for a in apis:
        api_id = str(a["_id"])
        recent_key = make_key("logs", api_id)
        recent = get_recent_list(recent_key, 0, 49)
        if recent:
            for r in recent:
                # keep a consistent _id field for frontend (no real ObjectId here)
                r["_id"] = None
                combined.append(r)
    if combined:
        # sort by timestamp desc
        combined.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return combined

    # fallback to DB (existing behavior)
    logs = list(db.logs.find({"user_id": user_id}).sort("timestamp", -1))
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs

@router.get("/response-trend")
async def response_trend(request: Request):
    user_id = await get_current_user(request)
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1}))
    trend = []
    for a in apis:
        api_id = str(a["_id"])
        recent_key = make_key("logs", api_id)
        recent = get_recent_list(recent_key, 0, 99)  # get up to 100 recent points
        for r in recent:
            trend.append({"timestamp": r.get("timestamp"), "response_time": r.get("response_time")})
    if trend:
        trend.sort(key=lambda x: x["timestamp"])
        return trend

    # fallback DB
    trend = list(db.logs.find({"user_id": user_id}, {"timestamp": 1, "response_time": 1}).sort("timestamp", 1))
    for t in trend:
        t["_id"] = str(t["_id"])
    return trend

