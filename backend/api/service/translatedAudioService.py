from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.translated_audios import TranslatedAudioRecord, TranslatedAudioRecordSchema

class TranslatedAudioService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_translated_audios(self):
        """
        Retrieve all translated audio records from the database.

        This function creates a new database session, queries all records from the
        TranslatedAudioRecord table, converts them to TranslatedAudioRecordSchema objects,
        and returns them as a list. The database session is closed after the operation.

        Returns:
            list: A list of TranslatedAudioRecordSchema objects representing all translated audios in the database.
        """
        try:
            translated_audios = self.db.query(TranslatedAudioRecord).all()
            return [TranslatedAudioRecordSchema.from_orm(translated_audio) for translated_audio in translated_audios]
        except Exception as e:
            return str(e)

    def create_translated_audio(self, audio_id: int, translation_id: int, provider_id: int, language_id: int, audio_data: bytes, file_size: int):
        """
        Create a new translated audio entry in the database.
        Args:
            audio_id (int): The ID of the audio.
            translation_id (int): The ID of the translation.
            provider_id (int): The ID of the TTS provider.
            language_id (int): The ID of the language.
            audio_data (bytes): The audio data.
            file_size (int): The file size in bytes.
        Returns:
            TranslatedAudioRecordSchema: The newly created translated audio object if successful.
        """
        try:
            new_translated_audio = TranslatedAudioRecord(
                audio_id=audio_id,
                translation_id=translation_id,
                provider_id=provider_id,
                language_id=language_id,
                audio_data=audio_data,
                file_size=file_size,
            )
            self.db.add(new_translated_audio)
            self.db.commit()
            self.db.refresh(new_translated_audio)
            return TranslatedAudioRecordSchema.from_orm(new_translated_audio)
        except Exception as e:
            return str(e)

    def get_translated_audio_by_id(self, translated_audio_id: int):
        """
        Retrieve a translated audio record by its ID.
        Args:
            translated_audio_id (int): The ID of the translated audio.
        Returns:
            TranslatedAudioRecordSchema: The translated audio object if found.
            None: If the translated audio with the given ID does not exist.
        """
        try:
            translated_audio = self.db.query(TranslatedAudioRecord).filter_by(id=translated_audio_id).first()
            if translated_audio is None:
                return None
            return TranslatedAudioRecordSchema.from_orm(translated_audio)
        except Exception as e:
            return str(e)

    def get_translated_audios_by_audio_id(self, audio_id: int):
        """
        Retrieve all translated audio records for a given audio ID.
        Args:
            audio_id (int): The ID of the audio.
        Returns:
            list: A list of TranslatedAudioRecordSchema objects representing the translated audios for the audio.
        """
        try:
            translated_audios = self.db.query(TranslatedAudioRecord).filter_by(audio_id=audio_id).all()
            return [TranslatedAudioRecordSchema.from_orm(translated_audio) for translated_audio in translated_audios]
        except Exception as e:
            return str(e)