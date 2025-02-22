import asyncio
import logging
from api.controller.transcriptionController import TranscriptionController
from api.controller.translationController import create_translation_controller
from api.controller.translatedAudioController import create_translated_audio_controller
import json

transcription_controller = TranscriptionController()

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
    """
    This loop only dispatches tasks:
    - Consumes the queue,
    - Launches individual coroutines,
    - Quickly releases the queue to avoid blocking.
    """
    while True:
        audio_id, provider_id, task = await task_queue.get()
        asyncio.create_task(process_one_task(audio_id, provider_id, task))
        task_queue.task_done()


async def process_one_task(audio_id: int, provider_id: int, task: str):
    """
    Processes a single task and sends messages as soon as important steps are completed.
    """
    try:
        if task == "transcribe":
            transcription_record = await transcription_controller.create_transcription(audio_id, provider_id)
            response = {
                "messaage": f"Transcription for audio {audio_id} completed",
                "audio_id": audio_id,
                "transcription_id": transcription_record.id,
                "task": task,
            }
            await send_message(json.dumps(response))

            # When finished, put the next task in the queue
            await task_queue.put((transcription_record.id, 1, "translate"))

        elif task == "translate":
            translation_record = await create_translation_controller(audio_id, provider_id, 1)
            response = {
                "messaage": f"Translate for transcription {audio_id} completed",
                "audio_id": translation_record.audio_id,
                "translate_id": translation_record.id,
                "task": task,
            }
            await send_message(json.dumps(response))

            await task_queue.put((translation_record.id, 1, "generate_audio"))

        elif task == "generate_audio":
            translation_audio_record = await create_translated_audio_controller(audio_id, provider_id)
            response = {
                "messaage": f"Audio generated for translation {audio_id} completed",
                "audio_id": translation_audio_record.audio_id,
                "transtaled_audio_id": translation_audio_record.id,
                "task": task,
            }
            await send_message(json.dumps(response))

    except Exception as e:
        error_msg = f"Error processing audio tasks: {str(e)}"
        print(error_msg)
        await send_message(error_msg)