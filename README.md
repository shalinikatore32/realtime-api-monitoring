🚀 API Monitoring & Alerting System

A real-time API monitoring platform built with FastAPI(Python), MongoDB, Next.js, and SWR, featuring uptime tracking, alerting engine, response-time analytics, and a modern dashboard UI.

This system continuously checks APIs, detects downtime, identifies slow responses, stores logs, generates alerts, and notifies users via UI alerts & email.

🌟 Features
🔍 Real-Time API Health Monitoring

Periodic API checks using scheduler

Measures:

Status code

Response time (ms)

UP / DOWN / SLOW state

🚨 Smart Alerting System

Severity levels: OK, WARNING, CRITICAL

Multi-sample stabilization (prevents spam alerts)

Transition-based alerts (only alert when the state changes)

Alerts stored in MongoDB

Real-time notification

Email notifications for CRITICAL alerts

📊 Dashboard Analytics

KPI Stats (Total requests, success rate, avg response time)

Response-time chart (Recharts)

Uptime analytics

Real-time alert table

Live logs

🧭 Modern UI/UX

Responsive Next.js dashboard

Collapsible + expand-on-hover sidebar

Dark mode supported

Beautiful Cards, Tables, Charts

⚙️ Admin Tools

Add / Register APIs

Update & Delete API configs

Search & filter APIs

View API activity & logs

🧱 Tech Stack
Frontend

Next.js 14 (App Router)

React + SWR

TailwindCSS

ShadCN UI

Recharts

Framer Motion

Backend

FastAPI

APScheduler

MongoDB (PyMongo)

Requests module

Pydantic Models

Database

MongoDB (Atlas or local)

Notifications

Custom email alert system (SMTP)

UI notifications

⚙️ How It Works
1️⃣ Scheduler triggers every X seconds

Using APScheduler, the system checks each registered API.

2️⃣ Fetcher performs health checks

Sends HTTP request

Measures latency

Determines state (UP, DOWN, SLOW)

Compares with previous state

3️⃣ Prevents false alerts

Multi-sample detection avoids spam when API fluctuates.

4️⃣ Stores logs

Each check is saved as:

{
"api_id": "...",
"status": 200,
"response_time": 325,
"timestamp": "..."
}

5️⃣ Generates alerts only on state change

If UP → DOWN, or SLOW → UP, it triggers an alert.

6️⃣ Frontend listens with SWR

Dashboard updates in real-time.

📦 Installation & Setup
🔧 1. Clone the repo
git clone https://github.com/shalinikatore32/realtime-api-monitoring
cd realtime-api-monitoring

🟦 2. Backend Setup (FastAPI)
Install dependencies:
cd api-monitoring-system
pip install -r requirements.txt

Create .env file:

Copy from .env.example:

cp .env.example .env

Run backend:
uvicorn main:app --reload

Backend runs at:

http://localhost:8000

🟩 3. Frontend Setup (Next.js)
cd api-monitor-frontend
npm install

Create .env.local:
NEXT_PUBLIC_API_BASE=http://localhost:8000/api

Run frontend:
npm run dev

Frontend runs at:

http://localhost:3000
