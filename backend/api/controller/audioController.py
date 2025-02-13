from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile, status
from api.service.audioService import create_audio, get_all_audios, get_audio_by_id, get_audios_by_user_id
from models.audio import AudioRecordSchema
from pybase64 import b64encode
from utils.transcribe import transcriber
from utils.translate import translate
from api.validators.audioValidations import validate_upload

async def create_audio_controller(user_id: int, language_id: int, file: UploadFile) -> AudioRecordSchema:
    """
    Controller function to handle the upload of an audio file.

    Args:
        user_id (str): The user ID.
        file (UploadFile): Audio file uploaded by the client.
        db (Session): Database session.

    Returns:
        AudioRecordSchema: Record of the audio stored in the database.
    """
    try:
        file_data = await validate_upload(file)

        # Call the service layer to create the audio
        audio_record = create_audio(
            user_id=user_id,
            filename=file.filename,
            audio_data=file_data,
            content_type=file.content_type,
            file_size=len(file_data),
            language_id=language_id
        )

        # Transcribe the audio
        transcription = await transcriber.transcription_handler(file_data)

        # Translate the transcribed text
        translated_text = translate.translate_text(transcription)

        # Encode binary data to base64
        base64_encoded = b64encode(audio_record.audio_data).decode('utf-8')

        return {
            "id": audio_record.id,
            "user_id": audio_record.user_id,
            "filename": audio_record.filename,
            "format": audio_record.content_type,
            "size": len(audio_record.audio_data),
            "transcription": transcription,
            "language": audio_record.language_id,
            "translated_text": translated_text,
            "file": base64_encoded
        }

    except HTTPException as e:
        print(f"HTTPException captured: {e.detail}")
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def retrieve_all_audios_controller():
    """
    Asynchronously retrieves all audios.

    This function attempts to retrieve all audios by calling the `get_all_audios` function.
    If no audios are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Returns:
        list: A list of audios if found.

    Raises:
        HTTPException: If no audios are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_all_audios()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No audios found"
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

async def retrieve_audio_by_id_controller(audio_id: int):
    """
    Asynchronously retrieves an audio by its ID.

    This function attempts to retrieve an audio by calling the `get_audio_by_id` function.
    If the audio is not found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        audio_id (int): The ID of the audio to be retrieved.

    Returns:
        The audio object if found.

    Raises:
        HTTPException: If the audio is not found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_audio_by_id(audio_id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audio not found"
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

async def retrieve_audios_by_user_id_controller(user_id: str):
    """
    Asynchronously retrieves all audios for a given user ID.

    This function attempts to retrieve all audios by calling the `get_audios_by_user_id` function.
    If no audios are found, it raises an HTTP 404 exception.
    If any other exception occurs, it raises an HTTP 500 exception.

    Args:
        user_id (str): The ID of the user.

    Returns:
        list: A list of audios if found.

    Raises:
        HTTPException: If no audios are found (404) or if an internal server error occurs (500).
    """
    try:
        result = get_audios_by_user_id(user_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No audios found for the given user ID"
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