from fastapi import APIRouter, File, HTTPException, UploadFile, Depends, Request
from fastapi.responses import JSONResponse
from api.controller.audioController import process_audio, retrieve_audio_controller
from sqlalchemy import select
from sqlalchemy.orm import Session
from models.audio import AudioRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio")
async def UploadAudio(uploadedAudio: UploadFile = File(...)):
    """
    Handles the upload of an audio file.
    Args:
        validated_data: Recibe los datos de la validacion en un diccionario.
    Returns:
        JSONResponse: The response after processing the audio file.
    """

    #mock chat_id, userd_id, translation and language
    chat_id = "12345"
    user_id = "12345"
    transcription = "Procesando audio"
    language = "es"
    
    try:
        # Procesar el audio con las validaciones ya realizadas
        response = await process_audio(chat_id, user_id, transcription, language, uploadedAudio, db=None)
        
        return JSONResponse(content=response)
    except HTTPException as e:
        print(f"HTTPException capturada: {e.detail}")
        raise e
    except Exception as e:
        print(f"Excepción general capturada: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint "/audiolist", recupera una lista de archivos de la base de datos
@router.get("/audiolist", response_model=List[AudioRecordSchema])
async def retrieve_audiosFile_list():
    try:
        response = await retrieve_audio_controller()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error")
