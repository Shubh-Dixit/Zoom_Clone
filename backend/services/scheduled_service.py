"""
Capa de servicio para reuniones programadas (ScheduledMeeting).
"""
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import asc

from models.scheduled_meeting import ScheduledMeeting
from schemas.scheduled_meeting import ScheduledMeetingCreate


def create_scheduled_meeting(
    db: Session, data: ScheduledMeetingCreate
) -> ScheduledMeeting:
    """
    Guarda una reunión programada en la base de datos.
    Genera automáticamente el meeting_id para el enlace de la sala.
    """
    meeting = ScheduledMeeting(
        title=data.title,
        description=data.description,
        host_name=data.host_name,
        meeting_id=str(uuid.uuid4()),
        scheduled_at=data.scheduled_at,
        duration_min=data.duration_min,
        is_recurring=data.is_recurring,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def list_upcoming_meetings(db: Session) -> List[ScheduledMeeting]:
    """
    Devuelve las reuniones programadas en el futuro, ordenadas 
    cronológicamente (la más próxima primero).
    """
    now = datetime.utcnow()
    return (
        db.query(ScheduledMeeting)
        .filter(ScheduledMeeting.scheduled_at >= now)
        .order_by(asc(ScheduledMeeting.scheduled_at))
        .all()
    )


def list_all_scheduled(db: Session) -> List[ScheduledMeeting]:
    """Devuelve todas las reuniones programadas, incluyendo las pasadas."""
    return (
        db.query(ScheduledMeeting)
        .order_by(asc(ScheduledMeeting.scheduled_at))
        .all()
    )


def get_scheduled_by_id(db: Session, meeting_id: int) -> Optional[ScheduledMeeting]:
    """Busca una reunión programada por su ID numérico."""
    return (
        db.query(ScheduledMeeting)
        .filter(ScheduledMeeting.id == meeting_id)
        .first()
    )


def delete_scheduled_meeting(db: Session, meeting_id: int) -> bool:
    """
    Elimina una reunión programada. 
    Retorna True si fue eliminada, False si no existía.
    """
    meeting = get_scheduled_by_id(db, meeting_id)
    if not meeting:
        return False
    db.delete(meeting)
    db.commit()
    return True
