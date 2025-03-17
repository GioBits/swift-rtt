from fastapi import Depends, APIRouter
from api.controller.translationController import TranslationController
from models.translation_records import TranslationRecordSchema
from typing import List
from utils.auth import AuthUtils
from api.DTO.translation.translationRequestDTO import add_translationDTO

auth = AuthUtils()
router = APIRouter()
translation_controller = TranslationController()

@router.get("/translations", response_model=List[TranslationRecordSchema], dependencies=[Depends(auth.validate_token)], tags=["Translated text"])
async def get_translations():
    """
    Retrieves all translations.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await translation_controller.retrieve_all_translations()

@router.post("/translations", response_model=TranslationRecordSchema, dependencies=[Depends(auth.validate_token)], tags=["Translated text"])
async def add_translation(add_translation_DTO : add_translationDTO = Depends()):
    """
    Adds a new translation.
    Args:
        transcription_id (int): The ID of the transcription.
        provider_id (int): The ID of the translation provider.
        language_id (int): The ID of the language.
    Returns:
        TranslationRecordSchema: The newly created translation object.
    """
    return await translation_controller.create_translation(add_translation_DTO)

@router.get("/translations/{translation_id}", response_model=TranslationRecordSchema, dependencies=[Depends(auth.validate_token)], tags=["Translated text"])
async def get_translation_by_id(translation_id: int):
    """
    Retrieves a translation by its ID.
    Args:
        translation_id (int): The ID of the translation.
    Returns:
        TranslationRecordSchema: The translation object.
    """
    return await translation_controller.retrieve_translation_by_id(translation_id)

@router.get("/translations/audio/{audio_id}", response_model=List[TranslationRecordSchema], dependencies=[Depends(auth.validate_token)], tags=["Translated text"])
async def get_translations_by_audio_id(audio_id: int):
    """
    Retrieves all translations for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslationRecordSchema objects.
    """
    return await translation_controller.retrieve_translations_by_audio_id(audio_id)