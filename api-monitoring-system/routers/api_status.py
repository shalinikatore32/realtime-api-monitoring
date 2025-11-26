# routers/api_status.py

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database.connection import db

router = APIRouter(prefix="/api/status", tags=["API Status"])


# -------------------------------
# Get status of ALL APIs
# -------------------------------
@router.get("/")
def get_all_status():
    statuses = list(db.api_status.find())
    for s in statuses:
        s["_id"] = str(s["_id"])
    return statuses


# -------------------------------
# Get status of ONE API
# -------------------------------
@router.get("/{api_id}")
def get_status(api_id: str):
    if not ObjectId.is_valid(api_id):
        raise HTTPException(status_code=400, detail="Invalid API ID")

    status = db.api_status.find_one({"api_id": api_id})
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    status["_id"] = str(status["_id"])
    return status
