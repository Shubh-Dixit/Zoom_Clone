"""
Router para las rutas REST de Meetings (/api/meetings).
Mantiene los endpoints delgados delegando la lógica al servicio.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.meeting import MeetingCreate, MeetingResponse
from services import (
    create_meeting,
    get_meeting_by_id,
    list_recent_meetings,
    end_meeting,
)

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
def create_new_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    """
    Crea una reunión instantánea: genera UUID, guarda en DB, 
    devuelve el meeting completo con invite_link.
    """
    return create_meeting(db, data)


@router.get("", response_model=List[MeetingResponse])
def get_recent_meetings(limit: int = 10, db: Session = Depends(get_db)):
    """Devuelve las últimas {limit} reuniones para la sección 'Recent'."""
    return list_recent_meetings(db, limit)


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """
    Valida que una reunión existe antes de permitir el acceso.
    El frontend llama a esto al navegar a /meeting/[id].
    """
    meeting = get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting {meeting_id} not found",
        )
    return meeting


@router.patch("/{meeting_id}/end", response_model=MeetingResponse)
def end_active_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """
    Marca una reunión como terminada cuando el host hace clic en Leave.
    """
    meeting = end_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting {meeting_id} not found",
        )
    return meeting
