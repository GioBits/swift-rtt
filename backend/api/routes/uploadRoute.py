from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter()

# Endpoint "/audio", recibe archivo de audio
@router.post("/audio")
async def UploadAudio(uploadedAudio : UploadFile = File(...)):
    content = uploadedAudio
    contentBytes = await uploadedAudio.read()

    # Validación del archivo
    if not validation(content):
        raise HTTPException(status_code=500, detail= "Internal Server Error")
    
    filename = content.filename
    format = filename[-4:]
    size = len(contentBytes)
    # UploadController(contentBytes)
    # contentBytes: Audio en bytes para procesado
    return JSONResponse(content={"filename": filename, "format": format, "size": size})



# Verificar si filename, content_type y file_size son válidos para el programa
async def validation(audio_data : UploadFile):
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

    # Verifica que el archivo no sea demasiado pesado (max 200MB)
    max_size = 10 * 1024 * 1024 # 200MB en Bytes
    if len(audio_data) > max_size:
        raise HTTPException(status_code = 400, detail="File size exceeds 200MB")

    #reinicia apuntador del audio al comienzo luego de pruebas
    audio_data.file.seek(0)
    
    return True
    