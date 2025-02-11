from api.service.transcriptionProviderService import create_provider, get_all_providers

def populate_transcription_providers():
    providers = [
        {"name": "Whisper"}
    ]

    existing_providers = get_all_providers()
    existing_names = {provider.name for provider in existing_providers}

    for provider in providers:
        if provider["name"] not in existing_names:
            new_provider = create_provider(provider["name"])
            if new_provider:
                print(f"Added provider: {provider['name']}")
            else:
                print(f"Failed to add provider: {provider['name']}")
        # else:
            # print(f"Provider already exists: {provider['name']}")