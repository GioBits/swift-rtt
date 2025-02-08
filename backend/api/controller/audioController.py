from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from api.service.audioService import save_audio, retrieve_audio_files
from models.audio import AudioRecord
from pybase64 import b64encode
from utils.transcribeController import transcription_control
from api.validators.audioValidations import validate_upload



async def process_audio(chat_id: str, user_id: str, transcription:str, language:str, file: UploadFile, db: Session) -> AudioRecord:
    """
    Función controladora para manejar la carga de un archivo de audio.

    Args:
        chat_id (str): El ID del chat asociado al audio.
        user_id (str): El nombre del usuario.
        transcription (str): El audio transcrito.
        language (str): El idioma del audio.
        file (UploadFile): Archivo de audio enviado por el cliente.
        db (Session): Sesión de la base de datos.

    Returns:
        AudioRecord: Registro del audio almacenado en la base de datos.
    """
    try:
        file_data = await validate_upload(file, language)
        
        transcription = await transcription_control(file_data)

        # Llamar a la capa de servicio para guardar el audio
        audio_record = save_audio(
            chat_id, 
            user_id,
            file_data, 
            file.filename, 
            file.content_type,
            transcription,
            language, 
            db
        )

        # Encode binary data to base64
        base64_encoded = b64encode(audio_record.audio_data).decode('utf-8')

        return {
            "id": audio_record.id,
            "user_id": audio_record.user_id,
            "filename": audio_record.filename, 
            "format": audio_record.content_type, 
            "size": len(audio_record.audio_data),
            "transcription": audio_record.transcription,
            "language": audio_record.language,
            "file": base64_encoded
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def retrieve_audio_controller():
    try:
        result = retrieve_audio_files()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)