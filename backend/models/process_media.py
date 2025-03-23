from sqlalchemy import Column, Integer, ForeignKey, Enum
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from enum import Enum as PyEnum
from typing import Optional

class StatusType(PyEnum):
    DONE = "done"
    FAIL = "fail"
    PROCESS = "process"

class ProcessMediaRecord(Base):
    __tablename__ = 'process_media'

    id = Column(Integer, primary_key=True, index=True)
    audio_id = Column(Integer, ForeignKey("audios.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    providers_transcription = Column(Integer, ForeignKey("providers.id", ondelete="SET NULL"))
    providers_translation = Column(Integer, ForeignKey("providers.id", ondelete="SET NULL"))
    providers_generation = Column(Integer, ForeignKey("providers.id", ondelete="SET NULL")) 
    languages_from = Column(Integer, ForeignKey("languages.id", ondelete="SET NULL")) 
    languages_to = Column(Integer, ForeignKey("languages.id", ondelete="SET NULL"))

    status = Column(Enum(StatusType), nullable=False)  # Estado del proceso

    audio = relationship("AudioRecord", back_populates="process_media_records")
    user = relationship("UserRecord", back_populates="process_media_records")
    transcription_provider = relationship("ProviderRecord", foreign_keys=[providers_transcription])
    translation_provider = relationship("ProviderRecord", foreign_keys=[providers_translation])
    generation_provider = relationship("ProviderRecord", foreign_keys=[providers_generation])
    language_from = relationship("LanguageRecord", foreign_keys=[languages_from], overlaps="languages_to")
    language_to = relationship("LanguageRecord", foreign_keys=[languages_to], overlaps="languages_from")

class ProcessMediaSchema(BaseModel):
    id: int
    audio_id: int
    user_id: int
    providers_transcription: Optional[int] = None
    providers_translation: Optional[int] = None
    providers_generation: Optional[int] = None
    languages_from: Optional[int] = None
    languages_to: Optional[int] = None
    status: StatusType

    class Config:
        from_attributes = True