from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.audio import AudioRecord, AudioRecordSchema
from typing import Optional

class AudioService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_audios(self, page: int, size: int):
        """
        Retrieve all audio records from the database with pagination.

        Args:
            page (int): The page number to retrieve.
            size (int): The number of records per page.

        Returns:
            tuple: A tuple containing a list of AudioRecordSchema objects representing the audios,
                   the total number of items, and the total number of pages.
        """
        try:
            # Get the total number of items without pagination
            total_items = self.db.query(AudioRecord).count()

            # Calculate the offset for the query
            offset = (page - 1) * size
            
            # Query the audios applying pagination (limit and offset)
            audios = self.db.query(AudioRecord).offset(offset).limit(size).all()

            # Calculate the total number of pages
            total_pages = (total_items + size - 1) // size  # Round up to get the number of pages

            return [AudioRecordSchema.from_orm(audio) for audio in audios], total_items, total_pages
        
        except Exception as e:
            return str(e)

    def create_audio(self, user_id: int, filename: str, audio_data: bytes, content_type: str, file_size: int, language_id: int, is_audio_valid: bool = False, validation_error: Optional[str] = None):
        """
        Create a new audio entry in the database.
        Args:
            user_id (str): The ID of the user.
            filename (str): The name of the audio file.
            audio_data (bytes): The audio data.
            content_type (str): The content type of the audio file.
            file_size (int): The file size in bytes.
            language_id (int): The ID of the language.
            is_audio_valid (bool): Whether the audio file is valid according to the validation.
            validation_error (Optional[str]): Error message if the audio is invalid.
        Returns:
            AudioRecordSchema: The newly created audio object if successful.
        """
        try:
            new_audio = AudioRecord(
                user_id=user_id,
                filename=filename,
                audio_data=audio_data,
                content_type=content_type,
                file_size=file_size,
                language_id=language_id,
                is_audio_valid=is_audio_valid,
                validation_error=validation_error
            )
            self.db.add(new_audio)
            self.db.commit()
            self.db.refresh(new_audio)
            return AudioRecordSchema.from_orm(new_audio)
        except Exception as e:
            return str(e)

    def get_audio_by_id(self, audio_id: int):
        """
        Retrieve an audio record by its ID.
        Args:
            audio_id (int): The ID of the audio.
        Returns:
            AudioRecordSchema: The audio object if found.
            None: If the audio with the given ID does not exist.
        """
        try:
            audio = self.db.query(AudioRecord).filter_by(id=audio_id).first()
            if audio is None:
                return None
            return AudioRecordSchema.from_orm(audio)
        except Exception as e:
            return str(e)

    def get_audios_by_user_id(self, user_id: int):
        """
        Retrieve all audio records for a given user ID.
        Args:
            user_id (str): The ID of the user.
        Returns:
            list: A list of AudioRecordSchema objects representing the audios for the user.
        """
        try:
            audios = self.db.query(AudioRecord).filter_by(user_id=user_id).all()
            return [AudioRecordSchema.from_orm(audio) for audio in audios]
        except Exception as e:
            return str(e)