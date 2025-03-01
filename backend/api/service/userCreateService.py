from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.users import Users, UsersSchema

class UserCreateService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def create_user(self, email:str, password_hash:str, first_name:str, last_name:str):
        """
        Create a new user entry in the database.
        Args:
            email (str): The email of the user.
            password_hash (str): The password hash of the user.
            first_name (str): The first name of the user.
            last_name (str): The last name of the user.
        Returns:
            UserRecordSchema: The newly created user object if successful.
        """
        try:
            new_user = Users(
                email=email,
                password_hash=password_hash,
                first_name=first_name,
                last_name=last_name
            )
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            return UsersSchema.from_orm(new_user)
        except Exception as e:
            self.db.rollback()
            return str(e)
        
    def get_user_by_email(self, email: str):
        """
        Retrieve a user record by its email.
        Args:
            email (str): The email of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given email does not exist.
        """
        try:
            user = self.db.query(Users).filter_by(email=email).first()
            if user is None:
                return None
            return UsersSchema.from_orm(user)
        except Exception as e:
            return str(e)
        
    def get_user_by_id(self, id: int):
        """
        Retrieve a user record by its id.
        Args:
            id (int): The id of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given email does not exist.
        """
        try:
            user = self.db.query(Users).filter_by(id=id).first()
            if user is None:
                return None
            return UsersSchema.from_orm(user)
        except Exception as e:
            return str(e)