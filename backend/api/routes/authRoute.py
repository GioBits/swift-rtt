from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from controller.authController import AuthController

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Audio"])
async def login(email:str, password:str):
    return await auth_controller.login(email, password)

