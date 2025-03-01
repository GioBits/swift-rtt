import whisper
from typing import Optional
import warnings
import os
import tempfile
import asyncio

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

class Transcriber:
    def __init__(self, model_size: str = "small"):
        self.model_size = model_size
        self.model_path = f"../static/speech2text/whisper-{model_size}"
        self.model = self.load_model()
        self.allowed_languages = ["english", "spanish"]
        
    def load_model(self):
        if not os.path.exists(self.model_path):
            os.makedirs(self.model_path)
            print("Tracriber: Downloading and saving Whisper model locally...")
            model = whisper.load_model(self.model_size, download_root=self.model_path)
        else:
            print("Transcriber: Loading Whisper model...")
            model = whisper.load_model(self.model_size, download_root=self.model_path)
        print("Transcriber: Model loaded.")
        return model
    
    def transcribe_audio(self, file_path: str, language: str) -> str:
        # print(f"Transcribing file at: {file_path}")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if language.lower() not in self.allowed_languages:
            raise ValueError(f"Language '{language}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")

        # print(f"Starting transcription in '{language}' for file: {file_path}")

        try:
            result = self.model.transcribe(file_path, fp16=False, language=language.lower())
            # print(f"Transcription result: {result["text"]}")
            return result["text"]
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            raise

    async def transcription_handler(self, file_data: bytes, audio_id:int, language_id: int)-> str:
        """
        Controlador para manejar la transcripción de un archivo de audio.

        Args:
            file_data (bytes): Datos binarios del archivo de audio.

        Returns:
            str: Transcripción del audio.
        """
        try:
            print(f"Initiating transcription for audio_id: {audio_id}")

            if language_id ==1:
                language = "english"
            elif language_id ==2:
                language = "spanish"
            else:
                raise ValueError(f"Language'{language_id}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")

            # Crear un archivo temporal para almacenar el contenido del archivo subido
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_data)
                temp_path = temp_file.name

            # Obtener el bucle de eventos actual
            loop = asyncio.get_running_loop()

            # Ejecutar la transcripción en un ejecutor (hilo separado)
            transcription = await loop.run_in_executor(
                None,
                lambda: self.transcribe_audio(temp_path, language)
            )

            # Eliminar el archivo temporal
            os.unlink(temp_path)

            return transcription
        
        except Exception as e:
            raise e

# Crear una instancia global del transcriptor
transcriber = Transcriber()