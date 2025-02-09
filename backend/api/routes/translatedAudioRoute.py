from fastapi import APIRouter, HTTPException
from api.controller.translatedAudioController import retrieve_translation_by_id_controller
from models.translated_audios import TranslationRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/translation", recupera una traduccion de la base de datos mediante su ID
@router.get("/translated/{id}", response_model=TranslationRecordSchema)
async def retrieve_translation_by_id(id : int):
    response = await retrieve_translation_by_id_controller(id)
    return response