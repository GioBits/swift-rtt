from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from api.service.audioService import save_audio
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
        # Verificar que los datos sean binarios
        if not isinstance(file_data, bytes):
            raise ValueError("El archivo no se leyó correctamente como binario")

        print(f"contenido: {file.content_type}")
        # Validaciones específicas del controlador
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
        if len(file_data) > MAX_FILE_SIZE:
            raise ValueError("El archivo es demasiado grande")
        
        # Llamar a la capa de servicio para guardar el audio
        audio_record = save_audio(chat_id, file_data, file.filename, file.content_type, db)
        return audio_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
