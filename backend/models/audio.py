from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Text, ForeignKey
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional


class AudioRecord(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True)
    filename = Column(String(255))
    audio_data = Column(LargeBinary)
    content_type = Column(String(50))
    file_size = Column(Integer)  
    language_id = Column(Integer, ForeignKey('languages.id'))  
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to the Language model
    language = relationship("LanguageRecord")

    # Relationship to the TranscriptionRecord model
    transcriptions = relationship("TranscriptionRecord", back_populates="audio")
    translations = relationship("TranslationRecord", back_populates="audio")
    translated_audio = relationship("TranslatedAudioRecord", back_populates="audio")

class AudioRecordBase(BaseModel):
    user_id: Optional[str] = None
    filename: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None
    language_id: Optional[str] = None
    created_at: Optional[datetime] = None

class AudioRecordSchema(AudioRecordBase):
    id: int

    class Config:
        from_attributes = True
