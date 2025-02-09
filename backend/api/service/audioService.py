from sqlalchemy.orm import Session
from  db.database import AudioRecord, SessionLocal
from fastapi import HTTPException
from datetime import datetime

def save_audio(chat_id: str, user_id:str, file_data: bytes, filename: str, content_type: str, 
               transcription:str, language:str, db: Session) -> AudioRecord:
    """
    Función de servicio para guardar un archivo de audio en la base de datos.

    Args:
        chat_id (str): El ID del chat asociado al audio.
        user_id (str): El nombre del usuarip
        filename (str): Nombre del archivo de audio.
        file_data (bytes): Datos binarios del archivo de audio.
        content_type (str): Tipo de contenido del archivo de audio.
        transcription (str): Audio en texto
        language (str): Lenguaje del archivo
        db (Session): Sesión de la base de datos.

    Returns:
        AudioRecord: Registro del audio almacenado en la base de datos.
    """

    # Crear una sesión de base de datos
    if not db:
        db = SessionLocal()

    audio_record = AudioRecord(
        chat_id=chat_id,
        user_id=user_id,
        filename=filename,
        audio_data=file_data,
        content_type=content_type,
        file_size=len(file_data),
        transcription =transcription,
        language=language,
        created_at=datetime.utcnow()
    )

    # Guardar el registro en la base de datos
    db.add(audio_record)
    db.commit()
    db.refresh(audio_record)
    return audio_record

# Retorna lista de todos los audios
def retrieve_audio_files():
    # Crear una sesión de base de datos
    db = SessionLocal()
    list = db.query(AudioRecord).all()
    return list

# Retorna el audio con el ID dado
def retrieve_audio_by_id(id : int):
    # Crear una sesión de base de datos
    db = SessionLocal()
    record = db.query(AudioRecord).get(id)
    return record