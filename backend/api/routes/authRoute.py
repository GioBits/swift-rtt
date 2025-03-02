from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.controller.authController import AuthController

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Auth"])
async def login(email:str, password:str):
    """
    Endpoint to handle user login.

    Args:
        email (str): The email address of the user.
        password (str): The password of the user.

    Returns:
        JSON response containing authentication details.

    Tags:
        - Audio
    """
    return await auth_controller.login(email, password)

