from fastapi import APIRouter, Depends
from api.controller.transcriptionController import (
    retrieve_all_transcriptions_controller,
    create_transcription_controller,
    retrieve_transcription_by_id_controller,
    retrieve_transcriptions_by_audio_id_controller
)
from models.transcription_records import TranscriptionRecordSchema

router = APIRouter()

@router.get("/transcriptions", response_model=list[TranscriptionRecordSchema])
async def get_transcriptions():
    return await retrieve_all_transcriptions_controller()

@router.post("/transcriptions", response_model=TranscriptionRecordSchema)
async def add_transcription(audio_id: int, provider_id: int, language_id: int, transcription_text: str):
    return await create_transcription_controller(audio_id, provider_id, language_id, transcription_text)

@router.get("/transcriptions/{transcription_id}", response_model=TranscriptionRecordSchema)
async def get_transcription_by_id(transcription_id: int):
    return await retrieve_transcription_by_id_controller(transcription_id)

@router.get("/transcriptions/audio/{audio_id}", response_model=list[TranscriptionRecordSchema])
async def get_transcriptions_by_audio_id(audio_id: int):
    return await retrieve_transcriptions_by_audio_id_controller(audio_id)