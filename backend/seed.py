"""
Script de semilla para poblar la base de datos con datos de muestra.
Ejecutar: python seed.py
"""
import sys
import os
from datetime import datetime, timedelta

# Asegurar que el directorio backend esté en el path
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
import models  # noqa: F401 — registra modelos en Base.metadata
from models.meeting import Meeting
from models.scheduled_meeting import ScheduledMeeting

Base.metadata.create_all(bind=engine)

SAMPLE_MEETINGS = [
    {
        "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        "title": "Team Standup",
        "host_name": "Alex Johnson",
        "invite_link": "http://localhost:3000/meeting/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        "is_active": False,
        "started_at": datetime.utcnow() - timedelta(hours=3),
        "ended_at": datetime.utcnow() - timedelta(hours=2, minutes=30),
    },
    {
        "id": "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
        "title": "Product Review",
        "host_name": "Maria Garcia",
        "invite_link": "http://localhost:3000/meeting/b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
        "is_active": False,
        "started_at": datetime.utcnow() - timedelta(days=1),
        "ended_at": datetime.utcnow() - timedelta(days=1) + timedelta(hours=1),
    },
    {
        "id": "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
        "title": "Design Sprint",
        "host_name": "Sam Lee",
        "invite_link": "http://localhost:3000/meeting/c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
        "is_active": False,
        "started_at": datetime.utcnow() - timedelta(days=2),
        "ended_at": datetime.utcnow() - timedelta(days=2) + timedelta(minutes=45),
    },
]

SAMPLE_SCHEDULED = [
    {
        "title": "Weekly All-Hands",
        "description": "Company-wide sync meeting every Monday",
        "host_name": "Alex Johnson",
        "meeting_id": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
        "scheduled_at": datetime.utcnow() + timedelta(hours=2),
        "duration_min": 60,
        "is_recurring": True,
    },
    {
        "title": "1:1 with Manager",
        "description": "Weekly check-in",
        "host_name": "Maria Garcia",
        "meeting_id": "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
        "scheduled_at": datetime.utcnow() + timedelta(days=1, hours=3),
        "duration_min": 30,
        "is_recurring": False,
    },
    {
        "title": "Sprint Planning Q3",
        "description": "Quarterly sprint planning session",
        "host_name": "Sam Lee",
        "meeting_id": "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
        "scheduled_at": datetime.utcnow() + timedelta(days=3),
        "duration_min": 120,
        "is_recurring": False,
    },
    {
        "title": "Client Demo",
        "description": "Product demo for Acme Corp",
        "host_name": "Alex Johnson",
        "meeting_id": "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
        "scheduled_at": datetime.utcnow() + timedelta(days=5),
        "duration_min": 45,
        "is_recurring": False,
    },
]


def seed():
    db = SessionLocal()
    try:
        # Limpiar datos existentes antes de sembrar
        db.query(Meeting).delete()
        db.query(ScheduledMeeting).delete()
        db.commit()

        # Insertar reuniones recientes
        for m_data in SAMPLE_MEETINGS:
            meeting = Meeting(**m_data)
            db.add(meeting)

        # Insertar reuniones programadas
        for s_data in SAMPLE_SCHEDULED:
            scheduled = ScheduledMeeting(**s_data)
            db.add(scheduled)

        db.commit()
        print(f"[OK] Seeded {len(SAMPLE_MEETINGS)} meetings and {len(SAMPLE_SCHEDULED)} scheduled meetings")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
