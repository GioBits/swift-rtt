from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from utils.translate import translate
import asyncio
import os

router = APIRouter()

@router.post("/translate")
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