from api.service.providerService import create_provider, get_all_providers

def populate_tts_providers():
    providers = [
        {"name": "TTS"}
    ]

    existing_providers = get_all_providers("tts_provider")
    existing_names = {provider.name for provider in existing_providers}

    for provider in providers:
        if provider["name"] not in existing_names:
            new_provider = create_provider("tts_provider", provider)
            if new_provider:
                print(f"Added provider: {provider['name']}")
            else:
                print(f"Failed to add provider: {provider['name']}")
        # else:
        #     print(f"Provider already exists: {provider['name']}")

if __name__ == "__main__":
    populate_tts_providers()