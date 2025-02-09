from fastapi import HTTPException
from api.service.translationByIDService import retrieve_translation_by_ID

async def retrieve_translation_by_id_controller(id: int):
    try:
        result = retrieve_translation_by_ID(id)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)