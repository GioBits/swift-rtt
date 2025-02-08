import whisper
from typing import Optional
import warnings
import os

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

class Transcriber:
    def __init__(self, model_size: str = "small"):
        self.model_size = model_size
        self.model = self.load_model()
        self.allowed_languages = ["english", "spanish"]
        
    def load_model(self):
        print("Loading Whisper model...")
        model = whisper.load_model(self.model_size)
        print("Model loaded.")
        return model
    
    def transcribe_audio(self, file_path: str, language: str) -> str:
        print(f"Transcribing file at: {file_path}")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if language.lower() not in self.allowed_languages:
            raise ValueError(f"Language '{language}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")

        print(f"Starting transcription in '{language}' for file: {file_path}")

        try:
            result = self.model.transcribe(file_path, fp16=False, language=language.lower())
            print(f"Transcription result: {result}")
            return result["text"]
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            raise

transcriber = Transcriber()