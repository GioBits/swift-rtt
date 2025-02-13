from api.service.languageService import create_language, get_all_languages

def populate_languages():
    languages = [
        {"code": "en", "name": "English"},
        {"code": "es", "name": "Español"}
    ]

    existing_languages = get_all_languages()
    existing_codes = {lang.code for lang in existing_languages}

    for lang in languages:
        if lang["code"] not in existing_codes:
            new_language = create_language(lang["code"], lang["name"])
            if new_language:
                print(f"Added language: {lang['name']} ({lang['code']})")
            else:
                print(f"Failed to add language: {lang['name']} ({lang['code']})")
        # else:
            # print(f"Language already exists: {lang['name']} ({lang['code']})")