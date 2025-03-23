from fastapi import APIRouter, Depends
from api.controller.processMediaController import ProcessMediaController
from api.DTO.audio.audioRequestDTO import process_mediaDTO, retrieve_audios_listDTO
from utils.auth import AuthUtils

# Create router instance
router = APIRouter()

# Create controller instance
process_media_controller = ProcessMediaController()
auth = AuthUtils()

@router.post("/process-media", dependencies=[Depends(auth.validate_token)], tags=["Process Media"])
async def create_process_media(
    user_id: int, 
    audio_id: int, 
    language_id_from: int,
    language_id_to: int, 
    providers_transcription: int = 1, 
    providers_translation: int = 2, 
    providers_generation: int = 3
):
    """
    Create a new process media record (translation request) and add it to the processing queue.
    
    Args:
        user_id (int): ID of the user who requested the processing.
        audio_id (int): ID of the audio to process.
        language_id_from (int): Source language ID.
        language_id_to (int): Target language ID.
        providers_transcription (int, optional): ID of the transcription provider. Default: 1.
        providers_translation (int, optional): ID of the translation provider. Default: 2.
        providers_generation (int, optional): ID of the audio generation provider. Default: 3.
            
    Returns:
        dict: A message indicating the task was added to the queue or an error if validation failed.
    """
    process_media = process_mediaDTO(
        user_id=user_id,
        audio_id=audio_id,
        language_id_from=language_id_from,
        language_id_to=language_id_to,
        providers_transcription=providers_transcription,
        providers_translation=providers_translation,
        providers_generation=providers_generation
    )

    return await process_media_controller.create_process_media(process_media)

@router.get("/process-media", dependencies=[Depends(auth.validate_token)], tags=["Process Media"])
def get_all_process_media_records(page: int = 1, size: int = 10):
    """
    Get all process media records with pagination.
    
    Args:
        page (int, optional): Page number. Default: 1.
        size (int, optional): Number of items per page. Default: 10.
        
    Returns:
        dict: Records with pagination metadata.
    """
    retrieve_list = retrieve_audios_listDTO(page=page, size=size)
    return process_media_controller.get_all_process_media_records(retrieve_list)

@router.get("/process-media/user/{user_id}", dependencies=[Depends(auth.validate_token)], tags=["Process Media"])
def get_process_media_records_by_user_id(user_id: int, page: int = 1, size: int = 10):
    """
    Get all process media records for a specific user with pagination.
    
    Args:
        user_id (int): ID of the user.
        page (int, optional): Page number. Default: 1.
        size (int, optional): Number of items per page. Default: 10.
        
    Returns:
        dict: Records with pagination metadata.
    """
    retrieve_list = retrieve_audios_listDTO(page=page, size=size)
    return process_media_controller.get_process_media_records_by_user_id(user_id, retrieve_list) 