from fastapi import HTTPException, status
from api.service.loginRecordService import LoginRecordService
from typing import List
from models.login_records import LoginRecordBase

class LoginRecordController:
    """
    Controller for managing login records.
    """
    def __init__(self):
        """
        Initializes the LoginRecordController with an instance of LoginRecordService.
        """
        self.login_record_service = LoginRecordService()

    async def get_all_login_records(self):
        """
        Gets all login records.

        Returns:
            List[LoginRecordBase]: A list of all login records.

        Raises:
            HTTPException: If an internal server error occurs.
        """
        try:
            records = self.login_record_service.get_login_records()
            return records
        except Exception as e:
            print(f"Error getting login records: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def get_login_records_by_user_id(self, user_id: int):
        """
        Gets all login records for a specific user.

        Args:
            user_id (int): The ID of the user.

        Returns:
            List[LoginRecordBase]: A list of the user's login records.

        Raises:
            HTTPException: If the user has no login records or if an internal server error occurs.
        """
        try:
            records = self.login_record_service.get_login_records_by_user_id(user_id)
            if not records:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No login records found for user ID: {user_id}"
                )
            return records
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:
            print(f"Error getting login records for user {user_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            ) 