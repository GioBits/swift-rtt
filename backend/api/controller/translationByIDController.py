from fastapi import HTTPException
from api.service.translationByIDService import retrieve_translation_by_ID

async def retrieve_translation_by_id_controller(id: int):
    try:
        result = retrieve_translation_by_ID(id)
        if result != None:
            return result
        else:
            print("ERROR: No audio with this ID found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)