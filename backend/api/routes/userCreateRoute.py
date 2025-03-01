from fastapi import APIRouter, File, UploadFile, Query, HTTPException
from api.controller.userCreateController import UserCreateController
#from models.users import Users, UsersSchema
from typing import List

router = APIRouter()
user = UserCreateController()

# Endpoint "/users", recibe datos de usuario para crear un nuevo usuario
@router.post("/users", tags=["Users"])
async def create_user(email:str, password_hash:str, first_name:str, last_name:str):
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
    return await user.create_user(email, password_hash, first_name, last_name)

# Endpoint "/users/email/{email}", recupera un usuario por su correo electrónico
@router.get("/users/email/{email}", tags=["Users"])
async def get_user_by_email(email: str):
    """
    Retrieve a user record by its email.
    Args:
        email (str): The email of the user.
    Returns:
        UserRecordSchema: The user object if found.
        None: If the user with the given email does not exist.
    """
    return await user.get_user_by_email(email)

# Endpoint "/users/{userId}", recupera un usuario por su ID
@router.get("/users/{userId}", tags=["Users"])
async def get_user_by_id(userId: int):
    """
    Retrieve a user record by its id.
    Args:
        id (int): The id of the user.
    Returns:
        UserRecordSchema: The user object if found.
    """
    return await user.get_user_by_id(userId)
