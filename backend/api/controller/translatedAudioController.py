from fastapi import HTTPException, status
from api.service.translatedAudioService import (
    get_all_translated_audios,
    create_translated_audio,
    get_translated_audio_by_id,
    get_translated_audios_by_audio_id
)

async def retrieve_all_translated_audios_controller():
    """
    Asynchronously retrieves all translated audios.

    This function attempts to retrieve all translated audios by calling the `get_all_translated_audios` function.
    If no translated audios are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Returns:
        list: A list of translated audios if found.

    Raises:
        HTTPException: If no translated audios are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_all_translated_audios()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No translated audios found"
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

async def create_translated_audio_controller(audio_id: int, translation_id: int, provider_id: int, language_id: int, audio_data: bytes, file_size: int, transcription: str):
    """
    Asynchronously creates a new translated audio.

    This function attempts to create a new translated audio using the provided audio_id, translation_id, provider_id, language_id, audio_data, file_size, and transcription.
    If any error occurs during the process, it raises an HTTP 500 error.

    Args:
        audio_id (int): The ID of the audio.
        translation_id (int): The ID of the translation.
        provider_id (int): The ID of the TTS provider.
        language_id (int): The ID of the language.
        audio_data (bytes): The audio data.
        file_size (int): The file size in bytes.
        transcription (str): The transcription text.

    Returns:
        The newly created translated audio object if successful.

    Raises:
        HTTPException: If an internal server error occurs (HTTP 500).
    """
    try:
        new_translated_audio = create_translated_audio(audio_id, translation_id, provider_id, language_id, audio_data, file_size, transcription)
        if new_translated_audio is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Translated audio could not be created"
            )
        return new_translated_audio
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def retrieve_translated_audio_by_id_controller(translated_audio_id: int):
    """
    Asynchronously retrieves a translated audio by its ID.

    This function attempts to retrieve a translated audio by calling the `get_translated_audio_by_id` function.
    If the translated audio is not found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        translated_audio_id (int): The ID of the translated audio to be retrieved.

    Returns:
        The translated audio object if found.

    Raises:
        HTTPException: If the translated audio is not found (404) or if an internal server error occurs (500).
    """
    try:
        translated_audio = get_translated_audio_by_id(translated_audio_id)
        if translated_audio is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Translated audio not found"
            )
        return translated_audio
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def retrieve_translated_audios_by_audio_id_controller(audio_id: int):
    """
    Asynchronously retrieves all translated audios for a given audio ID.

    This function attempts to retrieve all translated audios by calling the `get_translated_audios_by_audio_id` function.
    If no translated audios are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        audio_id (int): The ID of the audio.

    Returns:
        list: A list of translated audios if found.

    Raises:
        HTTPException: If no translated audios are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_translated_audios_by_audio_id(audio_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No translated audios found for the given audio ID"
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