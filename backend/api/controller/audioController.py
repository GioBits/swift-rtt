from fastapi import HTTPException, UploadFile, status
from api.service.audioService import AudioService
from models.audio import AudioRecordSchema, AudioResponseSchema, AudioResponseWithAudioSchema, AudioListResponseSchema
from pybase64 import b64encode
from api.validators.audioValidations import validate_upload
from api.DTO.audio.audioRequestDTO import create_audioDTO, process_mediaDTO, retrieve_audios_listDTO
from ws.brokerDispatcher import add_audio_task

class AudioController:
    def __init__(self):
        self.audio_service = AudioService()

    def parse_audio_response(self, audio_record: AudioRecordSchema, with_audio: bool) -> AudioResponseSchema:
        """
        Parse an audio record to an audio response schema.

        Args:
            audio_record (AudioRecordSchema): The audio record to be parsed.
            with_audio (bool): Flag to include audio data in the response.

        Returns:
            AudioResponseSchema: The parsed audio response schema.
        """
        base_response = {
            "id": audio_record.id,
            "user_id": audio_record.user_id,
            "filename": audio_record.filename,
            "content_type": audio_record.content_type,
            "file_size": audio_record.file_size,
            "language_id": audio_record.language_id,
            "created_at": audio_record.created_at
        }

        if with_audio:
            base_response["audio_data"] = b64encode(audio_record.audio_data).decode('utf-8')
            return AudioResponseWithAudioSchema(**base_response)
        else:
            return AudioResponseSchema(**base_response)

    async def create_audio(self, create_audio_DTO: create_audioDTO) -> AudioResponseSchema:
        """
        Controller function to handle the upload of an audio file.

        Args:
            user_id (str): The user ID.
            file (UploadFile): Audio file uploaded by the client.

        Returns:
            AudioRecordSchema: Record of the audio stored in the database.
        """
        try:
            # Validate the upload - now returns a tuple (file_data, is_valid, error_message)
            file_data, is_valid, error_message = await validate_upload(create_audio_DTO.file)

            # Call the service layer to create the audio, with is_audio_valid set according to validation
            audio_record = self.audio_service.create_audio(
                user_id=create_audio_DTO.user_id,
                filename=create_audio_DTO.file.filename,
                audio_data=file_data,
                content_type=create_audio_DTO.file.content_type,
                file_size=len(file_data),
                language_id=create_audio_DTO.language_id_from,
                is_audio_valid=is_valid,
                validation_error=error_message
            )

            return self.parse_audio_response(audio_record, True)

        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def process_media(self, process_media_DTO : process_mediaDTO):
        """
        Controller function to handle the processing of an media file.

        Args:
            audio_record_id (int): The ID of the audio record.
            language_id_from (int): The source language ID.
            language_id_to (int): The target language ID.

        Returns:
            dict: A dictionary containing the processing task configuration.
        """
        try:
            # Add the audio processing task to the queue
            config = {
                "record_id": process_media_DTO.audio_id,
                "user_id": process_media_DTO.user_id,
                "providers": {
                    "transcription": 1,
                    "translation": 2,
                    "audio_generation": 3
                },
                "languages": {
                    "from": process_media_DTO.language_id_from,
                    "to": process_media_DTO.language_id_to
                }
            }

            await add_audio_task(config, "transcribe")

            return {"message": "Audio processing task added to the queue", "config": config}

        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def retrieve_all_audios(self, retrieve_audios_list_DTO : retrieve_audios_listDTO):
        """
        Asynchronously retrieves all audios with pagination.

        This function attempts to retrieve all audios by calling the `get_all_audios` function.
        If no audios are found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Args:
            page (int): The page number for pagination.
            size (int): The number of items per page.

        Returns:
            dict: A dictionary containing the list of audios and pagination details.

        Raises:
            HTTPException: If no audios are found (404) or if an internal server error occurs (500).
        """
        try:
            audios, total_items, total_pages = self.audio_service.get_all_audios(retrieve_audios_list_DTO.page, retrieve_audios_list_DTO.size)

            response = {
                "data": audios,
                "pagination": {
                    "page": retrieve_audios_list_DTO.page,
                    "size": retrieve_audios_list_DTO.size,
                    "total_items": total_items,
                    "total_pages": total_pages
                }
            }

            # Convert the response to the schema
            return AudioListResponseSchema(**response)
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def retrieve_audio_by_id(self, audio_id: int):
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
            result = self.audio_service.get_audio_by_id(audio_id)
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Audio not found"
                )
            return self.parse_audio_response(result, True)
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def retrieve_audios_by_user_id(self, user_id: int):
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
            result = self.audio_service.get_audios_by_user_id(user_id)
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No audios found for the given user ID"
                )
            return [self.parse_audio_response(audio, False) for audio in result]
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )