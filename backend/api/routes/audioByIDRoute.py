from fastapi import APIRouter, HTTPException
from api.controller.audioByIDController import retrieve_audio_by_id_controller
from models.audio import AudioRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/audioID", recupera un audio de la base de datos
@router.get("/audioID", response_model=List[AudioRecordSchema])
async def retrieve_audio_by_ID(id : int):
    try:
        response = await retrieve_audio_by_id_controller(id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error")