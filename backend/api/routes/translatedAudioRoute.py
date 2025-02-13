from fastapi import APIRouter, UploadFile, File
from api.controller.translatedAudioController import (
    retrieve_all_translated_audios_controller,
    create_translated_audio_controller,
    retrieve_translated_audio_by_id_controller,
    retrieve_translated_audios_by_audio_id_controller
)
from models.translated_audios import TranslatedAudioRecordSchema
from typing import List

router = APIRouter()

@router.get("/translated_audios", response_model=List[TranslatedAudioRecordSchema])
async def get_translated_audios():
    """
    Retrieves all translated audios.
    Returns:
        list: A list of TranslatedAudioRecordSchema objects.
    """
    return await retrieve_all_translated_audios_controller()

@router.post("/translated_audios", response_model=TranslatedAudioRecordSchema)
async def add_translated_audio(audio_id: int, translation_id: int, provider_id: int, language_id: int, audio_data: bytes = File(...)):
    """
    Adds a new translated audio.
    Args:
        audio_id (int): The ID of the audio.
        translation_id (int): The ID of the translation.
        provider_id (int): The ID of the TTS provider.
        language_id (int): The ID of the language.
        audio_data (bytes): The audio data.
    Returns:
        TranslatedAudioRecordSchema: The newly created translated audio object.
    """
    return await create_translated_audio_controller(audio_id, translation_id, provider_id, language_id, audio_data)

@router.get("/translated_audios/{translated_audio_id}", response_model=TranslatedAudioRecordSchema)
async def get_translated_audio_by_id(translated_audio_id: int):
    """
    Retrieves a translated audio by its ID.
    Args:
        translated_audio_id (int): The ID of the translated audio.
    Returns:
        TranslatedAudioRecordSchema: The translated audio object.
    """
    return await retrieve_translated_audio_by_id_controller(translated_audio_id)

@router.get("/translated_audios/audio/{audio_id}", response_model=List[TranslatedAudioRecordSchema])
async def get_translated_audios_by_audio_id(audio_id: int):
    """
    Retrieves all translated audios for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslatedAudioRecordSchema objects.
    """
    return await retrieve_translated_audios_by_audio_id_controller(audio_id)