from fastapi import APIRouter, HTTPException
from api.controller.translationByIDController import retrieve_translation_by_id_controller
from models.translated_audios import TranslationRecordSchema
from typing import List

router = APIRouter()

# Endpoint "/translationID", recupera una traduccion de la base de datos mediante su ID
@router.get("/translation", response_model=TranslationRecordSchema)
async def retrieve_translation_by_ID(id : int):
    try:
        response = await retrieve_translation_by_id_controller(id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error")