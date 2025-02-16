from fastapi import APIRouter, File, UploadFile, Query, HTTPException
from api.controller.audioController import (
    create_audio_controller,
    retrieve_all_audios_controller,
    retrieve_audio_by_id_controller,
    retrieve_audios_by_user_id_controller
)
from models.audio import AudioResponseSchema, AudioResponseWithAudioSchema, AudioListResponseSchema
from typing import List

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio", response_model=AudioResponseWithAudioSchema, tags=["Audio"])
async def upload_audio(file: UploadFile = File(...)):
    """
    Handles the upload of an audio file.
    Args:
        user_id (str): The user ID.
        file (UploadFile): Audio file uploaded by the client.
    Returns:
        AudioResponseSchema: The response after processing the audio file.
    """
    user_id = 1
    language_id = 2
    return await create_audio_controller(user_id, language_id, file)

# Endpoint "/audio", recupera una lista de archivos de la base de datos
@router.get("/audio", response_model=AudioListResponseSchema, tags=["Audio"])
async def retrieve_audios_list(
    page: int = Query(1, ge=1, description="Número de página"),
    size: int = Query(10, ge=1, le=50, description="Número de elementos por página")
):
    """
    Retrieves a paginated list of audio files from the database.
    Args:
        page (int): The page number to retrieve.
        size (int): The number of items per page.
    Returns:
        list: A list of AudioResponseSchema objects.
    """
    try:
        if page < 1 or size < 1:
            raise HTTPException(status_code=400, detail="Page y size deben ser números positivos.")
        
        return await retrieve_all_audios_controller(page, size)
    except HTTPException as e:
        raise e

# Endpoint "/audio/{id}", recupera un audio de la base de datos
@router.get("/audio/{id}", response_model=AudioResponseWithAudioSchema, tags=["Audio"])
async def retrieve_audio_by_id(id: int):
    """
    Retrieves an audio file by its ID from the database.
    Args:
        id (int): The ID of the audio file.
    Returns:
        AudioResponseSchema: The audio file object.
    """
    return await retrieve_audio_by_id_controller(id)

# Endpoint "/audio/user/{user_id}", recupera todos los audios de un usuario
@router.get("/audio/user/{user_id}", response_model=List[AudioResponseSchema], tags=["Audio"])
async def retrieve_audios_by_user_id(user_id: int):
    """
    Retrieves all audio files for a given user ID from the database.
    Args:
        user_id (str): The ID of the user.
    Returns:
        list: A list of AudioResponseSchema objects.
    """
    return await retrieve_audios_by_user_id_controller(user_id)