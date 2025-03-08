from fastapi import WebSocket
from typing import Dict
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        print(self.active_connections)
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_message(self, message: dict):
        user_id = message.get("user_id")
        websocket = self.active_connections.get(str(user_id))
        if websocket:
            await websocket.send_text(json.dumps(message))
        else:
            raise ValueError(f"WebSocket: User {user_id} not connected")

manager = ConnectionManager()