from fastapi import APIRouter
from api.controller.translationController import (
    retrieve_all_translations_controller,
    create_translation_controller,
    retrieve_translation_by_id_controller,
    retrieve_translations_by_audio_id_controller
)
from models.translation_records import TranslationRecordSchema

router = APIRouter()

@router.get("/translations", response_model=list[TranslationRecordSchema])
async def get_translations():
    """
    Retrieves all translations.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await retrieve_all_translations_controller()

@router.post("/translations", response_model=TranslationRecordSchema)
async def add_translation(audio_id: int, transcription_id: int, provider_id: int, language_id: int, translation_text: str):
    """
    Adds a new translation.
    Args:
        audio_id (int): The ID of the audio.
        transcription_id (int): The ID of the transcription.
        provider_id (int): The ID of the translation provider.
        language_id (int): The ID of the language.
        translation_text (str): The translation text.
    Returns:
        TranslationRecordSchema: The newly created translation object.
    """
    return await create_translation_controller(audio_id, transcription_id, provider_id, language_id, translation_text)

@router.get("/translations/{translation_id}", response_model=TranslationRecordSchema)
async def get_translation_by_id(translation_id: int):
    """
    Retrieves a translation by its ID.
    Args:
        translation_id (int): The ID of the translation.
    Returns:
        TranslationRecordSchema: The translation object.
    """
    return await retrieve_translation_by_id_controller(translation_id)

@router.get("/translations/audio/{audio_id}", response_model=list[TranslationRecordSchema])
async def get_translations_by_audio_id(audio_id: int):
    """
    Retrieves all translations for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await retrieve_translations_by_audio_id_controller(audio_id)