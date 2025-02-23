from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.languages import LanguageRecord, LanguageSchema

class LanguageService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_languages(self):
        """
        Retrieve all language records from the database.

        This function creates a new database session, queries all records from the
        Language table, converts them to LanguageSchema objects, and returns them
        as a list. The database session is closed after the operation.

        Returns:
            list: A list of LanguageSchema objects representing all languages in the database.
        """
        try:
            languages = self.db.query(LanguageRecord).all()
            return [LanguageSchema.from_orm(language) for language in languages]
        except Exception as e:
            return str(e)

    def create_language(self, code: str, name: str):
        """
        Create a new language entry in the database.
        Args:
            code (str): The unique code representing the language.
            name (str): The name of the language.
        Returns:
            LanguageSchema: The newly created language object if successful.
            None: If the language with the given code already exists.
        """
        try:
            # Check if the language already exists in the database
            existing_language = self.db.query(LanguageRecord).filter_by(code=code).first()
            if existing_language:
                return None

            new_language = LanguageRecord(code=code, name=name)
            self.db.add(new_language)
            self.db.commit()
            self.db.refresh(new_language)
            return LanguageSchema.from_orm(new_language)
        except Exception as e:
            return str(e)