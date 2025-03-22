from db.database import SessionLocal
from models.login_records import LoginRecord, LoginRecordBase
from typing import Optional, List

class LoginRecordService:
    """
    Service for managing user login records.
    """
    def __init__(self):
        """
        Initializes the service with a database session.
        """
        self.db = SessionLocal()

    def __del__(self):
        """
        Closes the database session when the service is destroyed.
        """
        self.db.close()

    def create_login_record(self, username: str, user_id: Optional[int] = None) -> LoginRecordBase:
        """
        Creates a new login record.
        
        Args:
            username (str): Username used in the login attempt.
            user_id (Optional[int]): User ID if the login was successful.
            
        Returns:
            LoginRecordBase: The created login record.
        """
        try:
            login_record = LoginRecord(
                username=username,
                user_id=user_id
            )
            
            self.db.add(login_record)
            self.db.commit()
            self.db.refresh(login_record)
            
            return LoginRecordBase.from_orm(login_record)
        except Exception as e:
            self.db.rollback()
            print(f"Error creating login record: {str(e)}")
            raise

    def get_login_records(self) -> List[LoginRecordBase]:
        """
        Gets all login records.
        
        Returns:
            List[LoginRecordBase]: List of all login records.
        """
        try:
            # Query all records ordered by creation date descending
            records = self.db.query(LoginRecord).order_by(LoginRecord.created_at.desc()).all()
            
            return [LoginRecordBase.from_orm(record) for record in records]
        
        except Exception as e:
            print(f"Error getting login records: {str(e)}")
            raise

    def get_login_records_by_user_id(self, user_id: int) -> List[LoginRecordBase]:
        """
        Gets all login records for a specific user.
        
        Args:
            user_id (int): User ID.
            
        Returns:
            List[LoginRecordBase]: List of the user's login records.
        """
        try:
            # Query user records ordered by creation date descending
            records = self.db.query(LoginRecord).filter(LoginRecord.user_id == user_id).order_by(
                LoginRecord.created_at.desc()
            ).all()
            
            return [LoginRecordBase.from_orm(record) for record in records]
        
        except Exception as e:
            print(f"Error getting login records for user {user_id}: {str(e)}")
            raise 