from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import init_db
from dotenv import load_dotenv
import os
import uvicorn 

# Instancia de la aplicacion 
app = FastAPI()

# Cargar el archivo .env
load_dotenv(dotenv_path='../.env')

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

# Inicialización manual
# def initialize():
#     init_db()

# #Inicializar la base de datos antes de iniciar la aplicación
# initialize()

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

# Configuración del host y puerto
if __name__ == "__main__":
    environment = os.getenv("ENVIRONMENT", "development")
    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", 8000))
    print(f"Starting server at http://{host}:{port}")
    print(f"Documentation available at http://{host}:{port}/docs")
    
    if environment == "development":
        uvicorn.run(app, host=host, port=port)
    else:
        print("Running in production mode")

# # Clase Item
# class Item(BaseModel):
#     name: str
#     description: str = None

# # Ruta GET
# @app.get("/{item_id}")
# async def read_item(item_id: int, q: str = None):
#     return {"item_id": item_id, "q": {f"Este es el par {item_id*2}"}}

# # Ruta POST
# @app.post("/items/")
# async def create_item(item: Item):  # Pydantic model for data validation
#     return {"item": item}

# # Ruta PUT
# @app.put("/items/{item_id}")
# async def update_item(item_id: int, item: Item):
#     return {"item_id": item_id, "updated_item": item}

# # Ruta DELETE
# @app.delete("/items/{item_id}")
# async def delete_item(item_id: int):
#     return {"message": f"Item {item_id} deleted"}