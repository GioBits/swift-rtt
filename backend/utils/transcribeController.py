from fastapi import HTTPException
from utils.transcribe import transcriber
import tempfile
import os
import asyncio

async def transcription_control(file_data: bytes)-> str:
    """
    Controlador para manejar la transcripción de un archivo de audio.

    Args:
        file_data (bytes): Datos binarios del archivo de audio.

    Returns:
        str: Transcripción del audio.
    """
    try:
        # Crear un archivo temporal para almacenar el contenido del archivo subido
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file_data)
            temp_path = temp_file.name

        # Obtener el bucle de eventos actual
        loop = asyncio.get_running_loop()

        # Ejecutar la transcripción en un ejecutor (hilo separado)
        transcription = await loop.run_in_executor(
            None,
            lambda: transcriber.transcribe_audio(temp_path)
        )

        # Eliminar el archivo temporal
        os.unlink(temp_path)

        return transcription
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la transcripción: {str(e)}")