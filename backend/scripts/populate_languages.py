from api.service.languageService import LanguageService

def populate_languages():
    language_service = LanguageService()
    
    languages = [
        {"code": "en", "name": "English"},
        {"code": "es", "name": "Español"}
    ]

    existing_languages = language_service.get_all_languages()
    existing_codes = {lang.code for lang in existing_languages}

    for lang in languages:
        if lang["code"] not in existing_codes:
            new_language = language_service.create_language(lang["code"], lang["name"])
            if new_language:
                print(f"Added language: {lang['name']} ({lang['code']})")
            else:
                print(f"Failed to add language: {lang['name']} ({lang['code']})")
        else:
            print(f"Language already exists: {lang['name']} ({lang['code']})")

if __name__ == "__main__":
    populate_languages()