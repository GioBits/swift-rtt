from fastapi import APIRouter, HTTPException
from api.controller.audioController import retrieve_audio_controller
from models.audio import AudioRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/audiolist", recupera una lista de archivos de la base de datos
@router.get("/audiolist", response_model=List[AudioRecordSchema])
async def retrieve_audiosFile_list():
    try:
        response = await retrieve_audio_controller()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error")