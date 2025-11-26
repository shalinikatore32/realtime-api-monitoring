# core/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from database.connection import db
from core.fetcher import check_api

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(run_checks, "interval", seconds=5)
    scheduler.start()

def run_checks():
    apis = list(db.apis.find())
    for api in apis:
        check_api(api)
