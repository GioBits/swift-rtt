from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from fastapi.responses import JSONResponse
from api.controller.audioController import process_audio, retrieve_audio
from sqlalchemy import select
from sqlalchemy.orm import Session
from models.audio import AudioRecord

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

    #mock chat_id
    chat_id = "12345"

    response = await process_audio(chat_id, uploadedAudio, db=None)
    return JSONResponse(content=response)

# Endpoint "/api/audios", recupera una lista de archivos de la base de datos
@router.get("/api/audios", response_model = list[AudioRecord])
async def Retrieve_AudiosFile_List(db : Session):
    try:
        response = await retrieve_audio(db=None)
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error")