from fastapi import FastAPI, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import init_db, DATABASE_URL
from utils.migrations import run_migrations
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
import uvicorn
import asyncio
from utils.queueHelper import send_message, message_queue

# Importar las rutas
from api.routes.audioRoute import router as audioRouter
from api.routes.translatedAudioRoute import router as translatedAudioRouter
from api.routes.languageRoute import router as languageRouter
from api.routes.transcriptionRoute import router as transcriptionRouter
from api.routes.translationRoute import router as translationRouter
from api.routes.providerRoute import router as providerRouter

# Import the populate script
from scripts.populate import populate as populate_tables

#Import the utils router
from api.routes.utilsRoute import router as utilsRouter

# Cargar el archivo .env
load_dotenv(dotenv_path='../.env')

# Instancia de la aplicacion 
app = FastAPI()

# Definir las etiquetas en el orden deseado
tags_metadata = [
    {"name": "Health", "description": "Health check endpoint"},
    {"name": "Languages", "description": "Operations related to languages"},
    {"name": "Providers", "description": "Operations related to providers"},
    {"name": "Audio", "description": "Operations related to audio files"},
    {"name": "Transcriptions", "description": "Operations related to transcriptions"},
    {"name": "Translated text", "description": "Operations related to translations"},
    {"name": "Translated Audios", "description": "Operations related to translated audio files"},
    {"name": "Utils", "description": "Utility endpoints"}
]

# Instancia de la aplicacion con metadata de etiquetas
app = FastAPI(openapi_tags=tags_metadata)

# Importación de rutas
app.include_router(languageRouter, prefix=("/api"))
app.include_router(providerRouter, prefix=("/api"))
app.include_router(audioRouter, prefix=("/api"))
app.include_router(transcriptionRouter, prefix=("/api"))
app.include_router(translationRouter, prefix=("/api"))
app.include_router(translatedAudioRouter, prefix=("/api"))

#Test endpoints
app.include_router(utilsRouter, prefix=("/utils"))



# # Lista de origenes permitidos
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")

# Configuracion de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

# Endpoint "/ping", debe retornar "pong"
@app.get("/ping", tags=["Health"])
def ping():
    try:
        return {"message" : "pong"}
    except:
        raise HTTPException(status_code=500, detail= "Internal Server Error")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        message = await message_queue.get()
        await websocket.send_text(message)

# Configuración del host y puerto
if __name__ == "__main__":
    environment = os.getenv("API_ENV", "development")
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", 8000))
    print(f"Starting server at http://{host}:{port}")
    print(f"Documentation available at http://{host}:{port}/docs")

    #RUN MIGRATIONS
    try:
        # run_migrations()
        print("✅ Migraciones automáticas aplicadas")
    except Exception as e:
        print(f"❌ Error en migraciones: {str(e)}")
        raise

    # Call the populate script
    try:
        populate_tables()
        print("✅ Data population completed")
    except Exception as e:
        print(f"❌ Data population error: {str(e)}")
        raise
    
    if environment == "development":
        uvicorn.run(app, host=host, port=port)
    else:
        print("Running in production mode")