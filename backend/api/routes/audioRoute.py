from fastapi import APIRouter, File, UploadFile
from api.controller.audioController import (
    create_audio_controller,
    retrieve_all_audios_controller,
    retrieve_audio_by_id_controller,
    retrieve_audios_by_user_id_controller
)
from models.audio import AudioRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio", response_model=AudioRecordSchema)
async def upload_audio(file: UploadFile = File(...)):
    """
    Handles the upload of an audio file.
    Args:
        user_id (str): The user ID.
        file (UploadFile): Audio file uploaded by the client.
    Returns:
        AudioRecordSchema: The response after processing the audio file.
    """
    user_id = 1
    language_id = 1
    return await create_audio_controller(user_id, language_id, file)

# Endpoint "/audio", recupera una lista de archivos de la base de datos
@router.get("/audio", response_model=List[AudioRecordSchema])
async def retrieve_audios_list():
    """
    Retrieves a list of audio files from the database.
    Returns:
        list: A list of AudioRecordSchema objects.
    """
    return await retrieve_all_audios_controller()

# Endpoint "/audio/{id}", recupera un audio de la base de datos
@router.get("/audio/{id}", response_model=AudioRecordSchema)
async def retrieve_audio_by_id(id: int):
    """
    Retrieves an audio file by its ID from the database.
    Args:
        id (int): The ID of the audio file.
    Returns:
        AudioRecordSchema: The audio file object.
    """
    return await retrieve_audio_by_id_controller(id)

# Endpoint "/audio/user/{user_id}", recupera todos los audios de un usuario
@router.get("/audio/user/{user_id}", response_model=List[AudioRecordSchema])
async def retrieve_audios_by_user_id(user_id: str):
    """
    Retrieves all audio files for a given user ID from the database.
    Args:
        user_id (str): The ID of the user.
    Returns:
        list: A list of AudioRecordSchema objects.
    """
    return await retrieve_audios_by_user_id_controller(user_id)