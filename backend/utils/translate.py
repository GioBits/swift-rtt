from transformers import MarianMTModel, MarianTokenizer
import asyncio
import warnings

warnings.filterwarnings("ignore", message="Recommended: pip install sacremoses.")

class Translate:
    def __init__(self):
        # Initialize with default models
        self.models = {
            "english": {"model": None, "tokenizer": None, "model_name": "Helsinki-NLP/opus-mt-es-en"},
            "spanish": {"model": None, "tokenizer": None, "model_name": "Helsinki-NLP/opus-mt-en-es"}
        }
    
    def load_model_and_tokenizer(self, language: str):
        """Load the model and tokenizer for the specified language."""
        
        model_info = self.models[language]
        if model_info["model"] is None or model_info["tokenizer"] is None:
            print(f"Loading model and tokenizer for language {language}...")
            model_info["tokenizer"] = MarianTokenizer.from_pretrained(model_info["model_name"])
            model_info["model"] = MarianMTModel.from_pretrained(model_info["model_name"])
            print(f"Model and tokenizer for language {language} loaded.")
    
    async def translate_text(self, text: str, language_id: int) -> str:
        """Translate text using the model corresponding to the language ID."""

        if language_id == 1:
            language = "english"
        elif language_id == 2:
            language = "spanish"
        else:  
            raise ValueError(f"Language'{language_id}' not supported.")
        
        # Load the model and tokenizer if not already loaded
        self.load_model_and_tokenizer(language)
        
        print(f"Translating text: {text}")
        
        loop = asyncio.get_running_loop()
        try:
            translated_text = await loop.run_in_executor(
                None,
                lambda: self._translate(text, language)
            )
            print(f"Translation result: {translated_text}")
            return translated_text
        except Exception as e:
            print(f"Error during translation: {str(e)}")
            raise
    
    def _translate(self, text: str, language: str) -> str:
        """Perform the actual translation using the selected model."""
        model_info = self.models[language]
        inputs = model_info["tokenizer"](text, return_tensors="pt", padding=True)
        outputs = model_info["model"].generate(**inputs)
        translated_text = model_info["tokenizer"].decode(outputs[0], skip_special_tokens=True)
        return translated_text

translate = Translate()