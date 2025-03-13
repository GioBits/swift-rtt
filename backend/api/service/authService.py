from db.database import SessionLocal
from sqlalchemy.orm import Session
from utils.auth import AuthUtils
from api.service.userService import userService
from fastapi import Response

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

    def login(self, username: str, password: str, response: Response):
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
        self.auth_utils.set_auth_cookie(response, access_token)

        return {"access_token": access_token, "token_type": "bearer"}