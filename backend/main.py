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

# Importar las routes
from api.routes.audioRoute import router as audioRouter
from api.routes.translatedAudioRoute import router as translatedAudioRouter
from api.routes.languageRoute import router as languageRouter
from api.routes.transcriptionRoute import router as transcriptionRouter
from api.routes.translationRoute import router as translationRouter
from api.routes.providerRoute import router as providerRouter
from api.routes.userRoute import router as userRouter
from api.routes.authRoute import router as auhtRouter
from api.routes.scoreRoute import router as scoreRouter
from api.routes.loginRecordRoute import router as loginRecordRouter
from api.routes.processMediaRoute import router as processMediaRouter

from contextlib import asynccontextmanager

# Import the populate script
from scripts.populate import populate as populate_tables

#Import the utils router
from api.routes.utilsRoute import router as utilsRouter

#Import queue helper
from ws.queueSetup import get_message_queue
from ws.brokerDispatcher import start_background_process
from ws.connectionManager import manager

#Template html
from utils.html_template import html

# Cargar el archivo .env
load_dotenv(dotenv_path='../.env')

# Tags for swagger documentation
tags_metadata = [
    {"name": "Health", "description": "Health check endpoint"},
    {"name": "Languages", "description": "Operations related to languages"},
    {"name": "Providers", "description": "Operations related to providers"},
    {"name": "Auth", "description": "Operations related login and sign-in"},
    {"name": "Users", "description": "Operations related to users"},
    {"name": "Login Records", "description": "Operations related to login records"},
    {"name": "Process Media", "description": "Operations related to processing media (translation requests)"},
    {"name": "Audio", "description": "Operations related to audio files"},
    {"name": "Transcriptions", "description": "Operations related to transcriptions"},
    {"name": "Translated text", "description": "Operations related to translations"},
    {"name": "Translated Audios", "description": "Operations related to translated audio files"},
    {"name": "Scores", "description": "Operations related to scores"},
    {"name": "Utils", "description": "Utility endpoints"}
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_background_process()
    yield

app = FastAPI(
    lifespan=lifespan,
    openapi_tags=tags_metadata
)

# Routes
app.include_router(languageRouter, prefix=("/api"))
app.include_router(providerRouter, prefix=("/api"))
app.include_router(userRouter, prefix=("/api"))
app.include_router(audioRouter, prefix=("/api"))
app.include_router(transcriptionRouter, prefix=("/api"))
app.include_router(translationRouter, prefix=("/api"))
app.include_router(translatedAudioRouter, prefix=("/api"))
app.include_router(auhtRouter, prefix=("/api"))
app.include_router(scoreRouter, prefix=("/api"))
app.include_router(loginRecordRouter, prefix=("/api"))
app.include_router(processMediaRouter, prefix=("/api"))

#Test endpoints
app.include_router(utilsRouter, prefix=("/utils"))

# # Cors confic
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://82.86.111.16:3000", 
        "http://localhost:3000",
        "http://66.42.83.237:3000", 
        "http://138.199.35.206:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/{user_id}")
async def get():
    return HTMLResponse(html)

@app.get("/api/ping", tags=["Health"])
def ping():
    try:
        return {"message" : "pong"}
    except:
        raise HTTPException(status_code=500, detail= "Internal Server Error")

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            message = await get_message_queue().get()
            await manager.send_message(message)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"WebSocket: User {user_id} disconnected")

# Config host and port for the server
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