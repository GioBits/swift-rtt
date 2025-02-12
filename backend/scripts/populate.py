from scripts.populate_languages import populate_languages
from scripts.populate_transcription_providers import populate_transcription_providers
from scripts.populate_translation_providers import populate_translation_providers
from scripts.populate_tts_providers import populate_tts_providers

def populate():
    print("Populating languages...")
    populate_languages()
    print("Languages populated successfully.")
    
    print("Populating transcription providers...")
    populate_transcription_providers()
    print("Transcription providers populated successfully.")

    print("Populating translation providers...")
    populate_translation_providers()
    print("Translation providers populated successfully.")

    print("Populating TTS providers...")
    populate_tts_providers()
    print("TTS providers populated successfully.")

if __name__ == "__main__":
    main()