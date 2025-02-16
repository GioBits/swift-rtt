import asyncio
from api.controller.transcriptionController import create_transcription_controller
from api.controller.translationController import create_translation_controller
from api.controller.translatedAudioController import create_translated_audio_controller


message_queue = asyncio.Queue()

async def send_message(message: str):
    await message_queue.put(message)


async def process_audio_tasks(audio_id: int, provider_id: int):
    try:
        # Transcribe the audio
        transcription_record = await create_transcription_controller(audio_id, provider_id)

        # Translate the transcription
        translation_record = await create_translation_controller(transcription_record.id, provider_id, 1)

        # Generate tts audio
        translation_audio_record = await create_translated_audio_controller(translation_record.id, provider_id)

        # Enviar mensaje por WebSocket cuando las tareas terminen
        await send_message("Audio processing completed")

    except Exception as e:
        print(f"Error processing audio tasks: {str(e)}")
        await send_message(f"Error processing audio tasks: {str(e)}")