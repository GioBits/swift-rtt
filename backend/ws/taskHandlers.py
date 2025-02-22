import json
from api.controller.transcriptionController import TranscriptionController
from api.routes.translationRoute import translation_controller
from api.controller.translatedAudioController import TranslatedAudioController

transcription_controller = TranscriptionController()
translated_audio_controller = TranslatedAudioController()

async def handle_transcription(audio_id: int, provider_id: int, send_message, add_audio_task):
    transcription_record = await transcription_controller.create_transcription(audio_id, provider_id)
    response = {
        "message": f"Transcription for audio {audio_id} completed",
        "audio_id": audio_id,
        "transcription_id": transcription_record.id,
        "task": "transcribe",
    }
    await send_message(json.dumps(response))
    await add_audio_task(transcription_record.id, 1, "translate")

async def handle_translation(audio_id: int, provider_id: int, send_message, add_audio_task):
    translation_record = await translation_controller.create_translation(audio_id, provider_id, 1)
    response = {
        "message": f"Translate for transcription {audio_id} completed",
        "audio_id": translation_record.audio_id,
        "translate_id": translation_record.id,
        "task": "translate",
    }
    await send_message(json.dumps(response))
    await add_audio_task(translation_record.id, 1, "generate_audio")

async def handle_audio_generation(audio_id: int, provider_id: int, send_message):
    translation_audio_record = await translated_audio_controller.create_translated_audio(audio_id, provider_id)
    response = {
        "message": f"Audio generated for translation {audio_id} completed",
        "audio_id": translation_audio_record.audio_id,
        "translated_audio_id": translation_audio_record.id,
        "task": "generate_audio",
    }
    await send_message(json.dumps(response))