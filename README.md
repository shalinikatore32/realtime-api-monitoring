# 🚀 Real-Time API Monitoring & Alerting System

A full-stack **Real-Time API Monitoring & Alerting System** built using **FastAPI**, **MongoDB**, **Next.js 14**, and **SWR**.  
It monitors APIs in real time, detects downtime & slow responses, generates alerts, stores logs, and displays insights on a modern dashboard UI.

---

## 🌟 Features

### 🔍 Real-Time API Health Monitoring
- Automated API checks (APScheduler)
- Tracks:
  - **Status Code**
  - **Response Time (ms)**
  - **UP / DOWN / SLOW** status
- Uptime tracking with timestamped logs

### 🚨 Smart Alerting System
- Alert levels: **OK**, **WARNING**, **CRITICAL**
- Multi-sample stabilization → avoids false alerts
- Generates alerts only on **state change**
- Stores alerts in MongoDB
- Real-time UI notifications
- **Email alerts for CRITICAL states**

### 📊 Dashboard Analytics
- KPI Stats:
  - Total requests
  - Success rate
  - Avg response time
- Response-time analytics chart (Recharts)
- Uptime analytics
- Real-time alert table
- Live logs viewer

### 🧭 Modern UI/UX
- Next.js 14 App Router
- Responsive dashboard layout
- Collapsible + hover-expand sidebar
- Dark mode supported
- Smooth animations (Framer Motion)
- Beautiful cards, tables & charts

---

# 🧱 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React + SWR
- TailwindCSS
- ShadCN UI
- Recharts
- Framer Motion

### **Backend**
- FastAPI
- APScheduler
- MongoDB (PyMongo)
- Requests
- Pydantic Models

### **Database**
- MongoDB Atlas / Local MongoDB

### **Notifications**
- SMTP Email alerts
- In-app UI notifications

---

# ⚙️ How It Works

### 1️⃣ Scheduler triggers checks
APScheduler runs every X seconds for each registered API.

### 2️⃣ Fetcher performs the health check
- Sends HTTP request
- Measures response time
- Determines state: `UP`, `DOWN`, `SLOW`
- Compares with previous state

### 3️⃣ Prevents false alerts  
Multi-sample verification ensures stability.

---

5️⃣ Alerts on state change

Example: UP → DOWN, SLOW → UP

6️⃣ Frontend updates in real-time  
SWR continuously fetches backend data → dashboard auto-refreshes.

---

# 📦 Installation & Setup

## 🔧 1. Clone the Repository
```bash
git clone https://github.com/shalinikatore32/realtime-api-monitoring
cd realtime-api-monitoring
```

## 🟦 2. Backend Setup (FastAPI)

### Install dependencies:
```bash
cd api-monitoring-system
pip install -r requirements.txt

cp .env.example .env

uvicorn server:app --reload


```

## 🟦 3. Frontend Setup (Next.js)
```bash
cd api-monitor-frontend
npm install
```
## Create .env.local:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

## Run frontend:
```bash
npm run dev
```

## Frontend runs at:
👉 http://localhost:3000

## 📁 Project Structure
🟩 Frontend (Next.js App)

```bash

api-monitor-frontend/
│
├── app/
│   ├── dashboard/
│   │   ├── alerts/
│   │   │   └── page.tsx
│   │   ├── logs/
│   │   │   └── page.tsx
│   │   ├── manage-apis/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── middleware.ts
│   └── page.tsx
│
├── components/
│   ├── custom/
│   │   ├── KPIStats.tsx
│   │   ├── LayoutWrapper.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationProvider.tsx
│   │   ├── ResponseTimeChart.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatusBanner.tsx
│   │
│   └── ui/
│
└── public/
    └── favicon.ico
```

## 🟦 Backend (FastAPI)
```bash
api-monitoring-system/
│
├── config/
│   ├── __init__.py
│   └── settings.py
│
├── core/
│   ├── fetcher.py
│   └── scheduler.py
│
├── database/
│   ├── connection.py
│   └── logger.py
│
├── middleware/
│   └── auth.py
│
├── models/
│   ├── api_alert.py
│   ├── api_config.py
│   ├── api_log.py
│   ├── api_status.py
│   └── user.py
│
├── routers/
│   ├── alerts.py
│   ├── api_status.py
│   ├── apis.py
│   ├── auth.py
│   └── logs.py
│
├── tests/
│
├── utils/
│
├── .env
├── requirements.txt
└── server.py
```
## 🔌 API Endpoints Overview
Auth

```bash
POST /api/auth/signup
POST /api/auth/login

```

## API Config
```bash

GET    /api/apis
POST   /api/apis
PUT    /api/apis/{id}
DELETE /api/apis/{id}

```

## Status & Logs
```bash
GET /api/status          # Current API statuses
GET /api/logs/{api_id}   # Logs for specific API

```

## Alerts
```bash
GET /api/alerts
```

