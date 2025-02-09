from sqlalchemy.orm import Session
from db.database import TranslatedAudio, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def get_translation_by_id(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()

    translation = db.query(TranslatedAudio).get(id)
    return translation

def save_translated_audio(
        audio_id: int, 
        audio_data: bytes, 
        file_size: int, 
        transcription: str, 
        language: str
    ):
    # Crear una sesión de base de datos
    db = SessionLocal()

    audio_translated_record = TranslatedAudio(
        audio_id=audio_id,
        audio_data=audio_data,
        file_size=file_size,
        transcription=transcription,
        language=language,
        created_at=datetime.now()
    )

    # Guardar el registro en la base de datos
    db.add(audio_translated_record)
    db.commit()
    db.refresh(audio_translated_record)
    return audio_translated_record