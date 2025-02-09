from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Text
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional


class AudioRecord(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(255))
    user_id = Column(String(255), nullable=False, index=True)
    filename = Column(String(255))
    audio_data = Column(LargeBinary)
    content_type = Column(String(50))
    file_size = Column(Integer)
    transcription = Column(Text, nullable=True)  
    language = Column(String(50), nullable=True)  
    created_at = Column(DateTime, default=datetime.utcnow)

    translated_audios = relationship("TranslatedAudio", back_populates="original_audio")

class AudioRecordBase(BaseModel):
    chat_id: Optional[str] = None
    user_id: Optional[str] = None
    filename: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None
    transcription: Optional[str] = None
    language: Optional[str] = None
    created_at: Optional[datetime] = None

class AudioRecordSchema(AudioRecordBase):
    id: int

    class Config:
        orm_mode = True
