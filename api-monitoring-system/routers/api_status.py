# routers/api_status.py

from fastapi import APIRouter, HTTPException, Request
from database.redis_client import make_key, get_json, get_recent_list

from bson import ObjectId
from database.connection import db
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/status", tags=["API Status"])


# -------------------------------
# Get status of ALL APIs
# -------------------------------
@router.get("/")
async def get_all_status(request: Request):
    user_id = await get_current_user(request)

    # get all user's API configs to know api_ids
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1, "url": 1, "name": 1}))
    statuses = []
    for a in apis:
        api_id = str(a["_id"])
        status_key = make_key("status", api_id)
        snap = get_json(status_key)
        if snap:
            snap["_id"] = api_id
            statuses.append(snap)
        else:
            # fallback to DB
            s = db.api_status.find_one({"api_id": api_id, "user_id": user_id})
            if s:
                s["_id"] = str(s["_id"])
                statuses.append(s)
    return statuses



# -------------------------------
# Get status of ONE API
# -------------------------------
@router.get("/{api_id}")
async def get_status(api_id: str, request: Request):
    user_id = await get_current_user(request)
    if not ObjectId.is_valid(api_id):
        raise HTTPException(status_code=400, detail="Invalid API ID")

    # try redis first
    status_key = make_key("status", api_id)
    snap = get_json(status_key)
    if snap and str(snap.get("user_id")) == str(user_id):
        snap["_id"] = api_id
        return snap

    # fallback to DB
    status = db.api_status.find_one({"api_id": api_id, "user_id": user_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    status["_id"] = str(status["_id"])
    return status
