from transformers import MarianMTModel, MarianTokenizer
import asyncio
import warnings
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("Translate")

warnings.filterwarnings("ignore", message="Recommended: pip install sacremoses.")

class Translate:
    def __init__(self):
        """
        Initialize the Translate class with default models for English and Spanish.
        """
        # Initialize with default models
        self.models = {
            "english": {"model": None, "tokenizer": None, "model_name": "Helsinki-NLP/opus-mt-es-en"},
            "spanish": {"model": None, "tokenizer": None, "model_name": "Helsinki-NLP/opus-mt-en-es"}
        }

        # Load the model and tokenizer for English and Spanish
        self.load_model_and_tokenizer("english")
        self.load_model_and_tokenizer("spanish")

    def load_model_and_tokenizer(self, language: str):
        """
        Load the model and tokenizer for the specified language.

        Args:
            language (str): The target language ("english" or "spanish").
        """
        model_info = self.models[language]
        model_path = f"../static/text2text/{model_info['model_name'].replace('/', '-')}"

        if not os.path.exists(model_path):
            logger.info(f"Traductor: Creating directory for {language} model at {model_path}")
            os.makedirs(model_path)

        if model_info["model"] is None or model_info["tokenizer"] is None:
            logger.info(f"Traductor: Loading model and tokenizer for language {language}...")
            model_info["tokenizer"] = MarianTokenizer.from_pretrained(model_info["model_name"], cache_dir=model_path)
            model_info["model"] = MarianMTModel.from_pretrained(model_info["model_name"], cache_dir=model_path)
            logger.info(f"Traductor: Model and tokenizer for language {language} loaded.")

    async def translate_text(self, text: str, audio_id: int, language_id: int) -> str:
        """
        Translate text using the model corresponding to the language ID.

        Args:
            text (str): The text to translate.
            audio_id (int): Identifier for the audio file.
            language_id (int): Language ID (1 for English, 2 for Spanish).

        Returns:
            str: Translated text.

        Raises:
            ValueError: If the language ID is not supported.
        """
        try:
            # Map language ID to language name
            if language_id == 1:
                language = "english"
            elif language_id == 2:
                language = "spanish"
            else:
                logger.error(f"Language ID '{language_id}' not supported. Supported languages are: english, spanish.")
                raise ValueError(f"Language ID '{language_id}' not supported.")

            logger.info(f"Traductor: Initiating translation for audio_id: {audio_id}")
            logger.debug(f"Traductor: Translating text: {text}")

            # Get the current event loop
            loop = asyncio.get_running_loop()

            # Run the translation in a separate thread
            translated_text = await loop.run_in_executor(
                None,
                lambda: self._translate(text, language)
            )

            logger.info(f"Traductor: Translation completed successfully for audio_id: {audio_id}")
            logger.debug(f"Traductor: Translation result: {translated_text}")
            return translated_text

        except Exception as e:
            logger.error(f"Error during translation for audio_id: {audio_id}: {str(e)}")
            raise

    def _translate(self, text: str, language: str) -> str:
        """
        Perform the actual translation using the selected model.

        Args:
            text (str): The text to translate.
            language (str): The target language ("english" or "spanish").

        Returns:
            str: Translated text.
        """
        model_info = self.models[language]
        inputs = model_info["tokenizer"](text, return_tensors="pt", padding=True)
        outputs = model_info["model"].generate(**inputs)
        translated_text = model_info["tokenizer"].decode(outputs[0], skip_special_tokens=True)
        return translated_text