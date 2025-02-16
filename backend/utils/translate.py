from transformers import MarianMTModel, MarianTokenizer
import asyncio
import warnings

warnings.filterwarnings("ignore", message="Recommended: pip install sacremoses.")

class Translate:
    def __init__(self, model_name: str = "Helsinki-NLP/opus-mt-es-en"):
        self.model_name = model_name
        self.model, self.tokenizer = self.load_model_and_tokenizer() 
    
    def load_model_and_tokenizer(self):
        print("Loading MarianMT model and tokenizer...")
        tokenizer = MarianTokenizer.from_pretrained(self.model_name)
        model = MarianMTModel.from_pretrained(self.model_name)
        print("Model and tokenizer loaded.")
        return model, tokenizer 
    
    async def translate_text(self, text: str) -> str:
        print(f"Translating text: {text}")
        
        loop = asyncio.get_running_loop()
        try:
            translated_text = await loop.run_in_executor(
                None,
                lambda: self._translate(text)
            )
            print(f"Translation result: {translated_text}")
            return translated_text
        except Exception as e:
            print(f"Error during translation: {str(e)}")
            raise
    
    def _translate(self, text: str) -> str:
        inputs = self.tokenizer(text, return_tensors="pt", padding=True)
        outputs = self.model.generate(**inputs)
        translated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return translated_text

translate = Translate()