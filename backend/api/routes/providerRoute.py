from fastapi import Depends, APIRouter
from api.controller.providerController import ProviderController
from models.providers import ProviderSchema
from typing import List, Dict, Any
from utils.auth import AuthUtils
router = APIRouter()
provider_controller = ProviderController()
auth = AuthUtils()

@router.get("/providers", response_model=List[ProviderSchema], dependencies=[Depends(auth.validate_token)], tags=["Providers"])
async def get_providers():
    """
    Retrieves all providers.
    Returns:
        list: A list of ProviderSchema objects.
    """
    return await provider_controller.retrieve_all_providers()

@router.post("/providers", response_model=ProviderSchema, dependencies=[Depends(auth.validate_token)], tags=["Providers"])
async def add_provider(data: Dict[str, Any]):
    """
    Adds a new provider.
    Args:
        data (dict): A dictionary containing the provider data.
    Returns:
        ProviderSchema: The newly created provider object.
    """
    return await provider_controller.create_provider(data)