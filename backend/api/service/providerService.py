from sqlalchemy.orm import Session
from db.database import SessionLocal
from fastapi import HTTPException
from typing import Dict, Any, Type
from models.providers import  ProviderRecord, ProviderSchema

def get_all_providers():
    """
    Retrieve all provider records from the database.

    This function creates a new database session, queries all records from the
    specified model table, converts them to the specified schema objects,
    and returns them as a list. The database session is closed after the operation.

    Returns:
        list: A list of schema objects representing all providers in the database.
    """

    db = SessionLocal()
    try:
        providers = db.query(ProviderRecord).all()
        return [ProviderSchema.from_orm(provider) for provider in providers]
    finally:
        db.close()

def create_provider(data: Dict[str, Any]):
    """
    Create a new provider entry in the database.
    Args:
        data (dict): A dictionary containing the provider data.

    Returns:
        schema: The newly created provider object if successful.
        None: If the provider with the given name already exists.
    """
    db = SessionLocal()
    try:
        # Check if the provider already exists in the database
        existing_provider = db.query(ProviderRecord).filter_by(name=data["name"]).first()
        if existing_provider:
            return None

        new_provider = ProviderRecord(**data)
        db.add(new_provider)
        db.commit()
        db.refresh(new_provider)
        return ProviderSchema.from_orm(new_provider)
    finally:
        db.close()