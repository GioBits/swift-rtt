from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.transcription_providers import TranscriptionProviderRecord, TranscriptionProviderSchema
from fastapi import HTTPException

def get_all_providers():
    """
    Retrieve all transcription provider records from the database.

    This function creates a new database session, queries all records from the
    TranscriptionProviderRecord table, converts them to TranscriptionProviderSchema objects,
    and returns them as a list. The database session is closed after the operation.

    Returns:
        list: A list of TranscriptionProviderSchema objects representing all providers in the database.
    """
    # Create a database session
    db = SessionLocal()
    try:
        providers = db.query(TranscriptionProviderRecord).all()
        return [TranscriptionProviderSchema.from_orm(provider) for provider in providers]
    finally:
        db.close()

def create_provider(name: str):
    """
    Create a new transcription provider entry in the database.
    Args:
        name (str): The name of the transcription provider.
    Returns:
        TranscriptionProviderSchema: The newly created provider object if successful.
        None: If the provider with the given name already exists.
    """
    # Create a database session
    db = SessionLocal()
    try:
        # Check if the provider already exists in the database
        existing_provider = db.query(TranscriptionProviderRecord).filter_by(name=name).first()
        if existing_provider:
            return None

        new_provider = TranscriptionProviderRecord(name=name)
        db.add(new_provider)
        db.commit()
        db.refresh(new_provider)
        return TranscriptionProviderSchema.from_orm(new_provider)
    finally:
        db.close()