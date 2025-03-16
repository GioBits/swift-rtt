from transformers import MarianMTModel, MarianTokenizer
import asyncio
import warnings
import os
import logging

# Configure logging and warnings
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("Translate")
warnings.filterwarnings("ignore", message="Recommended: pip install sacremoses.")

class Translate:
    def __init__(self):
        """
        Initializes the Translate class with the models and tokenizers for each language/direction.
        """
        self.models = {
            "english": {
                "forward": None,
                "reverse": None
            },
            "spanish": {
                "forward": {
                    "model_name": "Helsinki-NLP/opus-mt-en-es",
                    "model": None,
                    "tokenizer": None
                },
                "reverse": {
                    "model_name": "Helsinki-NLP/opus-mt-es-en",
                    "model": None,
                    "tokenizer": None
                }
            },
            "italian": {
                "forward": {
                    "model_name": "Helsinki-NLP/opus-mt-en-it",
                    "model": None,
                    "tokenizer": None
                },
                "reverse": {
                    "model_name": "Helsinki-NLP/opus-mt-it-en",
                    "model": None,
                    "tokenizer": None
                }
            },
            "Chinese": {
                "forward": {
                    "model_name": "Helsinki-NLP/opus-mt-en-zh",
                    "model": None,
                    "tokenizer": None
                },
                "reverse": {
                    "model_name": "Helsinki-NLP/opus-mt-zh-en",
                    "model": None,
                    "tokenizer": None
                }
            }
        }

        # Load models for each language/direction
        for lang in ["spanish", "italian", "Chinese"]:
            self.load_model_and_tokenizer(lang, "forward")
            self.load_model_and_tokenizer(lang, "reverse")

    def load_model_and_tokenizer(self, language: str, direction: str = None):
        """
        Loads the model and tokenizer for the specified language.
        If 'direction' is provided (e.g., "forward" or "reverse"), that variant is loaded.
        """
        
        model_info = self.models[language][direction] if direction else self.models[language]
        model_path = f"../static/text2text/{model_info['model_name'].replace('/', '-')}"
        
        if not os.path.exists(model_path):
            logger.info(f"Translator: Creating directory for the {language} model at {model_path}")
            os.makedirs(model_path)

        if model_info["model"] is None or model_info["tokenizer"] is None:
            logger.info(f"Translator: Loading model and tokenizer for {language} ({direction if direction else ''})...")
            model_info["tokenizer"] = MarianTokenizer.from_pretrained(model_info["model_name"], cache_dir=model_path)
            model_info["model"] = MarianMTModel.from_pretrained(model_info["model_name"], cache_dir=model_path)
            logger.info(f"Translator: Model and tokenizer for {language} ({direction if direction else ''}) loaded.")

    async def translate_text(self, text: str, audio_id: int, source_lang_id: int, target_lang_id: int) -> str:
        """
        Translates the text from the source language to the target language asynchronously.
        Language IDs are mapped as follows:
            1: english
            2: spanish
            3: italian
            4: Chinese
        """
        language_mapping = {
            1: "english",
            2: "spanish",
            3: "italian",
            4: "Chinese"
        }

        source_language = language_mapping.get(source_lang_id)
        target_language = language_mapping.get(target_lang_id)

        if source_language is None or target_language is None:
            logger.error("Unsupported language ID.")
            raise ValueError("Unsupported language ID.")

        logger.info(f"Translator: Starting translation for audio_id: {audio_id}")
        loop = asyncio.get_running_loop()
        translated_text = await loop.run_in_executor(
            None,
            lambda: self._translate(text, source_language, target_language)
        )
        logger.info(f"Translator: Translation completed for audio_id: {audio_id}")
        return translated_text

    def _translate(self, text: str, source_language: str, target_language: str) -> str:
        """
        Performs the translation of the text between the source and target languages.
        If neither language is English, English is used as an intermediate pivot.
        """
        # if source_language == target_language return text
        if source_language == target_language:
            return text
        
        # if at least one of the languages is English, use the corresponding model
        if source_language == "english":
            model_info = self.models[target_language]["forward"]
        elif target_language == "english":
            model_info = self.models[source_language]["reverse"]
        else:
            # If neither language is English, translate first to English, then to the target language
            intermediate_text = self._translate(text, source_language, "english")
            return self._translate(intermediate_text, "english", target_language)

        inputs = model_info["tokenizer"](text, return_tensors="pt", padding=True)
        outputs = model_info["model"].generate(**inputs)
        translated_text = model_info["tokenizer"].decode(outputs[0], skip_special_tokens=True)
        return translated_text
