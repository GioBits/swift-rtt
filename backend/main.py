from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import init_db, DATABASE_URL
from utils.migrations import run_migrations
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
import uvicorn 

# Cargar el archivo .env
load_dotenv(dotenv_path='../.env')

# Instancia de la aplicacion 
app = FastAPI()
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

# Ruta Raiz
@app.get("/")
async def root():
    return {"message":"Hola a todos, sean bienvenidos"}

# Endpoint "/ping", debe retornar "pong"
@app.get("/ping")
def ping():
    try:
        return {"message" : "pong"}
    except:
        raise HTTPException(status_code=500, detail= "Internal Server Error")

# Endpoint "/upload", recibe archivo de audio
@app.post("/upload")
async def UploadAudio(uploadedAudio : UploadFile):
    content = await uploadedAudio.read()
    #procesar archivo

# Configuración del host y puerto
if __name__ == "__main__":
    environment = os.getenv("API_ENV", "development")
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", 8000))
    print(f"Starting server at http://{host}:{port}")
    print(f"Documentation available at http://{host}:{port}/docs")

    #RUN MIGRATIONS
    try:
        run_migrations()
        print("✅ Migraciones automáticas aplicadas")
    except Exception as e:
        print(f"❌ Error en migraciones: {str(e)}")
        raise

    
    if environment == "development":
        uvicorn.run(app, host=host, port=port)
    else:
        print("Running in production mode")