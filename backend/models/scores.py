from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from db.database import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScoreRecord(Base):
    __tablename__ = 'scores'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_translations = Column(Integer, default=0)  # TU
    total_languages_used = Column(Integer, default=0)  # IU
    total_users_translations = Column(Integer, default=0)  # MT
    total_system_languages = Column(Integer, default=0)  # IT
    different_users_contacted = Column(Integer, default=0)  # LU
    total_system_users = Column(Integer, default=0)  # MU
    score = Column(Float, default=0)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("UserRecord", back_populates="scores")

class ScoreBase(BaseModel):
    user_id: int
    total_translations: int = 0
    total_languages_used: int = 0
    total_users_translations: int = 0
    total_system_languages: int = 0
    different_users_contacted: int = 0
    total_system_users: int = 0
    score: float = 0.0
    last_updated: Optional[datetime] = None

class ScoresSchema(ScoreBase):
    id: int
    user_id: int
    score: float
    class Config:
        from_attributes = True