from db.database import SessionLocal
from sqlalchemy.orm import Session
from utils.auth import AuthUtils
from api.service.userService import userService
from fastapi import Response, Request
class AuthService:
    """
    AuthService handles authentication-related operations such as user login.

    Attributes:
        auth_utils (AuthUtils): Utility class for authentication-related functions.
        db (SessionLocal): Database session for querying user data.
    """
    def __init__(self):        
        """
        Initializes AuthService with authentication utilities and a database session.
        """
        self.auth_utils = AuthUtils()
        self.db = SessionLocal()
        self.user_service = userService()

    def __del__(self):
        
        """
        Closes the database session when the AuthService object is destroyed.
        """
        self.db.close()

    def login(self,response: Response, username: str, password: str):
        """
        Authenticates a user by their username and password.

        Args:
            username (str): The user's username.
            password (str): The user's password.

        Returns:
            dict: A dictionary containing the access token if authentication is successful.
            str: An error message if authentication fails.
        """

        user = self.user_service.get_user_by_username_with_pass(username)
        if not user:
            raise Exception("User not found")

        verify_password = self.auth_utils.verify_password(password, user.password_hash)
        if  not verify_password:
            raise Exception("Invalid password")

        access_token = self.auth_utils.sign_token({"username": user.username, "id": user.id})
        if response: 
            self.auth_utils.set_auth_cookie(response, access_token)
            response.status_code = 200 
            return {"message": "Login exitoso"}
        else:
            return {"message": "Error con Login"}
        
    def get_current_user(self, request: Request):
        """
        Obtains the information of the authenticated user from the token in the cookie.
        """
        token = self.auth_utils.get_auth_cookie(request)
        if not token:
            return {"message": "No autenticado"}
        payload = self.auth_utils.decode_token(token)
        return {"id": payload.get("id"), "username": payload.get("username")}
