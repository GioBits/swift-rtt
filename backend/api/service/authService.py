from db.database import SessionLocal
from sqlalchemy.orm import Session
from models.users import Users, UsersSchema
from utils.auth import AuthUtils

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
        try:
            user = self.db.query(Users).filter(Users.email == email).first()
            if email and self.auth_utils.verify_password(password, user.password):
                access_token = self.sign_token({"email": user.email, "password": user.password_hash})
            return {"access_token": access_token}
        except Exception as e:
            return str(e)