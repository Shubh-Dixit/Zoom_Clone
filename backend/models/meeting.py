"""
Modelo ORM para reuniones instantáneas (Meeting).
Una Meeting se crea cuando el usuario hace clic en 'New Meeting'.
"""
from sqlalchemy import Column, String, Boolean, DateTime, func
from database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    # UUID generado en el cliente o en el servicio
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False, default="Instant Meeting")
    host_name = Column(String, nullable=False)
    invite_link = Column(String, nullable=False)

    # True mientras la reunión sigue activa, False cuando termina
    is_active = Column(Boolean, nullable=False, default=True)

    started_at = Column(DateTime, nullable=False, server_default=func.now())
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
