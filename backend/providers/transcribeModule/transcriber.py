import whisper
from typing import Optional
import warnings
import os
import tempfile
import asyncio
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("Transcriber")

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

class Transcriber:
    def __init__(self, model_size: str = "small"):
        """
        Initialize the Transcriber with the specified Whisper model size.
        """
        self.model_size = model_size
        self.model_path = f"../static/speech2text/whisper-{model_size}"
        self.model = self.load_model()
        self.allowed_languages = ["english", "spanish", "italian", "chinese"]
        
    def load_model(self):
        """
        Load the Whisper model from the local path or download it if necessary.
        """
        if not os.path.exists(self.model_path):
            logger.info("Transcriber: Downloading and saving Whisper model locally...")
            os.makedirs(self.model_path, exist_ok=True)
            model = whisper.load_model(self.model_size, download_root=self.model_path)
        else:
            logger.info("Transcriber: Loading Whisper model...")
            model = whisper.load_model(self.model_size, download_root=self.model_path)
        
        logger.info("Transcriber: Model loaded.")
        return model
    
    def transcribe_audio(self, file_path: str, language: str) -> str:
        """
        Transcribe an audio file into text.

        Args:
            file_path (str): Path to the audio file.
            language (str): Language of the audio ("english", "spanish", "italian").

        Returns:
            str: Transcribed text.

        Raises:
            FileNotFoundError: If the audio file does not exist.
            ValueError: If the language is not supported.
        """
        if not os.path.exists(file_path):
            logger.error(f"Transcriber: File not found: {file_path}")
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if language.lower() not in self.allowed_languages:
            logger.error(f"Transcriber: Language '{language}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")
            raise ValueError(f"Transcriber: Language '{language}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")

        logger.info(f"Transcriber: Starting transcription in '{language}' for file: {file_path}")

        try:
            result = self.model.transcribe(file_path, fp16=False, language=language.lower())
            logger.info(f"Transcriber: Transcription completed successfully.")
            return result["text"]
        except Exception as e:
            logger.error(f"Transcriber: Error during transcription: {str(e)}")
            raise

    async def transcription_handler(self, file_data: bytes, audio_id: int, language_id: int) -> str:
        """
        Handle the transcription of an audio file from binary data.

        Args:
            file_data (bytes): Binary data of the audio file.
            audio_id (int): Identifier for the audio file.
            language_id (int): Language ID (1 for English, 2 for Spanish, 3 for Italian).

        Returns:
            str: Transcribed text.

        Raises:
            ValueError: If the language ID is not supported.
        """
        try:
            logger.info(f"Transcriber: Initiating transcription for audio_id: {audio_id}")

            # Map language ID to language name
            if language_id == 1:
                language = "english"
            elif language_id == 2:
                language = "spanish"
            elif language_id == 3:
                language = "italian"
            elif language_id == 4:
                language = "chinese"
            else:
                logger.error(f"Transcriber: Language ID '{language_id}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")
                raise ValueError(f"Language ID '{language_id}' not supported. Supported languages are: {', '.join(self.allowed_languages)}")

            # Create a temporary file to store the audio data
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_data)
                temp_path = temp_file.name

            # Get the current event loop
            loop = asyncio.get_running_loop()

            # Run the transcription in a separate thread
            logger.info(f"Transcriber: Running transcription in executor for audio_id: {audio_id}")
            transcription = await loop.run_in_executor(
                None,
                lambda: self.transcribe_audio(temp_path, language)
            )

            # Delete the temporary file
            os.unlink(temp_path)

            logger.info(f"Transcriber: Transcription completed successfully for audio_id: {audio_id}")
            return transcription
        
        except Exception as e:
            logger.error(f"Transcriber: Error during transcription for audio_id: {audio_id}: {str(e)}")
            raise