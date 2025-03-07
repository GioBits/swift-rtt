from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from providers.serviceLoader import ServiceLoader
from utils.translate import translate
import tempfile
import os
import asyncio

router = APIRouter()
transcriber = ServiceLoader.get_transcriber()

@router.post("/transcribe", tags=["Utils"])
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

@router.post("/translate", tags=["Utils"])
async def translate_file(file: UploadFile = File(...)):
    temp_path = None 
    
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        loop = asyncio.get_running_loop()
        translated_text = await loop.run_in_executor(
            None, 
            lambda: translate.translate_text(text)
        )
        
        return JSONResponse(content={"traduccion": translated_text})
        
    except Exception as e:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
