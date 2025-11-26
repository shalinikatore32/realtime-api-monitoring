# routers/apis.py

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database.connection import db
from models.api_config import APIConfig

router = APIRouter(prefix="/api", tags=["APIs"])


# ---------------------------
# REGISTER NEW API
# ---------------------------
@router.post("/register")
def add_api(api: APIConfig):
    # Convert Pydantic model -> JSON-safe dict
    data = api.model_dump()
    data["url"] = str(data["url"])     # FIX: convert HttpUrl → string

    result = db.apis.insert_one(data)

    return {
        "status": "success",
        "id": str(result.inserted_id)
    }


# ---------------------------
# GET ALL API CONFIGS
# ---------------------------
@router.get("/apis")
def get_apis():
    apis = list(db.apis.find({}))

    # Convert ObjectId -> string
    for api in apis:
        api["_id"] = str(api["_id"])

    return apis


# ---------------------------
# DELETE API CONFIG
# ---------------------------
@router.delete("/apis/{api_id}")
def delete_api(api_id: str):
    if not ObjectId.is_valid(api_id):
        raise HTTPException(status_code=400, detail="Invalid API ID")

    result = db.apis.delete_one({"_id": ObjectId(api_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="API not found")

    return {"status": "deleted"}
