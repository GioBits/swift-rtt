from fastapi import HTTPException, status
from api.service.translatedAudioService import get_translation_by_id

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