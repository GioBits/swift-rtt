from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from api.service.audioService import save_audio
from models.audio import AudioRecord
from pybase64 import b64encode


async def process_audio(chat_id: str, file: UploadFile, db: Session) -> AudioRecord:
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
        file_data = await file.read()

        # Verificar que los datos sean binarios
        if not isinstance(file_data, bytes):
            raise ValueError(
                "El archivo no se leyo correctamente como binario")

        filename = file.filename

        # Usando una variable booleana para indicar si es válido o inválido
        # Verifica el nombre no sea más de 255 caracteres de largo
        if len(file.filename) > 255:
            raise HTTPException(status_code=422, detail="File name too long")

        # Verifica que el archivo sea de un formato aceptado por el sistema
        valid_formats = {"audio/mpeg", "audio/mp3", "audio/wav"}
        if file.content_type not in valid_formats:
            raise HTTPException(status_code=422, detail="Invalid file format")

        # Verifica que el archivo no sea demasiado pesado (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB en Bytes
        if len(file_data) > max_size:
            raise HTTPException(
                status_code=422, detail="File size exceeds 10MB")

        # Llamar a la capa de servicio para guardar el audio
        audio_record = save_audio(
            chat_id,
            file_data,
            file.filename,
            file.content_type,
            db
        )

        # Encode binary data to base64
        base64_encoded = b64encode(audio_record.audio_data).decode('utf-8')

        return {
            "id": audio_record.id,
            "filename": audio_record.filename,
            "format": audio_record.content_type,
            "size": len(audio_record.audio_data),
            "file": base64_encoded
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
