from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.auth import sign_token, verify_password, get_current_user
from models.users import UsersSchema

router = APIRouter()

class AuthController:
    def __init__(self):
        pass

    async def login(self, email:str, password:str):    
        if not user or not verify_password(user_credentials.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

        access_token = sign_token({"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}