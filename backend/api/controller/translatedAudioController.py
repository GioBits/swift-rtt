from fastapi import HTTPException, status
from api.service.translatedAudioService import get_translation_by_id, save_translated_audio

async def retrieve_translation_by_id_controller(id: int):
    try:
        result = get_translation_by_id(id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Audio Traducido no encontrado"
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

async def save_translated_audio_controller(audio_id: int, transcription: str, ):

    #mock
    audio_data: bytes = b"mock"
    file_size: int = 123456
    language: str = "en"

    try:
    
        translated_audio_record = save_translated_audio(
            audio_id,
            audio_data,
            file_size,
            transcription,
            language
        )

        return translated_audio_record
        
    except Exception as e:
        print(f"Error: {str(e)}")
        pass