from fastapi import APIRouter, File, UploadFile, Query, Depends, HTTPException
from api.controller.audioController import AudioController
from api.DTO.audio.audioRequestDTO import create_audioDTO, process_mediaDTO, retrieve_audios_listDTO
from utils.auth import AuthUtils
from models.audio import AudioResponseSchema, AudioResponseWithAudioSchema, AudioListResponseSchema
from typing import List

router = APIRouter()
audio_controller = AudioController()
auth = AuthUtils()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio", response_model=AudioResponseWithAudioSchema, dependencies=[Depends(auth.validate_token)], tags=["Audio"])
async def create_audio( create_audio_DTO : create_audioDTO = Depends() ):
    """
    Handles the upload of an audio file.
    Args:
        user_id (str): The user ID.
        file (UploadFile): Audio file uploaded by the client.
    Returns:
        AudioResponseSchema: The response after processing the audio file.
    """
    return await audio_controller.create_audio(create_audio_DTO)

# Endpoint "/audio", recupera una lista de archivos de la base de datos
@router.get("/audio", response_model=AudioListResponseSchema, dependencies=[Depends(auth.validate_token)], tags=["Audio"])
async def retrieve_audios_list(retrieve_audios_list_DTO : retrieve_audios_listDTO = Depends()):
    """
    Retrieves a paginated list of audio files from the database.
    Args:
        page (int): The page number to retrieve.
        size (int): The number of items per page.
    Returns:
        list: A list of AudioResponseSchema objects.
    """
    try:
        if retrieve_audios_list_DTO.page < 1 or retrieve_audios_list_DTO.size < 1:
            raise HTTPException(status_code=400, detail="Page y size deben ser números positivos.")
        
        return await audio_controller.retrieve_all_audios(retrieve_audios_list_DTO)
    except HTTPException as e:
        raise e

# Endpoint "/audio/{id}", recupera un audio de la base de datos
@router.get("/audio/{id}", dependencies=[Depends(auth.validate_token)], response_model=AudioResponseWithAudioSchema, tags=["Audio"])
async def retrieve_audio_by_id(id: int):
    """
    Retrieves an audio file by its ID from the database.
    Args:
        id (int): The ID of the audio file.
    Returns:
        AudioResponseSchema: The audio file object.
    """
    return await audio_controller.retrieve_audio_by_id(id)

# Endpoint "/audio/user/{user_id}", recupera todos los audios de un usuario
@router.get("/audio/user/{user_id}", dependencies=[Depends(auth.validate_token)], response_model=List[AudioResponseSchema], tags=["Audio"])
async def retrieve_audios_by_user_id(user_id: int):
    """
    Retrieves all audio files for a given user ID from the database.
    Args:
        user_id (str): The ID of the user.
    Returns:
        list: A list of AudioResponseSchema objects.
    """
    return await audio_controller.retrieve_audios_by_user_id(user_id)