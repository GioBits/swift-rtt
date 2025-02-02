import whisper
from typing import Optional
import warnings
import os

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

class Transcriber:
    def __init__(self, model_size: str = "small"):
        self.model_size = model_size
        self.model = self.load_model()
        
    def load_model(self):
        print("Loading Whisper model...")
        model = whisper.load_model(self.model_size)
        print("Model loaded.")
        return model
    
    def transcribe_audio(self, file_path: str) -> str:
        # Mensaje de depuración para verificar la ruta del archivo
        print(f"Transcribing file at: {file_path}")
        
        # Verificar que el archivo existe antes de intentar transcribirlo
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Mensaje de depuración antes de la transcripción
        print(f"Starting transcription for file: {file_path}")
        
        try:
            result = self.model.transcribe(file_path, fp16=False)
            print(f"Transcription result: {result}")
            return result["text"]
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            raise

# Crear una instancia global del transcriptor
transcriber = Transcriber()