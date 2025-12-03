# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers.auth import router as auth_router
from routers.apis import router as api_router
from routers.logs import router as logs_router
from routers.alerts import router as alerts_router
from routers.metrics import router as metrics_router
from routers.api_status import router as api_status_router
from core.scheduler import start_scheduler

app = FastAPI()

# ---------------------------
# ⭐ CORS FIX (IMPORTANT)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# ROUTERS
# ---------------------------
app.include_router(auth_router)
app.include_router(api_router)
app.include_router(logs_router)
app.include_router(alerts_router)
app.include_router(metrics_router)
app.include_router(api_status_router)

# ---------------------------
# BACKGROUND SCHEDULER
# ---------------------------
start_scheduler()
