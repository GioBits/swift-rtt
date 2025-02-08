from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from utils.transcribe import transcriber
import tempfile
import os
import asyncio

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio_file(file: UploadFile = File(...), language: str = Form(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name
            
        loop = asyncio.get_running_loop()
        transcription = await loop.run_in_executor(
            None, 
            lambda: transcriber.transcribe_audio(temp_path, language)
        )
            
        os.unlink(temp_path)
            
        return JSONResponse(content={"transcription": transcription})
            
    except Exception as e:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        raise HTTPException(status_code=500, detail=f"Error en transcripción: {str(e)}")
