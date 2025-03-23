import json
import logging
from ws.queueSetup import send_message, add_audio_task
from api.controller.transcriptionController import TranscriptionController
from api.routes.translationRoute import translation_controller
from api.controller.translatedAudioController import TranslatedAudioController
from api.controller.processMediaController import ProcessMediaController
from api.DTO.transcription.transcriptionRequestDTO import add_transcriptionDTO
from api.DTO.translation.translationRequestDTO import add_translationDTO
from api.DTO.translated_audio.translatedAudioDTO import add_translated_audioDTO
from models.process_media import StatusType

# Configuración de logging
logger = logging.getLogger(__name__)

transcription_controller = TranscriptionController()
translated_audio_controller = TranslatedAudioController()
process_media_controller = ProcessMediaController()

# Config example:
# config = {
#     "user_id": 1,
#     "record_id": 123,
#     "process_media_id": 456,
#     "providers": {
#         "transcription": 1,
#         "translation": 2,
#         "audio_generation": 3
#     },
#     "languages": {
#         "from": 1,
#         "to": 2
#     }
# }

async def handle_transcription(config: dict):
    # Extract necessary values from the configuration dictionary
    user_id = config.get("user_id")
    audio_id = config.get("record_id")
    provider_id = config["providers"]["transcription"]

    transcription_dto = add_transcriptionDTO(
        audio_id=audio_id, 
        provider_id=provider_id
    )
    
    # Create the transcription record
    transcription_record = await transcription_controller.create_transcription(transcription_dto)
    
    # Build the response
    response = {
        "message": f"Transcription completed",
        "audio_id": audio_id,
        "user_id": user_id,
        "transcription_id": transcription_record.id,
        "task": "transcribe",
    }

    config["record_id"] = transcription_record.id
    
    # Send message and add task to the queue
    await send_message(response)
    await add_audio_task(config, "translate")

async def handle_translation(config: dict):
    # Extract necessary values from the configuration dictionary
    user_id = config.get("user_id")
    transcription_id = config.get("record_id")
    provider_id = config["providers"]["translation"]
    from_language = config["languages"]["from"]
    to_language = config["languages"]["to"]

    translation_dto = add_translationDTO(
        transcription_id=transcription_id, 
        provider_id=provider_id, 
        language_id_from=from_language,
        language_id_to=to_language
    )
    
    # Create the translation record
    translation_record = await translation_controller.create_translation(translation_dto)
    
    # Build the response
    response = {
        "message": f"Translate completed",
        "audio_id": translation_record.audio_id,
        "user_id": user_id,
        "translate_id": translation_record.id,
        "task": "translate",
    }

    config["record_id"] = translation_record.id
    
    # Send message and add task to the queue
    await send_message(response)
    await add_audio_task(config, "generate_audio")

async def handle_audio_generation(config: dict):
    # Extract necessary values from the configuration dictionary
    user_id = config.get("user_id")
    translation_id = config.get("record_id")
    provider_id = config["providers"]["audio_generation"]
    process_media_id = config.get("process_media_id")

    translated_audio_dto = add_translated_audioDTO(
        translation_id=translation_id, 
        provider_id=provider_id
    )
    
    try:
        # Create the translated audio record
        translation_audio_record = await translated_audio_controller.create_translated_audio(translated_audio_dto)
        
        # Build the response
        response = {
            "message": f"Audio generated completed",
            "audio_id": translation_audio_record.audio_id,
            "user_id": user_id,
            "translated_audio_id": translation_audio_record.id,
            "task": "generate_audio",
        }
        
        # Update the process media status to DONE
        update_result = process_media_controller.update_process_media_status(process_media_id, StatusType.DONE)
        logger.info(f"TextToSpeech: Updated process media {process_media_id} status to DONE")
        response["status"] = "DONE"

        # Send message
        await send_message(response)
        
    except Exception as e:
        error_msg = f"Error in handle_audio_generation: {str(e)}"
        logger.error(error_msg)
        await send_message({"error": error_msg, "task": "generate_audio"})
        
        # If there was an error, set the process_media status to FAIL
        if process_media_id:
            try:
                process_media_controller.update_process_media_status(process_media_id, StatusType.FAIL)
                logger.info(f"TextToSpeech: Updated process media {process_media_id} status to FAIL due to error")
            except Exception as update_error:
                logger.error(f"TextToSpeech: Error updating process media status to FAIL: {str(update_error)}")
        
        # Re-raise the exception to let the caller handle it
        raise