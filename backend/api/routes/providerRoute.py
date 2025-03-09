from fastapi import APIRouter, Depends
from api.controller.providerController import ProviderController
from models.providers import ProviderSchema
from typing import List, Dict, Any
from api.DTO.provider.providerDTO import add_providerDTO

router = APIRouter()
provider_controller = ProviderController()

@router.get("/providers", response_model=List[ProviderSchema], tags=["Providers"])
async def get_providers():
    """
    Retrieves all providers.
    Returns:
        list: A list of ProviderSchema objects.
    """
    return await provider_controller.retrieve_all_providers()

@router.post("/providers", response_model=ProviderSchema, tags=["Providers"])
async def add_provider(add_provider_DTO : add_providerDTO = Depends()):
    """
    Adds a new provider.
    Args:
        data (dict): A dictionary containing the provider data.
    Returns:
        ProviderSchema: The newly created provider object.
    """
    return await provider_controller.create_provider(add_provider_DTO)