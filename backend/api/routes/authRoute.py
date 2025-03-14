from fastapi import APIRouter, Depends, HTTPException, status, Body, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from api.controller.authController import AuthController
from pydantic import BaseModel

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Auth"])
async def login(response: Response,
                username: str, 
                password: str):
    """
    Endpoint to handle user login.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.

    Returns:
        JSON response containing authentication details.
    """
    return await auth_controller.login(response, username, password, )
    
@router.post("/auth/token", tags=["Auth"])
async def token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint to handle user login.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.

    Returns:
        JSON response containing authentication details.
    """
    if form_data.username and form_data.password:
        return await auth_controller.login_token(form_data.username, form_data.password)
    
@router.get("/auth/me", tags=["Auth"])
async def get_current_user(response:Response):
    """
    Obtiene la información del usuario autenticado a partir del token en la cookie.
    """
    return await auth_controller.get_current_user(response)

@router.post("/auth/logout", tags=["Auth"])
async def logout(response: Response):
    """
    Logs out the user by deleting the cookie.

    Args:
        response (Response): The response object to modify.

    Returns:
        Response: The response after logging out the user.
    """
    return await auth_controller.logout(response)