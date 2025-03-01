import asyncio
import logging
import json
import time
from utils.taskMetrics import update_task_metrics
from ws.queueSetup import get_message_queue, get_task_queue, send_message, add_audio_task
from ws.taskHandlers import handle_transcription, handle_translation, handle_audio_generation

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_background_process():
    """
    Starts a background process to handle audio tasks.

    This function retrieves the current event loop and creates an asynchronous
    task_label to process audio tasks in the background.

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
        task_to_process = await task_queue.get()
        await handle_task(task_to_process)
        task_queue.task_done()

task_handlers = {
    "transcribe": handle_transcription,
    "translate": handle_translation,
    "generate_audio": handle_audio_generation,
}

async def handle_task(task_to_process: tuple):
    """
    Handle and process a given task asynchronously.
    Args:
        task_to_process (tuple): A tuple containing the configuration and task label.
    Returns:
        None
    The function retrieves the appropriate handler for the given task label from the task_handlers dictionary.
    If the handler is not found, it logs an error message and sends it. If the handler is found, it processes
    the task and logs any exceptions that occur during processing. Finally, it logs the elapsed time for the task
    and updates the task metrics.
    """
    start_time = time.time()

    config, task_label = task_to_process

    handler = task_handlers.get(task_label)

    if not handler:
        error_msg = f"Unknown task type: {task_label}"
        logger.error(error_msg)
        await send_message(error_msg)
        return

    try:
        await handler(config)
        
    except Exception as e:
        error_msg = f"Error processing task {task_label} : {str(e)}"
        logger.error(error_msg)
        await send_message(error_msg)
    finally:
        elapsed_time = time.time() - start_time
        logger.info(f"Task {task_label} completed in {elapsed_time:.2f} seconds")

        # Update task metrics
        update_task_metrics(task_label, elapsed_time)