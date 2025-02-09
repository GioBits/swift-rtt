from sqlalchemy.orm import Session
from db.database import TranslatedAudio, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def get_translation_by_id(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()

    translation = db.query(TranslatedAudio).get(id)
    return translation