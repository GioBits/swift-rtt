from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class TranscriptionRecord(Base):
    __tablename__ = "transcription_records"

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey('audios.id'))  # Foreign key to audios table
    provider_id = Column(Integer, ForeignKey('providers.id'))  # Foreign key to transcription_providers table
    language_id = Column(Integer, ForeignKey('languages.id'))  # Foreign key to languages table
    transcription_text = Column(Text, nullable=False)  # Transcription text
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    audio = relationship("AudioRecord", back_populates="transcriptions")
    translation = relationship("TranslationRecord", back_populates="transcription")
    provider = relationship("ProviderRecord")
    language = relationship("LanguageRecord")

class TranscriptionRecordBase(BaseModel):
    audio_id: Optional[int] = None
    provider_id: Optional[int] = None
    language_id: Optional[int] = None
    transcription_text: Optional[str] = None
    created_at: Optional[datetime] = None

class TranscriptionRecordSchema(TranscriptionRecordBase):
    id: int

    class Config:
        from_attributes = True