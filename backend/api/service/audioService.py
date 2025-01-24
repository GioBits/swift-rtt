from sqlalchemy.orm import Session
from models.audio import AudioRecord
from datetime import datetime

def save_audio(chat_id: str, file: bytes, filename: str, content_type: str, db: Session) -> AudioRecord:
    """
    Función de servicio para guardar un archivo de audio en la base de datos.

    Args:
        chat_id (str): El ID del chat asociado al audio.
        file (bytes): Datos binarios del archivo.
        filename (str): Nombre del archivo original.
        content_type (str): Tipo MIME del archivo.
        db (Session): Sesión de la base de datos.

    Returns:
        AudioRecord: El registro de audio guardado.
    """
    # Crear un nuevo registro en la base de datos
    audio_record = AudioRecord(
        chat_id=chat_id,
        filename=filename,
        audio_data=file,
        content_type=content_type,
        file_size=len(file),
        created_at=datetime.utcnow()
    )

    # Guardar el registro en la base de datos
    db.add(audio_record)
    db.commit()
    db.refresh(audio_record)

    return audio_record
