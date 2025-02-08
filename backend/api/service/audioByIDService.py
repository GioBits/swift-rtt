from sqlalchemy.orm import Session
from db.database import AudioRecord, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def retrieve_audio_by_ID(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()
    list = db.query(AudioRecord).all()

    #Search within list for audio with matching ID
    for i in list:
        if(i.id == id):
            return i
    return None