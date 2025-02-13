from fastapi import APIRouter, HTTPException
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
    try:
        return await retrieve_all_translated_audios_controller()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translated_audios", response_model=TranslatedAudioRecordSchema)
async def add_translated_audio(audio_id: int, translation_id: int, provider_id: int, language_id: int, audio_data: bytes, file_size: int, transcription: str):
    try:
        return await create_translated_audio_controller(audio_id, translation_id, provider_id, language_id, audio_data, file_size, transcription)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/translated_audios/{translated_audio_id}", response_model=TranslatedAudioRecordSchema)
async def get_translated_audio_by_id(translated_audio_id: int):
    try:
        return await retrieve_translated_audio_by_id_controller(translated_audio_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/translated_audios/audio/{audio_id}", response_model=List[TranslatedAudioRecordSchema])
async def get_translated_audios_by_audio_id(audio_id: int):
    try:
        return await retrieve_translated_audios_by_audio_id_controller(audio_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))