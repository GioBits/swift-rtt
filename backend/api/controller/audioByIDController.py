from fastapi import HTTPException
from api.service.audioService import retrieve_audio_files

async def retrieve_audio_by_id_controller(id: int):
    try:
        result = retrieve_audio_files(id)
        if result != None:
            return result
        else:
            print("ERROR: No audio with this ID found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)