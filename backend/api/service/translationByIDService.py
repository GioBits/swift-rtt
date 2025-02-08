from sqlalchemy.orm import Session
from db.database import TranslatedAudio, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def retrieve_translation_by_ID(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()

    translation = db.query(TranslatedAudio).get(id)
    return translation