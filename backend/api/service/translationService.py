from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.translation_records import TranslationRecord, TranslationRecordSchema
from fastapi import HTTPException

class TranslationService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_translations(self):
        """
        Retrieve all translation records from the database.

        This function creates a new database session, queries all records from the
        TranslationRecord table, converts them to TranslationRecordSchema objects,
        and returns them as a list. The database session is closed after the operation.

        Returns:
            list: A list of TranslationRecordSchema objects representing all translations in the database.
        """
        try:
            translations = self.db.query(TranslationRecord).all()
            return [TranslationRecordSchema.from_orm(translation) for translation in translations]
        except Exception as e:
            return str(e)

    def create_translation(self, audio_id: int, transcription_id: int, provider_id: int, source_language_id: int, target_language_id: int, translation_text: str):
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
        try:
            new_translation = TranslationRecord(
                audio_id=audio_id,
                transcription_id=transcription_id,
                provider_id=provider_id,
                language_id=source_language_id,
                translation_text=translation_text
            )
            self.db.add(new_translation)
            self.db.commit()
            self.db.refresh(new_translation)
            return TranslationRecordSchema.from_orm(new_translation)
        except Exception as e:
            self.db.rollback()
            return str(e)

    def get_translation_by_id(self, translation_id: int):
        """
        Retrieve a translation record by its ID.
        Args:
            translation_id (int): The ID of the translation.
        Returns:
            TranslationRecordSchema: The translation object if found.
            None: If the translation with the given ID does not exist.
        """
        try:
            translation = self.db.query(TranslationRecord).filter_by(id=translation_id).first()
            if translation is None:
                return None
            return TranslationRecordSchema.from_orm(translation)
        except Exception as e:
            return str(e)

    def get_translations_by_audio_id(self, audio_id: int):
        """
        Retrieve all translation records for a given audio ID.
        Args:
            audio_id (int): The ID of the audio.
        Returns:
            list: A list of TranslationRecordSchema objects representing the translations for the audio.
        """
        try:
            translations = self.db.query(TranslationRecord).filter_by(audio_id=audio_id).all()
            return [TranslationRecordSchema.from_orm(translation) for translation in translations]
        except Exception as e:
            return str(e)