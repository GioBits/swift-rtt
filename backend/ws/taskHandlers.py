import json
from ws.queueSetup import send_message, add_audio_task
from api.controller.transcriptionController import TranscriptionController
from api.routes.translationRoute import translation_controller
from api.controller.translatedAudioController import TranslatedAudioController

transcription_controller = TranscriptionController()
translated_audio_controller = TranslatedAudioController()

# Config example:
# config = {
#     "user_id": 1,
#     "record_id": 123,
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
    
    # Create the transcription record
    transcription_record = await transcription_controller.create_transcription(audio_id, provider_id)
    
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
    
    # Create the translation record
    translation_record = await translation_controller.create_translation(
        transcription_id,
        provider_id, 
        to_language
    )
    
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
    
    # Create the translated audio record
    translation_audio_record = await translated_audio_controller.create_translated_audio(translation_id, provider_id)
    
    # Build the response
    response = {
        "message": f"Audio generated completed",
        "audio_id": translation_audio_record.audio_id,
        "user_id": user_id,
        "translated_audio_id": translation_audio_record.id,
        "task": "generate_audio",
    }
    
    # Send message
    await send_message(response)