"""
Router para las rutas REST de reuniones programadas (/api/scheduled).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.scheduled_meeting import ScheduledMeetingCreate, ScheduledMeetingResponse
from services import (
    create_scheduled_meeting,
    list_upcoming_meetings,
    list_all_scheduled,
    get_scheduled_by_id,
    delete_scheduled_meeting,
)

router = APIRouter(prefix="/api/scheduled", tags=["scheduled"])


@router.post("", response_model=ScheduledMeetingResponse, status_code=status.HTTP_201_CREATED)
def schedule_new_meeting(data: ScheduledMeetingCreate, db: Session = Depends(get_db)):
    """Crea y guarda una reunión programada desde el formulario."""
    return create_scheduled_meeting(db, data)


@router.get("/upcoming", response_model=List[ScheduledMeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    """Devuelve las reuniones programadas futuras para el panel 'Upcoming'."""
    return list_upcoming_meetings(db)


@router.get("", response_model=List[ScheduledMeetingResponse])
def get_all_scheduled(db: Session = Depends(get_db)):
    """Devuelve todas las reuniones programadas (pasadas y futuras)."""
    return list_all_scheduled(db)


@router.get("/{meeting_id}", response_model=ScheduledMeetingResponse)
def get_scheduled_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Obtiene una reunión programada por ID."""
    meeting = get_scheduled_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheduled meeting {meeting_id} not found",
        )
    return meeting


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_scheduled_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Elimina una reunión programada del calendario."""
    deleted = delete_scheduled_meeting(db, meeting_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheduled meeting {meeting_id} not found",
        )
