import unicodedata

def remove_accents_and_special_characters(text: str) -> str:
    '''
    Remove special characters from the text, except for periods, commas, semicolons, colons, and the letter ñ.
    Accented characters are preserved.

    Parameters:
    text (str): The text to clean.

    Returns:
    str: The cleaned text without special characters, except for the specified characters.
    '''
    # Normalize the text to decompose characters with accents
    normalized_text = unicodedata.normalize('NFC', text)
    
    # Filter out special characters, except for specified characters
    allowed_chars = set(".,;:ñÑ")
    cleaned_text = ''.join(
        char for char in normalized_text
        if char.isalnum() or char.isspace() or char in allowed_chars or unicodedata.category(char).startswith('M')
    )
    return cleaned_text