"""
Modelo ORM para reuniones programadas (ScheduledMeeting).
Se crean desde la pantalla 'Schedule Meeting' con fecha/hora futura.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from database import Base


class ScheduledMeeting(Base):
    __tablename__ = "scheduled_meetings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    host_name = Column(String, nullable=False)

    # UUID único para el enlace de la sala
    meeting_id = Column(String, nullable=False, unique=True, index=True)

    scheduled_at = Column(DateTime, nullable=False)
    duration_min = Column(Integer, nullable=False, default=60)
    is_recurring = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
