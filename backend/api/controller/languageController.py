from fastapi import HTTPException, status
from api.service.languageService import LanguageService
from api.DTO.language.languageDTO import add_languageDTO

class LanguageController:
    def __init__(self):
        self.language_service = LanguageService()

    async def retrieve_all_languages(self):
        """
        Asynchronously retrieves all languages.

        This function attempts to retrieve all languages by calling the `get_all_languages` function.
        If no languages are found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Returns:
            list: A list of languages if found.

        Raises:
            HTTPException: If no languages are found (404) or if an internal server error occurs (500).
        """
        try:
            result = self.language_service.get_all_languages()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No languages found"
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

    async def create_language(self, add_language_DTO : add_languageDTO):
        """
        Asynchronously creates a new language.

        This function attempts to create a new language using the provided code and name.
        If the language already exists, it raises an HTTP 400 error. If any other error
        occurs during the process, it raises an HTTP 500 error.

        Args:
            code (str): The code of the language to be created.
            name (str): The name of the language to be created.

        Returns:
            The newly created language object if successful.

        Raises:
            HTTPException: If the language already exists (HTTP 400) or if an internal
            server error occurs (HTTP 500).
        """
        try:
            new_language = self.language_service.create_language(add_language_DTO.code, add_language_DTO.name)
            if new_language is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Language already exists"
                )
            return new_language
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )