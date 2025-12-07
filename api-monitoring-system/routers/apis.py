# routers/apis.py

from fastapi import APIRouter, HTTPException, Request
from bson import ObjectId
from database.connection import db
from models.api_config import APIConfig
from middleware.auth import get_current_user
from database.redis_client import make_key, redis_client

router = APIRouter(prefix="/api", tags=["APIs"])


# ---------------------------
# REGISTER NEW API
# ---------------------------
@router.post("/register")
async def add_api(api: APIConfig, request:Request):
    # Convert Pydantic model -> JSON-safe dict
    user_id = await get_current_user(request)
    data = api.model_dump()
    data["url"] = str(data["url"])     # FIX: convert HttpUrl → string
    data["user_id"] = user_id   

    result = db.apis.insert_one(data)

    return {
        "status": "success",
        "id": str(result.inserted_id)
    }


# ---------------------------
# GET ALL API CONFIGS
# ---------------------------
@router.get("/apis")
async def get_apis(request:Request):
    user_id = await get_current_user(request)
    apis = list(db.apis.find({"user_id": user_id}))

    # Convert ObjectId -> string
    for api in apis:
        api["_id"] = str(api["_id"])

    return apis


# ---------------------------
# DELETE API CONFIG
# ---------------------------
@router.delete("/apis/{api_id}")
async def delete_api(api_id: str, request:Request):
    user_id = await get_current_user(request)
    if not ObjectId.is_valid(api_id):
        raise HTTPException(status_code=400, detail="Invalid API ID")

    result = db.apis.delete_one({"_id": ObjectId(api_id), "user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="API not found")

    db.logs.delete_many({"api_id": api_id})
    db.alerts.delete_many({"api_id": api_id})
    db.api_status.delete_many({"api_id": api_id})
    db.state_samples.delete_many({"api_id": api_id})
    # Optionally remove email_logs where url contains api id (best-effort)
    db.email_logs.delete_many({"url": {"$regex": api_id}})

    # Clean Redis keys (best-effort)
    try:
        redis_client.delete(make_key("latest_log", api_id))
        redis_client.delete(make_key("logs", api_id))
        redis_client.delete(make_key("status", api_id))
    except Exception:
        pass

    return {"status": "deleted", "message": "API and related data removed successfully"}
