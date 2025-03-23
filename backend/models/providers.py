from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db.database import Base
from pydantic import BaseModel
from enum import Enum as PyEnum

class ProviderType(PyEnum):
    TRANSCRIPTION = "transcription"
    TRANSLATION = "translation"
    TTS = "tts"

class ProviderRecord(Base):
    __tablename__ = 'providers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    type = Column(Enum(ProviderType), nullable=False)

class ProviderSchema(BaseModel):
    id: int
    name: str
    type: ProviderType

    class Config:
        from_attributes = True