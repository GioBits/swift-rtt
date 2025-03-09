from fastapi import HTTPException, status
from api.service.providerService import ProviderService
from typing import List, Dict, Any
from api.DTO.provider.providerDTO import add_providerDTO

class ProviderController:
    def __init__(self):
        self.provider_service = ProviderService()

    async def retrieve_all_providers(self):
        """
        Asynchronously retrieves all providers.

        This function attempts to retrieve all providers by calling the `get_all_providers` function.
        If no providers are found, it raises an HTTP 404 exception.
        If any other exception occurs, it raises an HTTP 500 exception.

        Returns:
            list: A list of providers if found.

        Raises:
            HTTPException: If no providers are found (404) or if an internal server error occurs (500).
        """
        try:
            result = self.provider_service.get_all_providers()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No providers found"
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

    async def create_provider(self, add_provider_DTO : add_providerDTO):
        """
        Asynchronously creates a new provider.

        This function attempts to create a new provider using the provided data.
        If any error occurs during the process, it raises an HTTP 500 error.

        Args:
            data (dict): A dictionary containing the provider data.

        Returns:
            The newly created provider object if successful.

        Raises:
            HTTPException: If an internal server error occurs (HTTP 500).
        """
        try:
            new_provider = self.provider_service.create_provider(add_provider_DTO.data)
            if new_provider is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Provider could not be created or already exists"
                )
            return new_provider
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )