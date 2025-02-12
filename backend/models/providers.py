from sqlalchemy import Column, Integer, String
from db.database import Base
from pydantic import BaseModel

class TranscriptionProviderRecord(Base):
    __tablename__ = 'transcription_providers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # Name of the provider (e.g., 'Whisper')

class TranscriptionProviderSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class TranslationProviderRecord(Base):
    __tablename__ = 'translation_providers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # Name of the provider (e.g., 'Google Translate')

class TranslationProviderSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
    

class TTSProviderRecord(Base):
    __tablename__ = 'tts_providers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # Name of the provider (e.g., 'Google TTS')

class TTSProviderSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True