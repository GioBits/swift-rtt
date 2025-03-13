from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from api.service.authService import AuthService
from models.users import UsersSchema

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

    async def login(self, username: str, password: str, response: Response):  
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
            return self.auth_service.login(username, password, response)

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

    async def logout(self, response: Response):
        """
        Removes the user's session by deleting the authentication cookie.

        Args:
            response (Response): The HTTP response object where the authentication cookie will be deleted.

        Returns:
            dict: A dictionary with a message indicating that the session has been successfully closed.
        """
        """Elimina la sesión del usuario al borrar la cookie"""
        self.auth_service.auth_utils.remove_auth_cookie(response)
        return {"message": "Sesión cerrada correctamente"}