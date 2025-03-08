import io
import numpy as np
import asyncio
import logging
from scipy.io.wavfile import write
from TTS.api import TTS, ModelManager
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("Text2Speech")

# Set up logging configuration to suppress TTS logs
logging.getLogger("TTS").setLevel(logging.ERROR)

class Text2Speech:
    def __init__(self):
        """
        Initialize the Text2Speech class with default models for English and Spanish.
        """
        # Initialize with default models
        self.models = {
            1: {"language": "english", "model": None, "model_name": "tts_models/en/ljspeech/tacotron2-DDC"},
            2: {"language": "spanish", "model": None, "model_name": "tts_models/es/css10/vits"}
        }

        # Load the models for each language
        for language_id in self.models:
            self.initialize_model(language_id)

    def initialize_model(self, language_id):
        """
        Initialize the text-to-speech model based on the specified language.

        Args:
            language_id (int): The language ID (1 for English, 2 for Spanish).

        Raises:
            ValueError: If the specified language ID is not supported.
        """
        if language_id not in self.models:
            logger.error(f"TextToSpeech: Language ID '{language_id}' not supported. Supported languages are: 'english', 'spanish'.")
            raise ValueError(f"TextToSpeech: Language ID '{language_id}' not supported.")

        model_obj = self.models.get(language_id)
        logger.info(f"TextToSpeech: Loading model for language: {model_obj.get('language')}")
        model_obj["model"] = TTS(model_obj.get("model_name"), gpu=False)  # Force CPU usage
        logger.info(f"TextToSpeech: Model for language {model_obj.get('language')} loaded successfully.")

    def generate_audio_bytes(self, text: str, language_id: int) -> np.ndarray:
        """
        Generate speech audio from text.

        Args:
            text (str): The text to convert to speech.
            language_id (int): The language ID (1 for English, 2 for Spanish).

        Returns:
            np.ndarray: The generated audio as a NumPy array.

        Raises:
            ValueError: If the specified language ID is not supported.
        """
        if language_id not in self.models:
            logger.error(f"TextToSpeech: Language ID '{language_id}' not supported. Supported languages are: 'english', 'spanish'.")
            raise ValueError(f"TextToSpeech: Language ID '{language_id}' not supported.")

        tts = self.models.get(language_id).get("model")
        logger.debug(f"TextToSpeech: Generating audio for text: {text}")
        audio = tts.tts(text=text)
        return np.array(audio, dtype=np.float32)  # Ensure correct data type

    def see_download_models(self):
        """
        List available text-to-speech models and log them based on language.
        """
        manager = ModelManager()

        for model in manager.list_models():
            if "es" in model:
                logger.info(f"Models in Spanish: {model}")
            elif "en" in model:
                logger.info(f"Models in English: {model}")
            else:
                logger.info(f"Other Models: {model}")

    async def text_2_speech(self, text: str, audio_id: int, language_id: int) -> bytes:
        """
        Generate speech audio from text based on the specified language.

        Args:
            text (str): The text to convert to speech.
            audio_id (int): Identifier for the audio file.
            language_id (int): The language ID (1 for English, 2 for Spanish).

        Returns:
            bytes: The generated audio as a binary stream.

        Raises:
            ValueError: If the specified language ID is not supported or if the generated audio is empty.
            IOError/OSError: If there is a problem writing the audio file to the memory buffer.
            Exception: Any other unexpected error that may occur during execution.
        """
        logger.info(f"TextToSpeech: Initiating text-to-speech for audio_id: {audio_id}")

        loop = asyncio.get_running_loop()
        try:
            audio = await loop.run_in_executor(
                None,
                lambda: self._generate_audio(text, language_id)
            )
            logger.info(f"TextToSpeech: Audio created successfully for audio_id: {audio_id}")
            return audio

        except ValueError as ve:
            logger.error(f"TextToSpeech: ValueError during text-to-speech for audio_id: {audio_id}: {str(ve)}")
            raise
        except (IOError, OSError) as ioe:
            logger.error(f"TextToSpeech: IOError/OSError during text-to-speech for audio_id: {audio_id}: {str(ioe)}")
            raise
        except TypeError as te:
            logger.error(f"TextToSpeech: TypeError during text-to-speech for audio_id: {audio_id}: {str(te)}")
            raise
        except Exception as e:
            logger.error(f"TextToSpeech: Unexpected error during text-to-speech for audio_id: {audio_id}: {str(e)}")
            raise

    def _generate_audio(self, text: str, language_id: int) -> bytes:
        """
        Generate audio based on the specified language.

        Args:
            text (str): The text to convert to speech.
            language_id (int): The language ID (1 for English, 2 for Spanish).

        Returns:
            bytes: The generated audio as a binary stream.

        Raises:
            ValueError: If the generated audio is empty.
        """
        # Generate audio based on the specified language
        audio = self.generate_audio_bytes(text, language_id)

        # Ensure the generated audio is not empty
        if audio is None or len(audio) == 0:
            logger.error("TextToSpeech: Generated audio is empty.")
            raise ValueError("Generated audio is empty.")

        # Normalize the audio to int16 format
        audio_normalized = np.int16(audio / np.max(np.abs(audio)) * 32767)

        # Save the audio array to a WAV file in a memory buffer
        audio_buffer = io.BytesIO()
        write(audio_buffer, 22050, audio_normalized)  # Assuming a sample rate of 22050 Hz
        audio_buffer.seek(0)
        logger.debug("TextToSpeech: Audio saved to memory buffer successfully.")
        return audio_buffer.read()