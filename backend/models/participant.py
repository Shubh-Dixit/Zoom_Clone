"""
Modelo ORM para participantes de una reunión.
Un participante se registra cuando un usuario se une a un Meeting.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Relación con la tabla meetings
    meeting_id = Column(
        String,
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    username = Column(String, nullable=False)
    peer_id = Column(String, nullable=False)

    joined_at = Column(DateTime, nullable=False, server_default=func.now())
    left_at = Column(DateTime, nullable=True)
