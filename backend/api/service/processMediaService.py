from api.DTO.audio.audioRequestDTO import process_mediaDTO
from db.database import SessionLocal
from models.process_media import ProcessMediaRecord, ProcessMediaSchema, StatusType
from typing import List, Tuple, Optional, Dict
from fastapi import HTTPException, status
from sqlalchemy import func
import logging
from api.service.audioService import AudioService

# Configurar logger para este módulo
logger = logging.getLogger(__name__)

class ProcessMediaService:
    """
    Service for managing process media requests (translation requests).
    """
    def __init__(self):
        """
        Initializes the service with a database session.
        """
        self.db = SessionLocal()
        self.audio_service = AudioService()

    def __del__(self):
        """
        Closes the database session when the service is destroyed.
        """
        self.db.close()

    def create_process_media_record(self, process_mediaDTO) -> ProcessMediaSchema:
        """
        Creates a new process media record (translation request).
        
        Args:
            process_mediaDTO: DTO containing translation request details.
            
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
                status=process_mediaDTO.status
            )
            
            self.db.add(process_media)
            self.db.commit()
            self.db.refresh(process_media)
            
            # Convert to schema
            return ProcessMediaSchema.from_orm(process_media)
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating process media record: {str(e)}")

    def update_process_media_status(self, process_media_id: int, status: StatusType = StatusType.DONE) -> ProcessMediaSchema:
        """
        Updates the status of a process media record.
        
        Args:
            process_media_id (int): ID of the process media record to update.
            status (StatusType): The new status to set (default: StatusType.DONE).
            
        Returns:
            ProcessMediaSchema: The updated process media record.
            
        Raises:
            Exception: If the record is not found or can't be updated.
        """
        try:
            # Get the process media record
            process_media = self.db.query(ProcessMediaRecord).filter(
                ProcessMediaRecord.id == process_media_id
            ).first()
            
            if not process_media:
                logger.warning(f"Process media record with ID {process_media_id} not found")
                raise Exception(f"Process media record with ID {process_media_id} not found")
            
            # Update the status
            process_media.status = status
            self.db.commit()
            self.db.refresh(process_media)
            
            logger.info(f"Updated process media record {process_media_id} status to {status.value}")
            
            # Convert to schema and return
            return ProcessMediaSchema.from_orm(process_media)
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating process media status: {str(e)}")

    def get_all_process_media_records(self, page: int = 1, size: int = 10) -> Tuple[List[Dict], int, int]:
        """
        Gets all process media records with pagination.
        
        Args:
            page (int): Page number.
            size (int): Number of items per page.
            
        Returns:
            Tuple[List[Dict], int, int]: A tuple containing:
                - List of process media records with audio metadata
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
            
            # Get the audio metadata for each record
            result_with_audio = []
            for record in records:
                process_media_dict = ProcessMediaSchema.from_orm(record).dict()
                
                # Get the audio metadata
                audio_metadata = self.audio_service.get_audio_by_id(record.audio_id)
                if audio_metadata and not isinstance(audio_metadata, str):
                    # Filtrar audio_data para no enviarlo en la respuesta
                    audio_metadata_dict = {
                        "id": audio_metadata.id,
                        "filename": audio_metadata.filename,
                        "content_type": audio_metadata.content_type,
                        "file_size": audio_metadata.file_size,
                        "language_id": audio_metadata.language_id,
                        "is_audio_valid": audio_metadata.is_audio_valid,
                        "created_at": audio_metadata.created_at
                    }
                    process_media_dict["audio_metadata"] = audio_metadata_dict
                
                result_with_audio.append(process_media_dict)
            
            return result_with_audio, total_items, total_pages
        
        except Exception as e:
            print(f"Error getting process media records: {str(e)}")
            raise

    def get_process_media_records_by_user_id(self, user_id: int, page: int = 1, size: int = 10) -> Tuple[List[Dict], int, int]:
        """
        Gets all process media records for a specific user with pagination.
        
        Args:
            user_id (int): ID of the user.
            page (int): Page number.
            size (int): Number of items per page.
            
        Returns:
            Tuple[List[Dict], int, int]: A tuple containing:
                - List of process media records with audio metadata
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
            
            # Get the audio metadata for each record
            result_with_audio = []
            for record in records:
                process_media_dict = ProcessMediaSchema.from_orm(record).dict()
                
                # Get the audio metadata
                audio_metadata = self.audio_service.get_audio_by_id(record.audio_id)
                if audio_metadata and not isinstance(audio_metadata, str):
                    # Filtrar audio_data para no enviarlo en la respuesta
                    audio_metadata_dict = {
                        "id": audio_metadata.id,
                        "filename": audio_metadata.filename,
                        "content_type": audio_metadata.content_type,
                        "file_size": audio_metadata.file_size,
                        "language_id": audio_metadata.language_id,
                        "is_audio_valid": audio_metadata.is_audio_valid,
                        "created_at": audio_metadata.created_at
                    }
                    process_media_dict["audio_metadata"] = audio_metadata_dict
                
                result_with_audio.append(process_media_dict)
            
            return result_with_audio, total_items, total_pages
        
        except Exception as e:
            print(f"Error getting process media records for user {user_id}: {str(e)}")
            raise 

    def get_process_media_records_of_top_user(self) -> List[Dict]:
        """
        Gets all process media records for the user with the most entries.

        Args:
            size (int): Number of items per page (used to calculate total_pages).

        Returns:
            Tuple[List[Dict], int, int]: A tuple containing:
                - List of process media records with audio metadata
                - Total number of items for top user
                - Total number of pages
        """
        try:
            # 1. Obtener el usuario con más registros
            top_user = self.db.query(
                ProcessMediaRecord.user_id,
                func.count(ProcessMediaRecord.id).label("count")
            ).group_by(ProcessMediaRecord.user_id)\
            .order_by(func.count(ProcessMediaRecord.id).desc())\
            .first()

            if not top_user:
                return []

            top_user_id = top_user.user_id

            # 2. Obtener todos los process_media de ese usuario
            records = self.db.query(ProcessMediaRecord)\
                        .filter(ProcessMediaRecord.user_id == top_user_id)\
                        .order_by(ProcessMediaRecord.id.desc())\
                        .all()


            # 3. Obtener metadatos de audio por cada registro
            result_with_audio = []
            for record in records:
                process_media_dict = ProcessMediaSchema.from_orm(record).dict()

                # Obtener metadatos del audio asociado
                audio_metadata = self.audio_service.get_audio_by_id(record.audio_id)
                if audio_metadata and not isinstance(audio_metadata, str):
                    audio_metadata_dict = {
                        "id": audio_metadata.id,
                        "filename": audio_metadata.filename,
                        "content_type": audio_metadata.content_type,
                        "file_size": audio_metadata.file_size,
                        "language_id": audio_metadata.language_id,
                        "is_audio_valid": audio_metadata.is_audio_valid,
                        "created_at": audio_metadata.created_at,
                    }
                    process_media_dict["audio_metadata"] = audio_metadata_dict

                result_with_audio.append(process_media_dict)

            return result_with_audio

        except Exception as e:
            print(f"❌ Error getting top user's process media records: {str(e)}")
            raise