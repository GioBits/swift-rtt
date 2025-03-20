from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class UserRecord(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(256), unique= True, nullable=False)
    password_hash = Column(Text, nullable=False)
    first_name = Column(String(256), nullable=False)
    last_name = Column(String(256),nullable=False)
    last_login = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_activate = Column(Boolean, default=True, nullable=False)

    audio = relationship("AudioRecord", back_populates="user", cascade="all, delete-orphan")
    scores = relationship("ScoreRecord", back_populates="users")

class UsersBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    last_login: Optional[datetime] = None
    is_activate: bool = True

class UsersSchema(UsersBase):
    id: int
    class Config:
        from_attributes = True