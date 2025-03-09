from fastapi import APIRouter
from api.controller.translatedAudioController import TranslatedAudioController
from models.translated_audios import TranslatedAudioRecordSchema
from typing import List
from api.DTO.translated_audio.translatedAudioDTO import add_translated_audioDTO

router = APIRouter()
translated_audio_controller = TranslatedAudioController()

@router.get("/translated_audios", response_model=List[TranslatedAudioRecordSchema], tags=["Translated Audios"])
async def get_translated_audios():
    """
    Retrieves all translated audios.
    Returns:
        list: A list of TranslatedAudioRecordSchema objects.
    """
    return await translated_audio_controller.retrieve_all_translated_audios()

@router.post("/translated_audios", response_model=TranslatedAudioRecordSchema, tags=["Translated Audios"])
async def add_translated_audio(add_translated_audio_DTO : add_translated_audioDTO):
    """
    Adds a new translated audio.
    Args:
        translation_id (int): The ID of the translation.
        provider_id (int): The ID of the TTS provider.
    Returns:
        TranslatedAudioRecordSchema: The newly created translated audio object.
    """
    return await translated_audio_controller.create_translated_audio(add_translated_audio_DTO)

@router.get("/translated_audios/{translated_audio_id}", response_model=TranslatedAudioRecordSchema, tags=["Translated Audios"])
async def get_translated_audio_by_id(translated_audio_id: int):
    """
    Retrieves a translated audio by its ID.
    Args:
        translated_audio_id (int): The ID of the translated audio.
    Returns:
        TranslatedAudioRecordSchema: The translated audio object.
    """
    return await translated_audio_controller.retrieve_translated_audio_by_id(translated_audio_id)

@router.get("/translated_audios/audio/{audio_id}", response_model=List[TranslatedAudioRecordSchema], tags=["Translated Audios"])
async def get_translated_audios_by_audio_id(audio_id: int):
    """
    Retrieves all translated audios for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslatedAudioRecordSchema objects.
    """
    return await translated_audio_controller.retrieve_translated_audios_by_audio_id(audio_id)