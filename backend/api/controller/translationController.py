from fastapi import HTTPException, status
from api.service.translationService import (
    get_all_translations,
    create_translation,
    get_translation_by_id,
    get_translations_by_audio_id
)

from api.service.transcriptionService import TranscriptionService
from utils.translate import translate

transcription_service = TranscriptionService()

async def retrieve_all_translations_controller():
    """
    Asynchronously retrieves all translations.

    This function attempts to retrieve all translations by calling the `get_all_translations` function.
    If no translations are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Returns:
        list: A list of translations if found.

    Raises:
        HTTPException: If no translations are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_all_translations()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No translations found"
            )
        return result
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def create_translation_controller(transcription_id: int, provider_id: int, language_id: int):
    """
    Asynchronously creates a new translation.

    This function attempts to create a new translation using the provided audio_id, transcription_id, provider_id, language_id, and translation_text.
    If any error occurs during the process, it raises an HTTP 500 error.

    Args:
        transcription_id (int): The ID of the transcription.
        provider_id (int): The ID of the translation provider.
        language_id (int): The ID of the language.

    Returns:
        The newly created translation object if successful.

    Raises:
        HTTPException: If an internal server error occurs (HTTP 500).
    """
    try:
        # Retrieve the transcription by ID
        transcription = transcription_service.get_transcription_by_id(transcription_id)
        if transcription is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transcription not found"
            )
        
        # Set the audio_id from the transcription record
        audio_id = transcription.audio_id
        
        # Translate the transcribed text
        translated_text = await translate.translate_text(transcription.transcription_text)
        
        # Create the new translation
        new_translation = create_translation(audio_id, transcription_id, provider_id, language_id, translated_text)
        if new_translation is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Translation could not be created"
            )
        return new_translation
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def retrieve_translation_by_id_controller(translation_id: int):
    """
    Asynchronously retrieves a translation by its ID.

    This function attempts to retrieve a translation by calling the `get_translation_by_id` function.
    If the translation is not found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        translation_id (int): The ID of the translation to be retrieved.

    Returns:
        The translation object if found.

    Raises:
        HTTPException: If the translation is not found (404) or if an internal server error occurs (500).
    """
    try:
        translation = get_translation_by_id(translation_id)
        if translation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Translation not found"
            )
        return translation
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def retrieve_translations_by_audio_id_controller(audio_id: int):
    """
    Asynchronously retrieves all translations for a given audio ID.

    This function attempts to retrieve all translations by calling the `get_translations_by_audio_id` function.
    If no translations are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        audio_id (int): The ID of the audio.

    Returns:
        list: A list of translations if found.

    Raises:
        HTTPException: If no translations are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_translations_by_audio_id(audio_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No translations found for the given audio ID"
            )
        return result
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )