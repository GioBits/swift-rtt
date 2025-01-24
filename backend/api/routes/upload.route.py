from fastapi import FastAPI, HTTPException, UploadFile
from main import app

# How to add both file and JSON body in a FastAPI POST request?
# http://localhost:8000/docs    


# Endpoint "/audio", recibe archivo de audio
@app.post("/audio")
async def UploadAudio(uploadedAudio : UploadFile):
    content = await uploadedAudio.read()

    if (validation):
        return content
    else:
        raise HTTPException(status_code=500, detail= "Internal Server Error")


# Verificar si filename, content_type y file_size son válidos para el programa
def validation(audio_data : UploadFile):
    filename = audio_data.filename()

    ## Usando una variable booleana para indicar si es válido o inválido
    # Verifica el nombre no sea más de 255 caracteres de largo
    if len(filename) > 255:
        valid = False

    # Verifica que el archivo sea de un formato aceptado por el sistema
    # se usa .wav y .mp3 como pruebas
    valid_Formats = {".wav", ".mp3"}
    if not any(filename.endswith(extension) for extension in valid_Formats):
        valid = False

    # Verifica que el archivo no sea demasiado pesado (max 10MB)
    max_size = 10 * 1024 * 1024 # 10MB en Bytes
    if len(audio_data) > max_size:
        valid = False

    #reinicia apuntador del audio al comienzo luego de pruebas
    audio_data.file.seek(0)
    
    return valid
    