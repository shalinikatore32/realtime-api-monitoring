# routers/alerts.py
from fastapi import APIRouter
from database.connection import db

router = APIRouter(prefix="/api", tags=["Alerts"])

@router.get("/alerts")
def get_alerts():
    alerts = list(db.alerts.find().sort("timestamp", -1))
    for alert in alerts:
        alert["_id"] = str(alert["_id"])
    return alerts

