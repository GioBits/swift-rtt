from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Boolean, ForeignKey
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional, List



class AudioRecord(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    filename = Column(String(255))
    audio_data = Column(LargeBinary, nullable=True)
    content_type = Column(String(50), nullable=True)
    file_size = Column(Integer, nullable=True)  
    language_id = Column(Integer, ForeignKey('languages.id'))
    is_audio_valid = Column(Boolean, default=False)
    validation_error = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to the Language model
    language = relationship("LanguageRecord")

    # Relationship to the TranscriptionRecord model
    transcriptions = relationship("TranscriptionRecord", back_populates="audio")
    translations = relationship("TranslationRecord", back_populates="audio")
    translated_audio = relationship("TranslatedAudioRecord", back_populates="audio")
    
    user = relationship("UserRecord", back_populates="audio")
    process_media_records = relationship("ProcessMediaRecord", back_populates="audio")
class AudioRecordBase(BaseModel):
    user_id: Optional[int] = None
    filename: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None
    language_id: Optional[int] = None
    is_audio_valid: Optional[bool] = None
    validation_error: Optional[str] = None
    created_at: Optional[datetime] = None

class AudioRecordSchema(AudioRecordBase):
    id: int
    audio_data: Optional[bytes] = None

    class Config:
        from_attributes = True

class AudioResponseSchema(AudioRecordBase):
    id: int

    class Config:
        from_attributes = True

class AudioResponseWithAudioSchema(AudioRecordBase):
    id: int
    audio_data: Optional[str] = None

    class Config:
        from_attributes = True

class PaginationSchema(BaseModel):
    page: int
    size: int
    total_items: int
    total_pages: int

class AudioListResponseSchema(BaseModel):
    pagination: PaginationSchema
    data: List[AudioResponseSchema]