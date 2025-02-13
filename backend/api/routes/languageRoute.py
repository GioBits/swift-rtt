from fastapi import APIRouter
from api.controller.languageController import retrieve_all_languages_controller, create_language_controller

"""
This module defines the routes for language-related operations in the API.
Routes:
    - GET /languages: Retrieve a list of all languages.
    - POST /languages: Add a new language.
Functions:
    - get_languages: Asynchronously retrieves all languages using the retrieve_all_languages_controller.
    - add_language: Asynchronously adds a new language using the create_language_controller.
"""

router = APIRouter()

@router.get("/languages", response_model=list, tags=["Languages"])
async def get_languages():
    return await retrieve_all_languages_controller()

@router.post("/languages", response_model=dict, tags=["Languages"])
async def add_language(code: str, name: str):
    return await create_language_controller(code, name)