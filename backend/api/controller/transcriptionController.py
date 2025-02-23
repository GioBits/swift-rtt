from fastapi import HTTPException, status
from api.service.transcriptionService import TranscriptionService
from api.service.audioService import AudioService
from utils.transcribe import transcriber

class TranscriptionController:
    def __init__(self):
        self.transcription_service = TranscriptionService()
        self.audio_service = AudioService()

    async def retrieve_all_transcriptions(self):
        """
        Asynchronously retrieves all transcriptions.

        This function attempts to retrieve all transcriptions by calling the `get_all_transcriptions` function.
        If no transcriptions are found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Returns:
            list: A list of transcriptions if found.

        Raises:
            HTTPException: If no transcriptions are found (404) or if an internal server error occurs (500).
        """
        try:
            result = self.transcription_service.get_all_transcriptions()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No transcriptions found"
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

    async def create_transcription(self, audio_id: int, provider_id: int):
        """
        Asynchronously creates a new transcription.

        This function attempts to create a new transcription using the provided audio_id, provider_id, language_id, and transcription_text.
        If any error occurs during the process, it raises an HTTP 500 error.

        Args:
            audio_id (int): The ID of the audio.
            provider_id (int): The ID of the transcription provider.

        Returns:
            The newly created transcription object if successful.

        Raises:
            HTTPException: If an internal server error occurs (HTTP 500).
        """
        try:
            # Retrieve audio information
            audio_info = self.audio_service.get_audio_by_id(audio_id)
            if audio_info is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Audio not found"
                )
            
            language_id = audio_info.language_id
            file_data = audio_info.audio_data

            # Transcribe the audio
            transcription = await transcriber.transcription_handler(file_data, audio_id, language_id)

            new_transcription = self.transcription_service.create_transcription(audio_id, provider_id, language_id, transcription)

            if new_transcription is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Transcription could not be created"
                )
            return new_transcription
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def retrieve_transcription_by_id(self, transcription_id: int):
        """
        Asynchronously retrieves a transcription by its ID.

        This function attempts to retrieve a transcription by calling the `get_transcription_by_id` function.
        If the transcription is not found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Args:
            transcription_id (int): The ID of the transcription to be retrieved.

        Returns:
            The transcription object if found.

        Raises:
            HTTPException: If the transcription is not found (404) or if an internal server error occurs (500).
        """
        try:
            transcription = self.transcription_service.get_transcription_by_id(transcription_id)
            if transcription is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Transcription not found"
                )
            return transcription
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def retrieve_transcriptions_by_audio_id(self, audio_id: int):
        """
        Asynchronously retrieves all transcriptions for a given audio ID.

        This function attempts to retrieve all transcriptions by calling the `get_transcriptions_by_audio_id` function.
        If no transcriptions are found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Args:
            audio_id (int): The ID of the audio.

        Returns:
            list: A list of transcriptions if found.

        Raises:
            HTTPException: If no transcriptions are found (404) or if an internal server error occurs (500).
        """
        try:
            result = self.transcription_service.get_transcriptions_by_audio_id(audio_id)
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No transcriptions found for the given audio ID"
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