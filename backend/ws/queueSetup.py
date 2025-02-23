import asyncio

"""
# This module sets up and manages asynchronous message and task queues using asyncio.
# Functions:
#     get_message_queue: Retrieve the current message queue instance.
#     get_task_queue: Retrieve the current task queue instance.
#     send_message: Asynchronously sends a message to the message queue.
#     add_audio_task: Asynchronously adds an audio task to the task queue.
# Queues:
#     message_queue: An asyncio.Queue instance for handling messages.
#     task_queue: An asyncio.Queue instance for handling tasks.
"""

message_queue = asyncio.Queue()
task_queue = asyncio.Queue()

def get_message_queue():
    return message_queue

def get_task_queue():
    return task_queue

async def send_message(message: str):
    await message_queue.put(message)

async def add_audio_task(audio_id: int, provider_id: int, task: str):
    await task_queue.put((audio_id, provider_id, task))