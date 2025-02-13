from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.translation_records import TranslationRecord, TranslationRecordSchema
from fastapi import HTTPException

def get_all_translations():
    """
    Retrieve all translation records from the database.

    This function creates a new database session, queries all records from the
    TranslationRecord table, converts them to TranslationRecordSchema objects,
    and returns them as a list. The database session is closed after the operation.

    Returns:
        list: A list of TranslationRecordSchema objects representing all translations in the database.
    """
    db = SessionLocal()
    try:
        translations = db.query(TranslationRecord).all()
        return [TranslationRecordSchema.from_orm(translation) for translation in translations]
    finally:
        db.close()

def create_translation(audio_id: int, transcription_id: int, provider_id: int, language_id: int, translation_text: str):
    """
    Create a new translation entry in the database.
    Args:
        audio_id (int): The ID of the audio.
        transcription_id (int): The ID of the transcription.
        provider_id (int): The ID of the translation provider.
        language_id (int): The ID of the language.
        translation_text (str): The translation text.
    Returns:
        TranslationRecordSchema: The newly created translation object if successful.
    """
    db = SessionLocal()
    try:
        new_translation = TranslationRecord(
            audio_id=audio_id,
            transcription_id=transcription_id,
            provider_id=provider_id,
            language_id=language_id,
            translation_text=translation_text
        )
        db.add(new_translation)
        db.commit()
        db.refresh(new_translation)
        return TranslationRecordSchema.from_orm(new_translation)
    finally:
        db.close()

def get_translation_by_id(translation_id: int):
    """
    Retrieve a translation record by its ID.
    Args:
        translation_id (int): The ID of the translation.
    Returns:
        TranslationRecordSchema: The translation object if found.
        None: If the translation with the given ID does not exist.
    """
    db = SessionLocal()
    try:
        translation = db.query(TranslationRecord).filter_by(id=translation_id).first()
        if translation is None:
            raise HTTPException(status_code=404, detail="Translation not found")
        return TranslationRecordSchema.from_orm(translation)
    finally:
        db.close()

def get_translations_by_audio_id(audio_id: int):
    """
    Retrieve all translation records for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslationRecordSchema objects representing the translations for the audio.
    """
    db = SessionLocal()
    try:
        translations = db.query(TranslationRecord).filter_by(audio_id=audio_id).all()
        return [TranslationRecordSchema.from_orm(translation) for translation in translations]
    finally:
        db.close()