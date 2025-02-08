from sqlalchemy.orm import Session
from db.database import TranslatedAudio, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def retrieve_translation_by_ID(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()

    #TODO: añadir código para buscar traducciones de la base de datos
    list = db.query(TranslatedAudio).all()
    for i in list:
        if(i.id == id):
            return i
    return None