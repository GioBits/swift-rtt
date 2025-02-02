import whisper
from typing import Optional
import warnings

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

class Transcriber:
    def __init__(self, model_size: str = "small"):
        self.model = None
        self.model_size = model_size
        
    def load_model(self):
        if not self.model:
            self.model = whisper.load_model(self.model_size)
    
    def transcribe_audio(self, file_path: str) -> str:
        self.load_model()
        result = self.model.transcribe(file_path, fp16=False) 
        return result["text"]

transcriber = Transcriber()