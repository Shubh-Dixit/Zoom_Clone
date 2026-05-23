"""
Esquemas Pydantic para Meeting y Participant.
Separan la capa de validación/serialización de los modelos ORM.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MeetingCreate(BaseModel):
    """Datos necesarios para crear una reunión instantánea."""
    host_name: str
    title: str = "Instant Meeting"


class MeetingResponse(BaseModel):
    """Respuesta completa de una reunión (serializable a JSON)."""
    id: str
    title: str
    host_name: str
    invite_link: str
    is_active: bool
    started_at: datetime
    ended_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class ParticipantCreate(BaseModel):
    """Datos para registrar un nuevo participante en una reunión."""
    meeting_id: str
    username: str
    peer_id: str


class ParticipantResponse(BaseModel):
    id: int
    meeting_id: str
    username: str
    peer_id: str
    joined_at: datetime
    left_at: Optional[datetime]

    model_config = {"from_attributes": True}
