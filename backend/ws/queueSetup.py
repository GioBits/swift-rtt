import asyncio

message_queue = asyncio.Queue()
task_queue = asyncio.Queue()

def get_message_queue():
    return message_queue

def get_task_queue():
    return task_queue