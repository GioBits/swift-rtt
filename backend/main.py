from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Instancia de la aplicacion 
app = FastAPI()

# Cargar el archivo .env
load_dotenv()

# Lista de origenes permitidos
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")

# Endpoing "/ping", debe retornar "pong"
@app.get("/ping")
def ping():
    try:
        return {"message" : "pong"}
    except:
        raise HTTPException(status_code=500, detail= "Internal Server Error")

# Clase Item
class Item(BaseModel):
    name: str
    description: str = None


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

# Ruta GET
@app.get("/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": {f"Este es el par {item_id*2}"}}

# Ruta POST
@app.post("/items/")
async def create_item(item: Item):  # Pydantic model for data validation
    return {"item": item}

# Ruta PUT
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "updated_item": item}

# Ruta DELETE
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted"}