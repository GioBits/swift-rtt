from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from api.controller.audioController import process_audio

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio")
async def UploadAudio(uploadedAudio : UploadFile = File(...)):
    """
    Handles the upload of an audio file.
    Args:
        uploadedAudio (UploadFile): The audio file to be uploaded.
    Returns:
        JSONResponse: The response after processing the audio file.
    """

    #mock chat_id
    chat_id = "12345"

    response = await process_audio(chat_id, uploadedAudio, db=None)
    return JSONResponse(content=response)



# Verificar si filename, content_type y file_size son válidos para el programa
def validation(audio_data : UploadFile, size):
    filename = audio_data.filename

    ## Usando una variable booleana para indicar si es válido o inválido
    # Verifica el nombre no sea más de 255 caracteres de largo
    if len(filename) > 255:
        raise HTTPException(status_code = 400, detail="File name too long")

    # Verifica que el archivo sea de un formato aceptado por el sistema
    # se usa .wav y .mp3 como pruebas
    valid_Formats = {".mp3"}
    if not any(filename.endswith(extension) for extension in valid_Formats):
        raise HTTPException(status_code = 400, detail="Invalid file format")

    # Verifica que el archivo no sea demasiado pesado (max 10MB)
    max_size = 10 * 1024 * 1024 # 10MB en Bytes
    if size > max_size:
        raise HTTPException(status_code = 400, detail="File size exceeds 10MB")
    
    return True
    