from sqlalchemy.orm import Session
from fastapi import UploadFile
from service.audioService import save_audio
from models.audio import AudioRecord

def process_audio(chat_id: str, file: UploadFile, db: Session) -> AudioRecord:
    """
    Función controladora para manejar la carga de un archivo de audio.

    Args:
        chat_id (str): El ID del chat asociado al audio.
        file (UploadFile): Archivo de audio enviado por el cliente.
        db (Session): Sesión de la base de datos.

    Returns:
        AudioRecord: Registro del audio almacenado en la base de datos.
    """
    try:
        # Leer los datos binarios del archivo
        file_data = file.file.read()
        
        # Validaciones específicas del controlador
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
        if len(file_data) > MAX_FILE_SIZE:
            raise ValueError("El archivo es demasiado grande")
        
        # Llamar a la capa de servicio para guardar el audio
        audio_record = save_audio(
            chat_id=chat_id,
            file=file_data,
            filename=file.filename,
            content_type=file.content_type,
            db=db
        )
        return audio_record

    except Exception as e:
        raise e  # Opcional: puedes manejar o registrar errores específicos aquí.
