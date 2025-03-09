from fastapi import APIRouter
from api.controller.languageController import LanguageController
from models.languages import LanguageSchema
from api.DTO.language.languageDTO import add_languageDTO

"""
This module defines the routes for language-related operations in the API.
Routes:
    - GET /languages: Retrieve a list of all languages.
    - POST /languages: Add a new language.
Functions:
    - get_languages: Asynchronously retrieves all languages using the LanguageController.
    - add_language: Asynchronously adds a new language using the LanguageController.
"""

router = APIRouter()
language_controller = LanguageController()

@router.get("/languages", response_model=list, tags=["Languages"])
async def get_languages():
    return await language_controller.retrieve_all_languages()

@router.post("/languages", response_model=LanguageSchema, tags=["Languages"])
async def add_language(add_language_DTO : add_languageDTO):
    return await language_controller.create_language(add_language_DTO)