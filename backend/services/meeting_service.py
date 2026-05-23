"""
Capa de servicio para operaciones de Meeting y Participant.
Encapsula toda la lógica de negocio, manteniendo los routers delgados.
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import desc

from models.meeting import Meeting
from models.participant import Participant
from schemas.meeting import MeetingCreate

# URL base del frontend — se configura via env var en producción
_DEFAULT_BASE_URL = "http://localhost:3000"


def generate_meeting_id() -> str:
    """Genera un UUID v4 estándar para identificar la reunión."""
    return str(uuid.uuid4())


def build_invite_link(meeting_id: str, base_url: str | None = None) -> str:
    """Construye el enlace de invitación completo para compartir."""
    url = base_url or os.getenv("BASE_URL", _DEFAULT_BASE_URL)
    return f"{url}/meeting/{meeting_id}"


def create_meeting(db: Session, data: MeetingCreate) -> Meeting:
    """
    Crea una nueva reunión instantánea en la base de datos.
    Genera el ID y el enlace de invitación automáticamente.
    """
    meeting_id = generate_meeting_id()
    invite_link = build_invite_link(meeting_id)

    meeting = Meeting(
        id=meeting_id,
        title=data.title,
        host_name=data.host_name,
        invite_link=invite_link,
        is_active=True,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def get_meeting_by_id(db: Session, meeting_id: str) -> Optional[Meeting]:
    """Busca una reunión por su UUID. Retorna None si no existe."""
    return db.query(Meeting).filter(Meeting.id == meeting_id).first()


def list_recent_meetings(db: Session, limit: int = 10) -> List[Meeting]:
    """Devuelve las reuniones más recientes, ordenadas por fecha de creación."""
    return (
        db.query(Meeting)
        .order_by(desc(Meeting.created_at))
        .limit(limit)
        .all()
    )


def end_meeting(db: Session, meeting_id: str) -> Optional[Meeting]:
    """
    Marca una reunión como terminada (is_active=False) y registra 
    la hora de finalización.
    """
    meeting = get_meeting_by_id(db, meeting_id)
    if not meeting:
        return None

    meeting.is_active = False
    meeting.ended_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting


def add_participant(
    db: Session, meeting_id: str, username: str, peer_id: str
) -> Participant:
    """Registra un nuevo participante cuando se une a una reunión."""
    participant = Participant(
        meeting_id=meeting_id,
        username=username,
        peer_id=peer_id,
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


def remove_participant(db: Session, meeting_id: str, peer_id: str) -> None:
    """Registra la hora de salida cuando un participante abandona la reunión."""
    participant = (
        db.query(Participant)
        .filter(
            Participant.meeting_id == meeting_id,
            Participant.peer_id == peer_id,
            Participant.left_at.is_(None),
        )
        .first()
    )
    if participant:
        participant.left_at = datetime.utcnow()
        db.commit()


def check_username_exists(db: Session, meeting_id: str, username: str) -> bool:
    """
    Verifica si ya existe un participante activo con el mismo nombre
    en la misma reunión.
    """
    existing = (
        db.query(Participant)
        .filter(
            Participant.meeting_id == meeting_id,
            Participant.username == username,
            Participant.left_at.is_(None),
        )
        .first()
    )
    return existing is not None
