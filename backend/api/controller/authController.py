from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.service.authService import AuthService
from models.users import UsersSchema
from api.DTO.auth.loginRequestDTO import loginDTO
import base64, json

router = APIRouter()

class AuthController:
    """
    Authentication controller that handles login requests.
    Methods:
        __init__(): Initializes the AuthController with an instance of AuthService.
        login(username: str, password: str): Handles user login logic.
    """
    def __init__(self):
        """
        Initializes a new instance of AuthController.
        """
        self.auth_service = AuthService()

    async def login(self, payload : str):
        """
        Handles a user's login request.
        Args:
            username (str): The user's username.
            password (str): The user's password.
        Returns:
            dict: A dictionary with the user's authentication details if login is successful.
        Raises:
            HTTPException: If an HTTP error occurs during login.
            HTTPException: If an internal server error occurs.
        """  
        try:

            payloadBytes = payload.encode("ascii")

            bytesToDecode = base64.b64decode(payloadBytes)
            decodedPayload = bytesToDecode.decode("ascii")

            data_dict = json.loads(decodedPayload)
            login_DTO = loginDTO(username= data_dict["username"], password= data_dict["password"])

            return self.auth_service.login(login_DTO.username, login_DTO.password)

        except Exception as e:  # Capture general exceptions

            print(f"Error: {str(e)}")

            if str(e) == "User not found":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="invalid username or password"
                )

            if str(e) == "Invalid password":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="invalid username or password"
                )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )