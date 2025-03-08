from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from api.controller.authController import AuthController
from pydantic import BaseModel

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Auth"])
async def login(username: str = None, password: str= None, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint to handle user login.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.

    Returns:
        JSON response containing authentication details.
    """
    if username and password:
        return await auth_controller.login(username, password)
    
    if form_data.username and form_data.password:
        return await auth_controller.login(form_data.username, form_data.password)
    
