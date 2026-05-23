"""
Esquemas Pydantic para ScheduledMeeting.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ScheduledMeetingCreate(BaseModel):
    """Datos del formulario de Schedule Meeting."""
    title: str
    description: Optional[str] = None
    host_name: str
    scheduled_at: datetime
    duration_min: int = 60
    is_recurring: bool = False


class ScheduledMeetingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    host_name: str
    meeting_id: str
    scheduled_at: datetime
    duration_min: int
    is_recurring: bool
    created_at: datetime

    model_config = {"from_attributes": True}
