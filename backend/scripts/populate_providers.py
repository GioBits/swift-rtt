from api.service.providerService import create_provider, get_all_providers
from models.providers import ProviderType

def populate_providers():
    providers = [
        {"name": "Whisper", "type": ProviderType.TRANSCRIPTION},
        {"name": "Google Translate", "type": ProviderType.TRANSLATION},
        {"name": "Google TTS", "type": ProviderType.TTS}
    ]

    existing_providers = get_all_providers()
    existing_names = {provider.name for provider in existing_providers}

    for provider in providers:
        if provider["name"] not in existing_names:
            new_provider = create_provider(provider)
            if new_provider:
                print(f"Added provider: {provider['name']}")
            else:
                print(f"Failed to add provider: {provider['name']}")
        # else:
        #     print(f"Provider already exists: {provider['name']}")

if __name__ == "__main__":
    populate_providers()