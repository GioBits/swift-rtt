from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.languages import Language, LanguageSchema
from fastapi import HTTPException

def get_all_languages():
    """
    Retrieve all language records from the database.

    This function creates a new database session, queries all records from the
    Language table, converts them to LanguageSchema objects, and returns them
    as a list. The database session is closed after the operation.

    Returns:
        list: A list of LanguageSchema objects representing all languages in the database.
    """
    # Create a database session
    db = SessionLocal()
    try:
        languages = db.query(Language).all()
        return [LanguageSchema.from_orm(language) for language in languages]
    finally:
        db.close()

def create_language(code: str, name: str):
    """
    Create a new language entry in the database.
    Args:
        code (str): The unique code representing the language.
        name (str): The name of the language.
    Returns:
        LanguageSchema: The newly created language object if successful.
        None: If the language with the given code already exists.
    """
    # Create a database session
    db = SessionLocal()
    try:
        # Check if the language already exists in the database
        existing_language = db.query(Language).filter_by(code=code).first()
        if existing_language:
            return None

        new_language = Language(code=code, name=name)
        db.add(new_language)
        db.commit()
        db.refresh(new_language)
        return LanguageSchema.from_orm(new_language)
    finally:
        db.close()