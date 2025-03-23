from api.DTO.audio.audioRequestDTO import process_mediaDTO
from db.database import SessionLocal
from models.process_media import ProcessMediaRecord, ProcessMediaSchema, StatusType
from typing import List, Tuple

class ProcessMediaService:
    """
    Service for managing process media requests (translation requests).
    """
    def __init__(self):
        """
        Initializes the service with a database session.
        """
        self.db = SessionLocal()

    def __del__(self):
        """
        Closes the database session when the service is destroyed.
        """
        self.db.close()

    def create_process_media_record(self,process_mediaDTO: process_mediaDTO) -> ProcessMediaSchema:
        """
        Creates a new process media record (translation request).
        
        Args:
            audio_id (int): ID of the audio to process.
            user_id (int): ID of the user who requested the processing.
            language_id_from (int): Source language ID.
            language_id_to (int): Target language ID.
            providers_transcription (int): ID of the transcription provider.
            providers_translation (int): ID of the translation provider.
            providers_generation (int): ID of the audio generation provider.
            status (StatusType): Status of the process.
            
        Returns:
            ProcessMediaSchema: The created process media record.
        """
        try:
            # Create the process media record
            process_media = ProcessMediaRecord(
                audio_id=process_mediaDTO.audio_id,
                user_id=process_mediaDTO.user_id,
                providers_transcription=process_mediaDTO.providers_transcription,
                providers_translation=process_mediaDTO.providers_translation,
                providers_generation=process_mediaDTO.providers_generation,
                languages_from=process_mediaDTO.language_id_from,
                languages_to=process_mediaDTO.language_id_to,
                status=StatusType.PROCESS
            )
            
            self.db.add(process_media)
            self.db.commit()
            self.db.refresh(process_media)
            
            # Convert to schema
            return ProcessMediaSchema.from_orm(process_media)
        except Exception as e:
            self.db.rollback()
            print(f"Error creating process media record: {str(e)}")
            raise

    def get_all_process_media_records(self, page: int = 1, size: int = 10) -> Tuple[List[ProcessMediaSchema], int, int]:
        """
        Gets all process media records with pagination.
        
        Args:
            page (int): Page number.
            size (int): Number of items per page.
            
        Returns:
            Tuple[List[ProcessMediaSchema], int, int]: A tuple containing:
                - List of process media records
                - Total number of items
                - Total number of pages
        """
        try:
            # Get the total number of items
            total_items = self.db.query(ProcessMediaRecord).count()
            
            # Calculate the offset for the query
            offset = (page - 1) * size
            
            # Query the records with pagination
            records = self.db.query(ProcessMediaRecord).order_by(
                ProcessMediaRecord.id.desc()
            ).offset(offset).limit(size).all()
            
            # Calculate the total number of pages
            total_pages = (total_items + size - 1) // size if size > 0 else 0
            
            return [ProcessMediaSchema.from_orm(record) for record in records], total_items, total_pages
        
        except Exception as e:
            print(f"Error getting process media records: {str(e)}")
            raise

    def get_process_media_records_by_user_id(self, user_id: int, page: int = 1, size: int = 10) -> Tuple[List[ProcessMediaSchema], int, int]:
        """
        Gets all process media records for a specific user with pagination.
        
        Args:
            user_id (int): ID of the user.
            page (int): Page number.
            size (int): Number of items per page.
            
        Returns:
            Tuple[List[ProcessMediaSchema], int, int]: A tuple containing:
                - List of process media records
                - Total number of items
                - Total number of pages
        """
        try:
            # Get the total number of items for this user
            total_items = self.db.query(ProcessMediaRecord).filter(
                ProcessMediaRecord.user_id == user_id
            ).count()
            
            # Calculate the offset for the query
            offset = (page - 1) * size
            
            # Query the records with pagination
            records = self.db.query(ProcessMediaRecord).filter(
                ProcessMediaRecord.user_id == user_id
            ).order_by(
                ProcessMediaRecord.id.desc()
            ).offset(offset).limit(size).all()
            
            # Calculate the total number of pages
            total_pages = (total_items + size - 1) // size if size > 0 else 0
            
            return [ProcessMediaSchema.from_orm(record) for record in records], total_items, total_pages
        
        except Exception as e:
            print(f"Error getting process media records for user {user_id}: {str(e)}")
            raise 