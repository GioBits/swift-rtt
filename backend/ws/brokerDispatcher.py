import asyncio
import logging
import json
from ws.queueSetup import get_message_queue, get_task_queue, send_message, add_audio_task
from ws.taskHandlers import handle_transcription, handle_translation, handle_audio_generation

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_background_process():
    loop = asyncio.get_event_loop()
    loop.create_task(process_audio_tasks())  

async def process_audio_tasks():
    """
    This loop only dispatches tasks:
    - Consumes the queue,
    - Launches individual coroutines,
    - Quickly releases the queue to avoid blocking.
    """
    task_queue = get_task_queue()
    while True:
        record_id, provider_id, task = await task_queue.get()
        asyncio.create_task(handle_task(record_id, provider_id, task))
        task_queue.task_done()

task_handlers = {
    "transcribe": handle_transcription,
    "translate": handle_translation,
    "generate_audio": handle_audio_generation,
}

async def handle_task(record_id: int, provider_id: int, task: str):
    handler = task_handlers.get(task)
    if not handler:
        error_msg = f"Unknown task type: {task}"
        logger.error(error_msg)
        await send_message(error_msg)
        return

    try:
        await handler(record_id, provider_id)
    except Exception as e:
        error_msg = f"Error processing task {task} for audio {record_id}: {str(e)}"
        logger.error(error_msg)
        await send_message(error_msg)