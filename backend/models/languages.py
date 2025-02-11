from sqlalchemy import Column, Integer, String
from db.database import Base
from pydantic import BaseModel

class LanguageRecord(Base):
    __tablename__ = 'languages'

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, nullable=False)  # code of the language(e.g., 'en', 'es')
    name = Column(String(50), nullable=False)  # name of the language (e.g., 'English', 'Español')

class LanguageSchema(BaseModel):
    id: int
    code: str
    name: str

    class Config:
        from_attributes = True