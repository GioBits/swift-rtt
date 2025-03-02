from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from service.authService import AuthService
from models.users import UsersSchema

router = APIRouter()

class AuthController:
    def __init__(self):
        self.auth_service= AuthService()

    async def login(self, email:str, password:str):    
        
        try:
            return await self.auth_service.login(email, password)
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )