from fastapi import APIRouter, HTTPException
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
    try:
        return await retrieve_all_translations_controller()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translations", response_model=TranslationRecordSchema)
async def add_translation(audio_id: int, transcription_id: int, provider_id: int, language_id: int, translation_text: str):
    try:
        return await create_translation_controller(audio_id, transcription_id, provider_id, language_id, translation_text)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/translations/{translation_id}", response_model=TranslationRecordSchema)
async def get_translation_by_id(translation_id: int):
    try:
        return await retrieve_translation_by_id_controller(translation_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/translations/audio/{audio_id}", response_model=list[TranslationRecordSchema])
async def get_translations_by_audio_id(audio_id: int):
    try:
        return await retrieve_translations_by_audio_id_controller(audio_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))