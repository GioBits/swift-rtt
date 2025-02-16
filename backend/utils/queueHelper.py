import asyncio
import logging
from api.controller.transcriptionController import create_transcription_controller
from api.controller.translationController import create_translation_controller
from api.controller.translatedAudioController import create_translated_audio_controller

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

message_queue = asyncio.Queue()
task_queue = asyncio.Queue()

def start_background_process():
    loop = asyncio.get_event_loop()
    loop.create_task(process_audio_tasks())  

async def send_message(message: str):
    await message_queue.put(message)

async def add_audio_task(audio_id: int, provider_id: int, task: str):
    await task_queue.put((audio_id, provider_id, task))

async def process_audio_tasks():
    while True:
        audio_id, provider_id, task = await task_queue.get()
        try:

            if task == "transcribe":
                # Transcribe the audio
                transcription_record = await create_transcription_controller(audio_id, provider_id)
                await send_message(f"Transcription for audio {audio_id} completed")

            if task == "translate":
                # Translate the transcription
                translation_record = await create_translation_controller(audio_id, provider_id, 1)
                await send_message(f"Translation for audio {audio_id} completed")

            if task == "generate_audio":
                # Generate tts audio
                translation_audio_record = await create_translated_audio_controller(audio_id, provider_id)
                await send_message(f"Audio processing for audio {audio_id} completed")

        except Exception as e:
            print(f"Error processing audio tasks: {str(e)}")
            await send_message(f"Error processing audio tasks: {str(e)}")
        finally:
            task_queue.task_done()