from fastapi import HTTPException, status
from api.service.translatedAudioService import (
    get_all_translated_audios,
    create_translated_audio,
    get_translated_audio_by_id,
    get_translated_audios_by_audio_id
)
from pybase64 import b64encode
from api.service.translationService import get_translation_by_id
from api.service.audioService import get_audio_by_id
from models.translated_audios import TranslatedAudioRecordSchema, TranslatedAudioResponseSchema
from utils.text_to_speech import text2speech

def parse_audio_response(audio_record: TranslatedAudioRecordSchema) -> TranslatedAudioResponseSchema:
    """
    Parse an audio record to an audio response schema.

    Args:
        audio_record (TranslatedAudioRecordSchema): The audio record to be parsed.

    Returns:
        TranslatedAudioResponseSchema: The parsed audio response schema.
    """
    base_response = {
        "id": audio_record.id,
        "audio_id": audio_record.audio_id,
        "translation_id": audio_record.translation_id,
        "provider_id": audio_record.provider_id,
        "language_id": audio_record.language_id,
        "file_size": audio_record.file_size,
        "created_at": audio_record.created_at,
        "audio_data": b64encode(audio_record.audio_data).decode('utf-8')
    }

    return TranslatedAudioResponseSchema(**base_response)

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
        return [parse_audio_response(audio) for audio in result]
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

async def create_translated_audio_controller(translation_id: int, provider_id: int):
    """
    Asynchronously creates a new translated audio.

    This function attempts to create a new translated audio using the provided audio_id, translation_id, provider_id, language_id, audio_data, file_size, and transcription.
    If any error occurs during the process, it raises an HTTP 500 error.

    Args:
        translation_id (int): The ID of the translation.
        provider_id (int): The ID of the TTS provider.

    Returns:
        The newly created translated audio object if successful.

    Raises:
        HTTPException: If an internal server error occurs (HTTP 500).
    """
    try:
        # Retrieve the translation record using the translation_id
        translation_record = get_translation_by_id(translation_id)
        if translation_record is None:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation not found"
            )
        language_id = translation_record.language_id
        audio_id = translation_record.audio_id

        # Retrieve the audio record using the audio_id
        audio_record = get_audio_by_id(audio_id)
        if audio_record is None:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio not found"
            )
        
        audio_data = text2speech.t2s(translation_record.translation_text, translation_record.language_id)# get the generated audio data generate_tts(tranlation_record.trasnlation_text, provider_id)

        new_translated_audio = create_translated_audio(audio_id, translation_id, provider_id, language_id, audio_data, len(audio_data))
        if new_translated_audio is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Translated audio could not be created"
            )
        return parse_audio_response(new_translated_audio)
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
        return parse_audio_response(translated_audio)
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
        return [parse_audio_response(audio) for audio in result]
    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:  # Capture general exceptions
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )