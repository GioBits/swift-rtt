import asyncio
import logging
import json
from ws.queueSetup import get_message_queue, get_task_queue, send_message, add_audio_task
from ws.taskHandlers import handle_transcription, handle_translation, handle_audio_generation

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_background_process():
    """
    Starts a background process to handle audio tasks.

    This function retrieves the current event loop and creates an asynchronous
    task to process audio tasks in the background.

    Note:
        This function should be called within an asynchronous context where
        an event loop is already running.

    Raises:
        RuntimeError: If there is no current event loop in the context.
    """
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
        await handle_task(record_id, provider_id, task)
        task_queue.task_done()

task_handlers = {
    "transcribe": handle_transcription,
    "translate": handle_translation,
    "generate_audio": handle_audio_generation,
}

async def handle_task(record_id: int, provider_id: int, task: str):
    """
    Asynchronously handles a task by invoking the appropriate handler based on the task type.
    Args:
        record_id (int): The ID of the record to process.
        provider_id (int): The ID of the provider associated with the task.
        task (str): The type of task to be handled.
    Raises:
        Exception: If an error occurs while processing the task.
    Logs:
        Logs an error message if the task type is unknown or if an exception occurs during task processing.
    Sends:
        Sends an error message if the task type is unknown or if an exception occurs during task processing.
    """
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