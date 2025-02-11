from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile, status
from api.service.audioService import save_audio, retrieve_audio_files, retrieve_audio_by_id
from models.audio import AudioRecord
from pybase64 import b64encode
from utils.transcribe import transcriber
from utils.translate import translate
from api.validators.audioValidations import validate_upload
from api.controller.translatedAudioController import save_translated_audio_controller



async def process_audio(user_id: str, transcription:str, language:str, file: UploadFile, db: Session) -> AudioRecord:
    """
    Función controladora para manejar la carga de un archivo de audio.

    Args:
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
        
        transcription = await transcriber.transcription_handler(file_data)

        # Llamar a la capa de servicio para guardar el audio
        audio_record = save_audio( 
            user_id,
            file_data, 
            file.filename, 
            file.content_type,
            transcription,
            language, 
            db
        )

        #Traducir el texto transcrito
        translated_text = translate.translate_text(transcription)
        
        #Llamar a la capa de controlador para guardar el audio traducido
        audio_translated_record = await save_translated_audio_controller(audio_record.id, translated_text)

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
            "translated_text": translated_text,
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
    
async def retrieve_audio_by_id_controller(id: int):
    try:
        result = retrieve_audio_by_id(id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Audio no encontrado"
            )

        return result
        
    except HTTPException as e:
        print(f"HTTPException capturada: {e.detail}")
        raise e
    except Exception as e:  # Capturar excepciones generales
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Internal Server Error"
        )