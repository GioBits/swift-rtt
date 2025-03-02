from fastapi import HTTPException, UploadFile, status
from api.service.userService import userService
from models.users import Users, UsersSchema

class userController:

    def __init__(self):
        self.user_create_service = userService()

    async def create_user(self, email:str, password:str, first_name:str, last_name:str):
        """
        Create a new user entry in the database.
        Args:
            email (str): The email of the user.
            password_hash (str): The password hash of the user.
            first_name (str): The first name of the user.
            last_name (str): The last name of the user.
        Returns:
            UsersSchema: Dates of the user stored in the database.
        """

        try:
            new_user = self.user_create_service.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            return new_user
        
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
    async def get_user_by_email(self, email: str):
        """
        Retrieve a user record by its email.
        Args:
            email (str): The email of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given email does not exist.
        """
        try:
            result = self.user_create_service.get_user_by_email(email)
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            return result
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
        
    async def get_user_by_id(self, id: int):
        """
        Retrieve a user record by its id.
        Args:
            id (int): The id of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given email does not exist.
        """
        try:
            result = self.user_create_service.get_user_by_id(id)
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            return result
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )