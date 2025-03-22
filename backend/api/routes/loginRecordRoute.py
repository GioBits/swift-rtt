from fastapi import APIRouter, Depends
from api.controller.loginRecordController import LoginRecordController
from typing import List
from models.login_records import LoginRecordBase

router = APIRouter()
login_record_controller = LoginRecordController()

@router.get("/login-records", tags=["Login Records"])
async def get_all_login_records():
    """
    Gets all login records.

    Returns:
        List[LoginRecordBase]: A list of all login records.
    """
    return await login_record_controller.get_all_login_records()

@router.get("/login-records/user/{user_id}", tags=["Login Records"])
async def get_login_records_by_user_id(user_id: int):
    """
    Gets all login records for a specific user.

    Args:
        user_id (int): The ID of the user.

    Returns:
        List[LoginRecordBase]: A list of the user's login records.
    """
    return await login_record_controller.get_login_records_by_user_id(user_id) 