# utils/email_alert.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import time

from database.connection import db

load_dotenv()

EMAIL = os.getenv("ALERT_EMAIL_FROM")
PASSWORD = os.getenv("ALERT_PASSWORD")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Cooldown time for sending emails
ALERT_COOLDOWN_MINUTES = 30  


def can_send_email(api_url: str) -> bool:
    """
    Checks whether enough time has passed since last alert email.
    """
    record = db.email_logs.find_one({"url": api_url})

    if not record:
        return True  # No previous alert → send email

    last_time = datetime.fromisoformat(record["last_sent"])
    if datetime.utcnow() - last_time >= timedelta(minutes=ALERT_COOLDOWN_MINUTES):
        return True

    return False


def update_last_sent(api_url: str):
    """
    Updates MongoDB timestamp after sending an email.
    """
    db.email_logs.update_one(
        {"url": api_url},
        {"$set": {"last_sent": datetime.utcnow().isoformat()}},
        upsert=True
    )


def send_alert_email(subject: str, message: str, to_email: str, api_url: str, retries: int = 3):
    """
    Sends alert email with throttling and HTML notice.
    """
    print(to_email)

    # Throttling Check
    if not can_send_email(api_url):
        print(f"⏳ Email throttled for {api_url} (cooldown active)")
        return False

    if not EMAIL or not PASSWORD:
        print("❌ EMAIL or PASSWORD not configured")
        return False

    for attempt in range(1, retries + 1):
        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = EMAIL
            msg["To"] = to_email
            msg["Subject"] = subject

            text_message = message
            html_message = f"""
            <html>
              <body style="font-family:Arial;padding:16px;">
                <h2 style="color:#d9534f;">🚨 API Alert</h2>
                <p>{message}</p>
                <p style="color:gray;font-size:12px;">This alert respects a {ALERT_COOLDOWN_MINUTES}-minute cooldown.</p>
              </body>
            </html>
            """

            msg.attach(MIMEText(text_message, "plain"))
            msg.attach(MIMEText(html_message, "html"))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, to_email, msg.as_string())
            server.quit()

            print(f"📧 Alert email sent to {to_email}")

            # update last sent timestamp
            update_last_sent(api_url)

            return True

        except Exception as e:
            print(f"⚠ Email attempt {attempt} failed: {str(e)}")
            time.sleep(2)

    print("❌ All retry attempts failed")
    return False
