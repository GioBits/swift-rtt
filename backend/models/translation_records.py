from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class TranslationRecord(Base):
    __tablename__ = "translation_records"

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey('audios.id'))  # Foreign key to audios table
    transcription_id = Column(Integer, ForeignKey('transcription_records.id'))  # Foreign key to transcription_records table
    provider_id = Column(Integer, ForeignKey('translation_providers.id'))  # Foreign key to translation_providers table
    language_id = Column(Integer, ForeignKey('languages.id'))  # Foreign key to languages table
    translation_text = Column(Text, nullable=False)  # Translation text
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    audio = relationship("AudioRecord", back_populates="translations")
    transcription = relationship("TranscriptionRecord", back_populates="translation")
    provider = relationship("TranslationProviderRecord")
    language = relationship("LanguageRecord")

class TranslationRecordBase(BaseModel):
    audio_id: Optional[int] = None
    transcription_id: Optional[int] = None
    provider_id: Optional[int] = None
    language_id: Optional[int] = None
    translation_text: Optional[str] = None
    created_at: Optional[datetime] = None

class TranslationRecordSchema(TranslationRecordBase):
    id: int

    class Config:
        from_attributes = True