import os
from dotenv import load_dotenv
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


load_dotenv()

API_URL = os.getenv("API_URL", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "60"))
MAX_RESPONSE_TIME_MS = int(os.getenv("MAX_RESPONSE_TIME_MS", "2000"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "api_monitor_db")

# Alert email config (optional)
ALERT_EMAIL_TO = os.getenv("ALERT_EMAIL_TO")
ALERT_EMAIL_FROM = os.getenv("ALERT_EMAIL_FROM")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT") or 587)
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
