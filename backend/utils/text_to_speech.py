import io
import numpy as np
from scipy.io.wavfile import write
from TTS.api import TTS, ModelManager
class Text2Speech:
    def __init__(self):
        '''
        Initialize any necessary attributes here.
        Currently, this method does not initialize any attributes.
        '''
        pass
    
    def spanish(self, text: str, emotion: str = None, voice: str = None, speed: float = None) -> np.ndarray:
        '''
        Generate speech audio from text in Spanish.

        Parameters:
        text (str): The text to convert to speech.
        emotion (str, optional): The emotion to apply to the speech. Default is None.
        voice (str, optional): The voice to use for the speech. Default is None.
        speed (float, optional): The speed of the speech. Default is None.

        Returns:
        np.ndarray: The generated audio as a NumPy array.
        '''
        # Load the Spanish text-to-speech model
        tts = TTS("tts_models/es/css10/vits", gpu=False)  # Force CPU usage
        # Generate the audio output
        audio = tts.tts(text=text)
        return np.array(audio, dtype=np.float32)  # Ensure correct data type

    def english(self, text: str, emotion: str = None, voice: str = None, speed: float = None) -> np.ndarray:
        '''
        Generate speech audio from text in English.

        Parameters:
        text (str): The text to convert to speech.
        emotion (str, optional): The emotion to apply to the speech. Default is None.
        voice (str, optional): The voice to use for the speech. Default is None.
        speed (float, optional): The speed of the speech. Default is None.

        Returns:
        np.ndarray: The generated audio as a NumPy array.
        '''
        # Load the English text-to-speech model
        tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", gpu=False)  # Force CPU usage
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

    async def t2s(self, text: str, language_id: int) -> bytes:
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
        print("Creating audio from text")
        try:
            audio = None
            # Generate audio based on the specified language
            if language_id == 1:
                print("Your audio is created in Spanish")
                audio = self.spanish(text)
            elif language_id == 2:
                print("Your audio is created in English")
                audio = self.english(text)
            else:
                raise ValueError(f"Language '{language_id}' not supported. Supported languages are: 'es', 'en'")
            
            # Ensure the generated audio is not empty
            if audio is None or len(audio) == 0:
                raise ValueError("Generated audio is empty")
            
            # Normalize the audio to int16 format
            audio_normalized = np.int16(audio / np.max(np.abs(audio)) * 32767)
            
            # Save the audio array to a WAV file in a memory buffer
            audio_buffer = io.BytesIO()
            write(audio_buffer, 22050, audio_normalized)  # Assuming a sample rate of 22050 Hz
            audio_buffer.seek(0)
            print("Audio was created with success")
            return audio_buffer.read()

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

# Global instance of the Text2Speech class
text2speech = Text2Speech()
'''
long_text = (
    "Once upon a time, in a faraway land, there was a small village surrounded by lush forests and rolling hills. "
    "The villagers lived a simple life, tending to their farms and raising their families. "
    "Every morning, the sun would rise over the hills, casting a golden glow over the village. "
    "The children would run and play in the fields, their laughter echoing through the air. "
    "In the evenings, the villagers would gather around the fire, sharing stories and songs. "
    "Life was peaceful and harmonious, and the villagers were content. "
    "But one day, a mysterious traveler arrived in the village. "
    "He spoke of distant lands and great adventures, and the villagers listened in awe. "
    "The traveler stayed for many days, sharing his tales and teaching the villagers new skills. "
    "When he finally left, the village was forever changed. "
    "The villagers had a newfound sense of curiosity and wonder, and they began to explore the world beyond their village. "
    "They discovered new places, met new people, and learned new things. "
    "And though they always returned to their village, they carried with them the spirit of adventure and the joy of discovery."
)

long_text = (
    "Había una vez, en una tierra lejana, un pequeño pueblo rodeado de frondosos bosques y colinas onduladas. "
    "Los aldeanos vivían una vida sencilla, cuidando de sus granjas y criando a sus familias. "
    "Cada mañana, el sol se levantaba sobre las colinas, arrojando un resplandor dorado sobre el pueblo. "
    "Los niños corrían y jugaban en los campos, sus risas resonando en el aire. "
    "Por las noches, los aldeanos se reunían alrededor del fuego, compartiendo historias y canciones. "
    "La vida era pacífica y armoniosa, y los aldeanos estaban contentos. "
    "Pero un día, un misterioso viajero llegó al pueblo. "
    "Hablaba de tierras lejanas y grandes aventuras, y los aldeanos escuchaban con asombro. "
    "El viajero se quedó muchos días, compartiendo sus historias y enseñando nuevas habilidades a los aldeanos. "
    "Cuando finalmente se fue, el pueblo cambió para siempre. "
    "Los aldeanos tenían un nuevo sentido de curiosidad y asombro, y comenzaron a explorar el mundo más allá de su pueblo. "
    "Descubrieron nuevos lugares, conocieron nuevas personas y aprendieron cosas nuevas. "
    "Y aunque siempre regresaban a su pueblo, llevaban consigo el espíritu de la aventura y la alegría del descubrimiento."
)

async def main():
    text2speech = Text2Speech()
    long_text = "Hola,+¿cómo+estás?+¡Espero+que+bien!+¿Qué+planes+tienes+para+hoy?"
    audio = await text2speech.t2s(long_text, 1)
    with open("output_en.wav", "wb") as f:
        f.write(audio)

import asyncio
asyncio.run(main())
'''