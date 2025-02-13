from fastapi import APIRouter
from api.controller.translationController import (
    retrieve_all_translations_controller,
    create_translation_controller,
    retrieve_translation_by_id_controller,
    retrieve_translations_by_audio_id_controller
)
from models.translation_records import TranslationRecordSchema

router = APIRouter()

@router.get("/translations", response_model=list[TranslationRecordSchema], tags=["Translated text"])
async def get_translations():
    """
    Retrieves all translations.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await retrieve_all_translations_controller()

@router.post("/translations", response_model=TranslationRecordSchema, tags=["Translated text"])
async def add_translation(transcription_id: int, provider_id: int, language_id: int):
    """
    Adds a new translation.
    Args:
        transcription_id (int): The ID of the transcription.
        provider_id (int): The ID of the translation provider.
        language_id (int): The ID of the language.
    Returns:
        TranslationRecordSchema: The newly created translation object.
    """
    return await create_translation_controller(transcription_id, provider_id, language_id)

@router.get("/translations/{translation_id}", response_model=TranslationRecordSchema, tags=["Translated text"])
async def get_translation_by_id(translation_id: int):
    """
    Retrieves a translation by its ID.
    Args:
        translation_id (int): The ID of the translation.
    Returns:
        TranslationRecordSchema: The translation object.
    """
    return await retrieve_translation_by_id_controller(translation_id)

@router.get("/translations/audio/{audio_id}", response_model=list[TranslationRecordSchema], tags=["Translated text"])
async def get_translations_by_audio_id(audio_id: int):
    """
    Retrieves all translations for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await retrieve_translations_by_audio_id_controller(audio_id)