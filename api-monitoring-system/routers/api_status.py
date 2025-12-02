# routers/api_status.py

from fastapi import APIRouter, HTTPException, Request
from bson import ObjectId
from database.connection import db
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/status", tags=["API Status"])


# -------------------------------
# Get status of ALL APIs
# -------------------------------
@router.get("/")
async def get_all_status(request:Request):
    user_id=await get_current_user(request)
    statuses = list(db.api_status.find({"user_id": user_id}))
    for s in statuses:
        s["_id"] = str(s["_id"])
    return statuses


# -------------------------------
# Get status of ONE API
# -------------------------------
@router.get("/{api_id}")
async def get_status(api_id: str, request:Request):
    user_id=await get_current_user(request)
    if not ObjectId.is_valid(api_id):
        raise HTTPException(status_code=400, detail="Invalid API ID")

    status = db.api_status.find_one({"api_id": api_id, "user_id": user_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    status["_id"] = str(status["_id"])
    return status
