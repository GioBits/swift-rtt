from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from datetime import datetime
from db.database import Base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
from typing import Optional

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(256), unique= True, nullable=False)
    password_hash = Column(Text, nullable=False) 
    first_name = Column(String(256), nullable=False)  
    last_name = Column(String(256),nullable=False) 
    last_login = Column(DateTime, default=datetime.utcnow, nullable=False) 
    is_activate = Column(Boolean, default=True, nullable=False)  

class UsersBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    last_login: Optional[datetime] = None
    is_activate: bool = True

class UsersSchema(UsersBase):
    id: int
    class Config:
        from_attributes = True