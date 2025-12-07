# routers/logs.py
from fastapi import APIRouter, Request
from database.connection import db
from middleware.auth import get_current_user
from database.redis_client import make_key, get_recent_list


router = APIRouter(prefix="/api", tags=["Logs"])

async def _get_user_api_ids(user_id: str):
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1}))
    return [str(a["_id"]) for a in apis]

@router.get("/logs")
async def get_logs(request: Request):
    user_id = await get_current_user(request)
    # fetch user's apis to read their log lists
    api_ids = await _get_user_api_ids(user_id)
    combined = []
    for api_id in api_ids:
        recent_key = make_key("logs", api_id)
        recent = get_recent_list(recent_key, 0, 49)
        if recent:
            for r in recent:
                # these items are cached – they don't have a DB _id
                r["_id"] = None
                combined.append(r)

    if combined:
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
    api_ids = await _get_user_api_ids(user_id)

    trend = []
    for api_id in api_ids:
        recent_key = make_key("logs", api_id)
        recent = get_recent_list(recent_key, 0, 99)
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

