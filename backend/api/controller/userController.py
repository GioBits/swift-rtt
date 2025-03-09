from fastapi import HTTPException, UploadFile, status
from api.service.userService import userService
from api.DTO.user.userRequestDTO import create_userDTO

class userController:

    def __init__(self):
        self.user_create_service = userService()

    async def create_user(self, create_user_DTO : create_userDTO):
        """
        Create a new user entry in the database.
        Args:
            username (str): The username of the user.
            password_hash (str): The password hash of the user.
            first_name (str): The first name of the user.
            last_name (str): The last name of the user.
        Returns:
            UsersSchema: Dates of the user stored in the database.
        """

        existing_user = self.user_create_service.get_user_by_username(create_user_DTO.username)
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this username already exists"
            )

        try:
            new_user = self.user_create_service.create_user(
                username=create_user_DTO.username,
                password=create_user_DTO.password,
                first_name=create_user_DTO.first_name,
                last_name=create_user_DTO.last_name
            )
            return new_user
        
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
    async def get_user_by_username(self, username: str):
        """
        Retrieve a user record by its username.
        Args:
            username (str): The username of the user.
        Returns:
            UserRecordSchema: The user object if found.
            None: If the user with the given username does not exist.
        """
        try:
            result = self.user_create_service.get_user_by_username(username)
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
            None: If the user with the given username does not exist.
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