from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.transcription_records import TranscriptionRecord, TranscriptionRecordSchema

class TranscriptionService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_transcriptions(self):
        """
        Retrieve all transcription records from the database.

        This function creates a new database session, queries all records from the
        TranscriptionRecord table, converts them to TranscriptionRecordSchema objects,
        and returns them as a list. The database session is closed after the operation.

        Returns:
            list: A list of TranscriptionRecordSchema objects representing all transcriptions in the database.
        """
        try:
            transcriptions = self.db.query(TranscriptionRecord).all()
            return [TranscriptionRecordSchema.from_orm(transcription) for transcription in transcriptions]
        except Exception as e:
            return str(e)

    def create_transcription(self, audio_id: int, provider_id: int, language_id: int, transcription_text: str):
        """
        Create a new transcription entry in the database.
        Args:
            audio_id (int): The ID of the audio.
            provider_id (int): The ID of the transcription provider.
            language_id (int): The ID of the language.
            transcription_text (str): The transcription text.
        Returns:
            TranscriptionRecordSchema: The newly created transcription object if successful.
        """
        try:
            new_transcription = TranscriptionRecord(
                audio_id=audio_id,
                provider_id=provider_id,
                language_id=language_id,
                transcription_text=transcription_text
            )
            self.db.add(new_transcription)
            self.db.commit()
            self.db.refresh(new_transcription)
            return TranscriptionRecordSchema.from_orm(new_transcription)
        except Exception as e:
            return str(e)

    def get_transcription_by_id(self, transcription_id: int):
        """
        Retrieve a transcription record by its ID.
        Args:
            transcription_id (int): The ID of the transcription.
        Returns:
            TranscriptionRecordSchema: The transcription object if found.
            None: If the transcription with the given ID does not exist.
        """
        try:
            transcription = self.db.query(TranscriptionRecord).filter_by(id=transcription_id).first()
            if transcription is None:
                return None
            return TranscriptionRecordSchema.from_orm(transcription)
        except Exception as e:
            return str(e)

    def get_transcriptions_by_audio_id(self, audio_id: int):
        """
        Retrieve all transcription records for a given audio ID.
        Args:
            audio_id (int): The ID of the audio.
        Returns:
            list: A list of TranscriptionRecordSchema objects representing the transcriptions for the audio.
        """
        try:
            transcriptions = self.db.query(TranscriptionRecord).filter_by(audio_id=audio_id).all()
            return [TranscriptionRecordSchema.from_orm(transcription) for transcription in transcriptions]
        except Exception as e:
            return str(e)