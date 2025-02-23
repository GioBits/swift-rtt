import asyncio

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