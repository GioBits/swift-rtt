from fastapi import APIRouter, File, UploadFile, Query, HTTPException, Depends
from api.controller.userController import userController
from typing import List
from api.DTO.user.userRequestDTO import create_userDTO

router = APIRouter()
user_controller= userController()

# Endpoint "/users", recibe datos de usuario para crear un nuevo usuario
@router.post("/users", tags=["Users"])
async def create_user(create_user_DTO : create_userDTO = Depends()):
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
    return await user_controller.create_user(create_user_DTO)

# Endpoint "/users/username/{username}", recupera un usuario por su correo electrónico
@router.get("/users/username/{username}", tags=["Users"])
async def get_user_by_username(username: str):
    """
    Retrieve a user record by its username.
    Args:
        username (str): The username of the user.
    Returns:
        UserRecordSchema: The user object if found.
        None: If the user with the given username does not exist.
    """
    return await user_controller.get_user_by_username(username)

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
    return await user_controller.get_user_by_id(userId)
