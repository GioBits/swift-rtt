from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary, Text
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class TranslatedAudio(Base):
    __tablename__ = 'translated_audios'

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey('audios.id'))  # Suponiendo que la tabla original se llama 'audios'
    audio_data = Column(LargeBinary)  # Utilizamos LargeBinary para almacenar el archivo de audio
    file_size = Column(Integer)  # Tamaño del archivo en bytes
    language = Column(String(50))  # Idioma de la traducción
    transcription = Column(Text, nullable=True)  # Transcripción opcional
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Relación con el modelo de audio original
    # original_audio = relationship("AudioRecord", back_populates="translated_audios")

class TranslatedAudioBase(BaseModel):
    audio_id: Optional[str] = None
    file_size: Optional[int] = None
    language: Optional[str] = None
    transcription: Optional[str] = None
    created_at: Optional[datetime] = None

class TranslationRecordSchema(TranslatedAudioBase):
    id: int

    class Config:
        from_attributes = True
