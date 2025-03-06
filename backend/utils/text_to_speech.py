import io
import numpy as np
import asyncio
import logging
from scipy.io.wavfile import write
from TTS.api import TTS, ModelManager
from TTS.utils.synthesizer import Synthesizer
import os

# Set up logging configuration to suppress TTS logs
logging.getLogger("TTS").setLevel(logging.ERROR)
class Text2Speech:
    def __init__(self):
        '''
        Initialize any necessary attributes here.
        Currently, this method does not initialize any attributes.
        '''
        #tts_models/en/ljspeech/tacotron2-DDC
        #tts_models/en/ljspeech/glow-tts
        self.models = {
            1: {"language": "english", "model": None, "model_name": "tts_models/en/ljspeech/tacotron2-DDC"},
            2: {"language": "spanish", "model": None, "model_name": "tts_models/es/css10/vits"}
        }   

        for language_id in self.models:
            self.initialize_model(language_id)
            # print("termine de cargar el modelo")

    def initialize_model(self, language_id):
        '''
        Initialize the text-to-speech model based on the specified language.

        Parameters:
        language (str): The language of the speech ('es' for Spanish, 'en' for English).

        Raises:
        ValueError: If the specified language is not supported.
        TTS.api.TTS related errors: If there is a problem loading the TTS model.
        '''
        if language_id not in self.models:
            raise ValueError(f"TextToSpeech: Language '{language_id}' not supported. Supported languages are: 'es', 'en'")
        
        model_obj = self.models.get(language_id)

        # Load the English text-to-speech model
        # model_path = f"../static/text2speech/{model_obj.get('model_name')}"   
        # if not os.path.exists(model_path):
        #     os.makedirs(model_path)

        print(f"TextToSpeech: Loading model text to speech for language: {model_obj.get('language')}")
        model_obj["model"] = TTS(model_obj.get('model_name'), gpu=False) # Force CPU usage
  
    
    def generate_audio_bytes(self, text: str, language_id: int) -> np.ndarray:
        '''
        Generate speech audio from text.

        Parameters:
        text (str): The text to convert to speech.
        language_id (int): The language ID (1 for English, 2 for Spanish).

        Returns:
        np.ndarray: The generated audio as a NumPy array.
        '''

        if language_id not in self.models :
            raise ValueError(f"Language '{language_id}' not supported. Supported languages are: 'es', 'en'")
    
        tts = self.models.get(language_id).get("model")
        # Generate the audio output
        audio = tts.tts(text=text)
        return np.array(audio, dtype=np.float32)  # Ensure correct data type

    def seeDownloadModels(self):
        '''
        List available text-to-speech models and print them based on language.
        '''
        # Create an instance of ModelManager to list available models
        manager = ModelManager()

        # Iterate through the list of models and print them based on language
        for model in manager.list_models():
            if "es" in model:
                print(f"Models in Spanish: {model}")
            elif "en" in model:
                print(f"Models in English: {model}")
            else:
                print(f"Other Models : {model}")

    async def text_2_speech(self, text: str, audio_id: int, language_id: int) -> bytes:
        '''
        Generate speech audio from text based on the specified language.

        Parameters:
        text (str): The text to convert to speech.
        language (str): The language of the speech ('es' for Spanish, 'en' for English).

        Returns:
        bytes: The generated audio as a binary stream.

        Raises:
        ValueError: If the specified language is not supported or if the generated audio is empty.
        TTS.api.TTS related errors: If there is a problem loading the TTS model or generating the audio.
        IOError or OSError: If there is a problem writing the audio file to the memory buffer.
        TypeError: If the provided parameters are not of the expected type.
        Exception: Any other unexpected error that may occur during the execution of the method.
        '''
        # print("Creating audio from text")
        print(f"Initiating text to speach for audio_id: {audio_id}")
        
        loop = asyncio.get_running_loop()
        try:
            audio = await loop.run_in_executor(
                None,
                lambda: self._generate_audio(text, language_id)
            )
            print("Audio was created with success")
            return audio

        except ValueError as ve:
            print(f"ValueError: {str(ve)}")
            raise
        except (IOError, OSError) as ioe:
            print(f"IOError/OSError: {str(ioe)}")
            raise
        except TypeError as te:
            print(f"TypeError: {str(te)}")
            raise
        except Exception as e:
            print(f"Error with the creation of audio: {str(e)}")
            raise

    def _generate_audio(self, text: str, language_id: int) -> bytes:
        
        # Generate audio based on the specified language
        audio = self.generate_audio_bytes(text,language_id)
        
        # Ensure the generated audio is not empty
        if audio is None or len(audio) == 0:
            raise ValueError("Generated audio is empty")
        
        # Normalize the audio to int16 format
        audio_normalized = np.int16(audio / np.max(np.abs(audio)) * 32767)
        
        # Save the audio array to a WAV file in a memory buffer
        audio_buffer = io.BytesIO()
        write(audio_buffer, 22050, audio_normalized)  # Assuming a sample rate of 22050 Hz
        audio_buffer.seek(0)
        return audio_buffer.read()

# Global instance of the Text2Speech class
text2speech = Text2Speech()
