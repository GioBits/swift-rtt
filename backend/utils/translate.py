from transformers import MarianMTModel, MarianTokenizer

class Translate:
    def __init__(self, model_name: str = "Helsinki-NLP/opus-mt-en-es"):
        self.model_name = model_name
        self.model, self.tokenizer = self.load_model_and_tokenizer() 
    
    def load_model_and_tokenizer(self):
        print("Loading MarianMT model and tokenizer...")
        tokenizer = MarianTokenizer.from_pretrained(self.model_name)
        model = MarianMTModel.from_pretrained(self.model_name)
        print("Model and tokenizer loaded.")
        return model, tokenizer 
    
    def translate_text(self, text: str) -> str:
        print(f"Translating text: {text}")
        
        try:
            inputs = self.tokenizer(text, return_tensors="pt", padding=True)
            outputs = self.model.generate(**inputs)
            translated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            print(f"Translation result: {translated_text}")
            return translated_text
        except Exception as e:
            print(f"Error during translation: {str(e)}")
            raise

translate = Translate()