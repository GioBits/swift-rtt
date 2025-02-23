from api.service.providerService import ProviderService
from models.providers import ProviderType

def populate_providers():
    provider_service = ProviderService()
    
    providers = [
        {"name": "Whisper", "type": "TRANSCRIPTION"},
        {"name": "Helsinki", "type": "TRANSLATION"},
        {"name": "Coqui TTS", "type": "TTS"}
    ]

    existing_providers = provider_service.get_all_providers()
    existing_names = {provider.name for provider in existing_providers}

    for provider in providers:
        if provider["name"] not in existing_names:
            new_provider = provider_service.create_provider(provider)
            if new_provider:
                print(f"Added provider: {provider['name']}")
            else:
                print(f"Failed to add provider: {provider['name']}")
        else:
            print(f"Provider already exists: {provider['name']}")

if __name__ == "__main__":
    populate_providers()