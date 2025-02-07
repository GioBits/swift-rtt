from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from fastapi.responses import JSONResponse
from api.controller.audioController import process_audio, retrieve_audio_controller
from sqlalchemy import select
from sqlalchemy.orm import Session
from models.audio import AudioRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio")
async def UploadAudio(uploadedAudio : UploadFile = File(...)):
    """
    Handles the upload of an audio file.
    Args:
        uploadedAudio (UploadFile): The audio file to be uploaded.
    Returns:
        JSONResponse: The response after processing the audio file.
    """

    #mock chat_id, userd_id, translation and language
    chat_id = "12345"
    user_id = "12345"
    transcription = "Procesando audio"
    language = "Español"

    response = await process_audio(chat_id, user_id, transcription, language, uploadedAudio, db=None)
    return JSONResponse(content=response)