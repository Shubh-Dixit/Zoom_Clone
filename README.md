# ZoomCall — Zoom Web App Clone

A professional video conferencing app built as a university assignment. Visually and functionally inspired by Zoom.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS v4 · Lucide Icons |
| Backend | FastAPI · Python-SocketIO (ASGI) |
| Database | SQLite · SQLAlchemy |
| Real-time | Socket.IO · PeerJS (WebRTC) |

## Project Structure

```
ZoomCall/
├── backend/          ← FastAPI server
│   ├── main.py       ← Entry point (FastAPI + Socket.IO)
│   ├── database.py   ← SQLite engine
│   ├── models/       ← ORM models (Meeting, Participant, ScheduledMeeting)
│   ├── schemas/      ← Pydantic schemas
│   ├── routers/      ← REST API routes
│   ├── services/     ← Business logic layer
│   └── seed.py       ← Sample data seeder
└── frontend/         ← Next.js app
    ├── app/          ← Pages (/, /meetings, /schedule, /meeting/[id])
    ├── components/   ← UI components
    ├── hooks/        ← useSocket, usePeer
    └── lib/          ← API client, utilities
```

## Quick Start

### 1. Start the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python seed.py        # Optional: seed sample data
venv\Scripts\uvicorn main:socket_app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## Features

- **Dashboard** — Live clock, action cards, upcoming & recent meetings
- **New Instant Meeting** — UUID generation, DB save, invite link, copy-to-clipboard
- **Join Meeting** — Server-side meeting validation before entry
- **Schedule Meeting** — Full form with title, date/time, duration, recurring flag
- **Upcoming Meetings** — From SQLite, start or delete
- **Recent Meetings** — History from DB with copy invite link
- **Meeting Room** — WebRTC video tiles, dark UI, control bar (mute/camera/chat/leave)
- **Real-time Chat** — Socket.IO chat panel inside meetings

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/meetings` | Create instant meeting |
| GET | `/api/meetings` | List recent meetings |
| GET | `/api/meetings/{id}` | Get/validate meeting |
| PATCH | `/api/meetings/{id}/end` | End a meeting |
| POST | `/api/scheduled` | Schedule a meeting |
| GET | `/api/scheduled/upcoming` | Get upcoming meetings |
| DELETE | `/api/scheduled/{id}` | Delete scheduled meeting |
| GET | `/api/health` | Health check |
