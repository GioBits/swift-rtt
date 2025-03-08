import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
class AuthUtils:
    def __init__(self):
        #SECRET and TOKEN
        self.SECRET_KEY = os.getenv("SECRET_KEY") or "secret"
        self.ALGORITHM= os.getenv("ALGORITHM") or "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 2)

        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def sign_token(self, payload: dict):

        expiration = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload.update({"exp": expiration})
        return jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def decode_token(self, token:str):
        try:
            return jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado", headers={"WWW-Authenticate": "Bearer"})
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido", headers={"WWW-Authenticate": "Bearer"})

    def validate_token(self, token:str = Depends(oauth2_scheme)):
        try:
            decoded_payload = self.decode_token(token)
            return decoded_payload
        except HTTPException as e:
            return e

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica si una contraseña coincide con su hash."""
        return self.pwd_context.verify(plain_password, hashed_password)