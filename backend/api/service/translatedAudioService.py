from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.translated_audios import TranslatedAudioRecord, TranslatedAudioRecordSchema
from fastapi import HTTPException

def get_all_translated_audios():
    """
    Retrieve all translated audio records from the database.

    This function creates a new database session, queries all records from the
    TranslatedAudioRecord table, converts them to TranslatedAudioSchema objects,
    and returns them as a list. The database session is closed after the operation.

    Returns:
        list: A list of TranslatedAudioSchema objects representing all translated audios in the database.
    """
    db = SessionLocal()
    try:
        translated_audios = db.query(TranslatedAudioRecord).all()
        return [TranslatedAudioSchema.from_orm(translated_audio) for translated_audio in translated_audios]
    finally:
        db.close()

def create_translated_audio(audio_id: int, translation_id: int, provider_id: int, language_id: int, audio_data: bytes, file_size: int, transcription: str):
    """
    Create a new translated audio entry in the database.
    Args:
        audio_id (int): The ID of the audio.
        translation_id (int): The ID of the translation.
        provider_id (int): The ID of the TTS provider.
        language_id (int): The ID of the language.
        audio_data (bytes): The audio data.
        file_size (int): The file size in bytes.
        transcription (str): The transcription text.
    Returns:
        TranslatedAudioSchema: The newly created translated audio object if successful.
    """
    db = SessionLocal()
    try:
        new_translated_audio = TranslatedAudioRecord(
            audio_id=audio_id,
            translation_id=translation_id,
            provider_id=provider_id,
            language_id=language_id,
            audio_data=audio_data,
            file_size=file_size,
            transcription=transcription
        )
        db.add(new_translated_audio)
        db.commit()
        db.refresh(new_translated_audio)
        return TranslatedAudioSchema.from_orm(new_translated_audio)
    finally:
        db.close()

def get_translated_audio_by_id(translated_audio_id: int):
    """
    Retrieve a translated audio record by its ID.
    Args:
        translated_audio_id (int): The ID of the translated audio.
    Returns:
        TranslatedAudioSchema: The translated audio object if found.
        None: If the translated audio with the given ID does not exist.
    """
    db = SessionLocal()
    try:
        translated_audio = db.query(TranslatedAudioRecord).filter_by(id=translated_audio_id).first()
        if translated_audio is None:
            raise HTTPException(status_code=404, detail="Translated audio not found")
        return TranslatedAudioSchema.from_orm(translated_audio)
    finally:
        db.close()

def get_translated_audios_by_audio_id(audio_id: int):
    """
    Retrieve all translated audio records for a given audio ID.
    Args:
        audio_id (int): The ID of the audio.
    Returns:
        list: A list of TranslatedAudioSchema objects representing the translated audios for the audio.
    """
    db = SessionLocal()
    try:
        translated_audios = db.query(TranslatedAudioRecord).filter_by(audio_id=audio_id).all()
        return [TranslatedAudioSchema.from_orm(translated_audio) for translated_audio in translated_audios]
    finally:
        db.close()