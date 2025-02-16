import asyncio


message_queue = asyncio.Queue()

async def send_message(message: str):
    await message_queue.put(message)
