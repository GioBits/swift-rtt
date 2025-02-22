import asyncio
import logging
import json
from ws.queueSetup import get_message_queue, get_task_queue
from ws.taskHandlers import handle_transcription, handle_translation, handle_audio_generation

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_background_process():
    loop = asyncio.get_event_loop()
    loop.create_task(process_audio_tasks())  

async def send_message(message: str):
    message_queue = get_message_queue()
    await message_queue.put(message)

async def add_audio_task(audio_id: int, provider_id: int, task: str):
    task_queue = get_task_queue()
    await task_queue.put((audio_id, provider_id, task))

async def process_audio_tasks():
    """
    This loop only dispatches tasks:
    - Consumes the queue,
    - Launches individual coroutines,
    - Quickly releases the queue to avoid blocking.
    """
    task_queue = get_task_queue()
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
            await handle_transcription(audio_id, provider_id, send_message, add_audio_task)
        elif task == "translate":
            await handle_translation(audio_id, provider_id, send_message, add_audio_task)
        elif task == "generate_audio":
            await handle_audio_generation(audio_id, provider_id, send_message)
    except Exception as e:
        error_msg = f"Error processing audio tasks: {str(e)}"
        logger.error(error_msg)
        await send_message(error_msg)