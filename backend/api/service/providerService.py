from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi import HTTPException
from typing import Dict, Any, Type
from models.transcription_providers import TranscriptionProviderRecord, TranscriptionProviderSchema
from models.translation_providers import TranslationProviderRecord, TranslationProviderSchema

MODEL_MAP = {
    "transcription_provider": {
        "model": TranscriptionProviderRecord,
        "schema": TranscriptionProviderSchema
    },
    "translation_provider": {
        "model": TranslationProviderRecord,
        "schema": TranslationProviderSchema
    }
}

def get_all_providers(model_name: str):
    """
    Retrieve all provider records from the database.

    This function creates a new database session, queries all records from the
    specified model table, converts them to the specified schema objects,
    and returns them as a list. The database session is closed after the operation.

    Args:
        model_name (str): The name of the model to use.

    Returns:
        list: A list of schema objects representing all providers in the database.
    """
    model_info = MODEL_MAP.get(model_name)
    if not model_info:
        raise ValueError(f"Model '{model_name}' not found in MODEL_MAP")

    model = model_info["model"]
    schema = model_info["schema"]

    db = SessionLocal()
    try:
        providers = db.query(model).all()
        return [schema.from_orm(provider) for provider in providers]
    finally:
        db.close()

def create_provider(model_name: str, data: Dict[str, Any]):
    """
    Create a new provider entry in the database.
    Args:
        model_name (str): The name of the model to use.
        data (dict): A dictionary containing the provider data.

    Returns:
        schema: The newly created provider object if successful.
        None: If the provider with the given name already exists.
    """
    model_info = MODEL_MAP.get(model_name)
    if not model_info:
        raise ValueError(f"Model '{model_name}' not found in MODEL_MAP")

    model = model_info["model"]
    schema = model_info["schema"]

    db = SessionLocal()
    try:
        # Check if the provider already exists in the database
        existing_provider = db.query(model).filter_by(name=data["name"]).first()
        if existing_provider:
            return None

        new_provider = model(**data)
        db.add(new_provider)
        db.commit()
        db.refresh(new_provider)
        return schema.from_orm(new_provider)
    finally:
        db.close()