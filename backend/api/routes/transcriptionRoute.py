from fastapi import Depends, APIRouter
from api.controller.transcriptionController import TranscriptionController
from models.transcription_records import TranscriptionRecordSchema
from typing import List
from utils.auth import AuthUtils
auth = AuthUtils()
router = APIRouter()
transcription_controller = TranscriptionController()

@router.get("/transcriptions", response_model=List[TranscriptionRecordSchema], dependencies=[Depends(auth.validate_token)],tags=["Transcriptions"])
async def get_transcriptions():
    return await transcription_controller.retrieve_all_transcriptions()

@router.post("/transcriptions", response_model=TranscriptionRecordSchema, dependencies=[Depends(auth.validate_token)], tags=["Transcriptions"])
async def add_transcription(audio_id: int, provider_id: int):
    return await transcription_controller.create_transcription(audio_id, provider_id)

@router.get("/transcriptions/{transcription_id}", response_model=TranscriptionRecordSchema, dependencies=[Depends(auth.validate_token)], tags=["Transcriptions"])
async def get_transcription_by_id(transcription_id: int):
    return await transcription_controller.retrieve_transcription_by_id(transcription_id)

@router.get("/transcriptions/audio/{audio_id}", response_model=List[TranscriptionRecordSchema], dependencies=[Depends(auth.validate_token)], tags=["Transcriptions"])
async def get_transcriptions_by_audio_id(audio_id: int):
    return await transcription_controller.retrieve_transcriptions_by_audio_id(audio_id)