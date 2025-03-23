from db.database import SessionLocal
from models.users import UserRecord, UsersSchema
from utils.auth import AuthUtils

class userService:
    def __init__(self):
        self.db = SessionLocal()
        self.auth = AuthUtils()

    def __del__(self):
        self.db.close()

    def create_user(self, username:str, password:str, first_name:str, last_name:str):
        """
        Create a new user entry in the database.
        Args:
            username (str): The username of the user.
            password_hash (str): The password hash of the user.
            first_name (str): The first name of the user.
            last_name (str): The last name of the user.
        Returns:
            UserRecordSchema: The newly created user object if successful.
        """

        password_hash = self.auth.hash_password(password)
        try:
            new_user = UserRecord(
                username=username,
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
        
    def get_user_by_username(self, username: str):
        """
        Retrieve a user record by its username.
        Args:
            username (str): The username of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given username does not exist.
        """
        try:
            user = self.db.query(UserRecord).filter_by(username=username).first()
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
            None: If the user with the given username does not exist.
        """
        try:
            user = self.db.query(UserRecord).filter_by(id=id).first()
            if user is None:
                return None
            return UsersSchema.from_orm(user)
        except Exception as e:
            return str(e)
    
    def get_user_by_username_with_pass(self, username: str):
        """
        Retrieve a user record by its username.
        Args:
            username (str): The username of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given username does not exist.
        """
        try:
            user = self.db.query(UserRecord).filter_by(username=username).first()
            if user is None:
                return None
            return user
        except Exception as e:
            return str(e)
        
    def get_all_users(self):
        """
        Retrieve all user records from the database.
        Returns:
            list: A list of UserSchema objects representing all users in the database.
        """
        try:
            users = self.db.query(UserRecord).all()
            return [UsersSchema.from_orm(user) for user in users]
        except Exception as e:
            return str(e)