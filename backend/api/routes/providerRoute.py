from fastapi import APIRouter, HTTPException
from api.controller.providerController import (
    retrieve_all_providers_controller,
    create_provider_controller
)
from models.providers import ProviderSchema
from typing import List, Dict, Any

router = APIRouter()

@router.get("/providers", response_model=List[ProviderSchema], tags=["Providers"])
async def get_providers():
    """
    Retrieves all providers.
    Returns:
        list: A list of ProviderSchema objects.
    """
    return await retrieve_all_providers_controller()

@router.post("/providers", response_model=ProviderSchema, tags=["Providers"])
async def add_provider(data: Dict[str, Any]):
    """
    Adds a new provider.
    Args:
        data (dict): A dictionary containing the provider data.
    Returns:
        ProviderSchema: The newly created provider object.
    """
    return await create_provider_controller(data)