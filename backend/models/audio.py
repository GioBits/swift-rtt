from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from datetime import datetime
from db.database import Base
from pydantic import BaseModel


class AudioRecord(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(255))
    filename = Column(String(255))
    audio_data = Column(LargeBinary)
    content_type = Column(String(50))
    file_size = Column(Integer)
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