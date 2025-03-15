from fastapi import HTTPException, UploadFile, status
from api.service.userService import userService

class userController:

    def __init__(self):
        self.user_create_service = userService()

    async def create_user(self, username:str, password:str, first_name:str, last_name:str):
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

        existing_user = self.user_create_service.get_user_by_username(username)
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this username already exists"
            )

        try:
            new_user = self.user_create_service.create_user(
                username=username,
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
        
    async def validate_password(password : str):
        
        # invalido si es más corto que 8 o más largo que 12
        if len(password) < 8 or 12 < len(password):
            return False
        
        # invalido si es todo en mayuscula
        if password.isupper():
            return False
        
        # invalido si es todo en minuscula
        if password.islower():
            return False
        
        # invalido si no contiene números
        if not(any(char.isdigit() for char in password)):
            return False

        # inválido si no contiene al menos uno de: !@#$^&*.
        if not(any((char == '!' or char == '@' or char == '#' or char == '$' 
                    or char == '^' or char == '&' or char == '*' or char == '.')
                    for char in password)):
            return False
        
        #Si pasa por los condicionales sin retornar, es válido
        return True