import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
class AuthUtils:
    """
    Utility class for handling authentication-related tasks such as token generation, token validation, password hashing, and cookie management.
    """
    def __init__(self):
        """
        Initializes the AuthUtils class with secret key, algorithm, token expiration time, and password context.
        """
        self.SECRET_KEY = os.getenv("SECRET_KEY") or "secret"
        self.ALGORITHM= os.getenv("ALGORITHM") or "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 2)

        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def sign_token(self, payload: dict):
        """
        Signs a JWT token with the given payload and expiration time.
        Args:
            payload (dict): The payload to include in the token.
        Returns:
            str: The signed JWT token.
        """
        expiration = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload.update({"exp": expiration})
        return jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def decode_token(self, token: str):
        """
        Decodes a JWT token and returns the payload.
        Args:
            token (str): The JWT token to decode.
        Returns:
            dict: The decoded payload.
        Raises:
            HTTPException: If the token is expired or invalid.
        """
        try:
            return jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado", headers={"WWW-Authenticate": "Bearer"})
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido", headers={"WWW-Authenticate": "Bearer"})

    def validate_token(self, token: str = Depends(oauth2_scheme)):
        """
        Validates a JWT token and returns the decoded payload.
        Args:
            token (str): The JWT token to validate.
        Returns:
            dict: The decoded payload if the token is valid.
        Raises:
            HTTPException: If the token is expired or invalid.
        """
        try:
            decoded_payload = self.decode_token(token)
            return decoded_payload
        except HTTPException as e:
            return e

    def hash_password(self, password: str) -> str:
        """
        Hashes a plain text password.
        Args:
            password (str): The plain text password to hash.
        Returns:
            str: The hashed password.
        """
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifies if a plain text password matches its hashed version.
        Args:
            plain_password (str): The plain text password.
            hashed_password (str): The hashed password.
        Returns:
            bool: True if the passwords match, False otherwise.
        """
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def set_auth_cookie(self, response: Response, token: str):
        """
        Sets the authentication cookie in the response.
        Args:
            response (Response): The response object to set the cookie in.
            token (str): The JWT token to set as a cookie.
        """
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,   # No accesible desde JavaScript
            secure=True,     # Solo en HTTPS
            samesite="Strict" # Protección CSRF
        )

    def remove_auth_cookie(self, response: Response):
        """
        Removes the authentication cookie from the response.
        Args:
            response (Response): The response object to remove the cookie from.
        """
        response.delete_cookie("session_token")
