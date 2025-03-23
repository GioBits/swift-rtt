from fastapi import HTTPException, status
from api.service.processMediaService import ProcessMediaService
from api.DTO.audio.audioRequestDTO import process_mediaDTO, retrieve_audios_listDTO
from api.service.audioService import AudioService
from models.process_media import StatusType
from ws.queueSetup import add_audio_task

class ProcessMediaController:
    """
    Controller for managing process media requests (translation requests).
    """
    def __init__(self):
        """
        Initializes the controller with a ProcessMediaService instance.
        """
        self.process_media_service = ProcessMediaService()
        self.audio_service = AudioService()

    async def create_process_media(self, process_mediaDTO: process_mediaDTO) -> dict:
        """
        Handles the processing of a media file.
        
        Args:
            process_mediaDTO: A DTO containing the user_id, audio_id, language IDs, and provider IDs.
            
        Returns:
            dict: A message indicating the task was added to the queue or an error if validation failed.
        """
        try:
            
            # Validate the audio
            audio = self.audio_service.get_audio_by_id(process_mediaDTO.audio_id)
            is_valid = audio is not None and audio.is_audio_valid
            
            # Set the correct status
            if is_valid:
                status = StatusType.PROCESS
            else:
                status = StatusType.FAIL
                error_message = "Audio not found" if audio is None else audio.validation_error or "Audio validation failed"
            
            # Create the record in the database with the correct status
            process_mediaDTO.status = status
            result = self.process_media_service.create_process_media_record(process_mediaDTO)
            
            # If the audio is valid, add it to the task queue
            if is_valid:
                # Create a configuration for the queue
                config = {
                    "record_id": result.audio_id,
                    "audio_id": result.audio_id,
                    "process_media_id": result.id,
                    "user_id": result.user_id,
                    "providers": {
                        "transcription": result.providers_transcription,
                        "translation": result.providers_translation,
                        "audio_generation": result.providers_generation
                    },
                    "languages": {
                        "from": result.languages_from,
                        "to": result.languages_to
                    }
                }

                # Add the task to the queue
                await add_audio_task(config, "transcribe")
                
                return {"message": "Process media created successfully and added to queue", "process_media_id": result.id, "status": result.status.value, "config": config}
            else:
                # Do not add to the task queue if the audio is not valid
                return {"message": "Process media created with FAIL status", "process_media_id": result.id, "status": result.status.value, "error": error_message}
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating process media: {str(e)}"
            )
    
    def update_process_media_status(self, process_media_id: int, status: StatusType = StatusType.DONE) -> dict:
        """
        Updates the status of a process media record.
        
        Args:
            process_media_id (int): ID of the process media record to update.
            status (StatusType, optional): The new status to set. Defaults to StatusType.DONE.
            
        Returns:
            dict: A message indicating the status was updated successfully.
        """
        try:
            updated_record = self.process_media_service.update_process_media_status(process_media_id, status)
            return {
                "message": f"Process media status updated successfully to {status.value}",
                "process_media_id": updated_record.id,
                "status": updated_record.status.value
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating process media status: {str(e)}"
            )
        
    def get_all_process_media_records(self, retrieve_audios_listDTO: retrieve_audios_listDTO) -> dict:
        """
        Gets all process media records with pagination.
        
        Args:
            retrieve_audios_listDTO: A DTO containing pagination parameters.
            
        Returns:
            dict: Records with pagination metadata.
        """
        try:
            records, total_items, total_pages = self.process_media_service.get_all_process_media_records(
                page=retrieve_audios_listDTO.page,
                size=retrieve_audios_listDTO.size
            )
            
            return {
                "items": records,
                "total_items": total_items,
                "total_pages": total_pages,
                "current_page": retrieve_audios_listDTO.page
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving process media records: {str(e)}"
            )

    def get_process_media_records_by_user_id(self, user_id: int, retrieve_audios_listDTO: retrieve_audios_listDTO) -> dict:
        """
        Gets all process media records for a specific user with pagination.
        
        Args:
            user_id: ID of the user.
            retrieve_audios_listDTO: A DTO containing pagination parameters.
            
        Returns:
            dict: Records with pagination metadata.
        """
        try:
            records, total_items, total_pages = self.process_media_service.get_process_media_records_by_user_id(
                user_id=user_id,
                page=retrieve_audios_listDTO.page,
                size=retrieve_audios_listDTO.size
            )
            
            return {
                "items": records,
                "total_items": total_items,
                "total_pages": total_pages,
                "current_page": retrieve_audios_listDTO.page
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving process media records for user {user_id}: {str(e)}"
            ) 