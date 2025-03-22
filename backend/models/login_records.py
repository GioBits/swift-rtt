from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import sys
import os

# Ajusta esta importación según la estructura de tu proyecto
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import Base

class LoginRecord(Base):
    """
    Modelo para registrar los intentos de inicio de sesión de los usuarios.
    Almacena información sobre cada intento, exitoso o fallido.
    """
    __tablename__ = 'login_records'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    username = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relación con el usuario (si tu modelo de usuario se llama User)
    user = relationship("User", back_populates="login_records")
    

# Esquemas Pydantic para la API
class LoginRecordBase(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
