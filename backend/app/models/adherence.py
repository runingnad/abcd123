import datetime as dt
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from app.models.base import Base

class AdherenceLog(Base):
    __tablename__ = "adherence_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    medication = Column(String, nullable=False)
    due_time = Column(DateTime, nullable=False)
    taken = Column(Boolean, default=False)
    logged_at = Column(DateTime, default=dt.datetime.utcnow)
