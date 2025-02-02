from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Text
from datetime import datetime
from db.database import Base
from pydantic import BaseModel


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

class AudioRecordBase(BaseModel):
    chat_id: str
    filename: str
    content_type: str
    file_size: int
    created_at: datetime

class AudioRecordSchema(AudioRecordBase):
    id: int

    class Config:
        orm_mode = True
