from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary, Text
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class TranslatedAudioRecord(Base):
    __tablename__ = 'translated_audios'

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey('audios.id'))  # Foreign key to audios table
    translation_id = Column(Integer, ForeignKey('translation_records.id'))  # Foreign key to translation_records table
    provider_id = Column(Integer, ForeignKey('providers.id'))  # Foreign key to tts_providers table
    language_id = Column(Integer, ForeignKey('languages.id'))  # Foreign key to languages table
    audio_data = Column(LargeBinary)  # LargeBinary to store the audio file
    file_size = Column(Integer)  # File size in bytes
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    audio = relationship("AudioRecord", back_populates="translated_audio")
    translation = relationship("TranslationRecord", back_populates="translated_audio")
    provider = relationship("ProviderRecord")
    language = relationship("LanguageRecord")

class TranslatedAudioRecordBase(BaseModel):
    audio_id: Optional[int] = None
    translation_id: Optional[int] = None
    provider_id: Optional[int] = None
    language_id: Optional[int] = None
    file_size: Optional[int] = None
    transcription: Optional[str] = None
    created_at: Optional[datetime] = None

class TranslatedAudioRecordSchema(TranslatedAudioRecordBase):
    id: int

    class Config:
        from_attributes = True