from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.controller.authController import AuthController

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Auth"])
async def login(username: str, password: str):
    """
    Endpoint to handle user login.

    Args:
        username (str): The username of the user.
        password (str): The password of the user.

    Returns:
        JSON response containing authentication details.
    """
    return await auth_controller.login(username, password)

