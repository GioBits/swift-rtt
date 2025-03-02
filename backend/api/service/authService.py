from db.database import SessionLocal
from sqlalchemy.orm import Session
from models.users import Users, UsersSchema
from utils.auth import AuthUtils
from api.service.userService import userService

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

    def login(self, email: str, password: str):
        """
        Authenticates a user by their email and password.

        Args:
            email (str): The user's email address.
            password (str): The user's password.

        Returns:
            dict: A dictionary containing the access token if authentication is successful.
            str: An error message if authentication fails.
        """

        user = self.user_service.get_user_by_email_with_pass(email)
        if not user:
            raise Exception("User not found")

        verify_password = self.auth_utils.verify_password(password, user.password_hash)
        if  not verify_password:
            raise Exception("Invalid password")

        access_token = self.auth_utils.sign_token({"email": user.email, "id": user.id})

        return {"access_token": access_token}