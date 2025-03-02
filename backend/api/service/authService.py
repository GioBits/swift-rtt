from db.database import SessionLocal
from sqlalchemy.orm import Session
from models.users import Users, UsersSchema
from utils.auth import AuthUtils

class AuthService:
    def __init__(self):
        self.auth_utils = AuthUtils()
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def login(self, email:str, password:str):
        try:
            user = self.db.query(Users).filter(Users.email == email).first()
            if email and self.auth_utils.verify_password(password, user.password):
                access_token = self.sign_token({"email": user.email, "password": user.password_hash})
            return {"access_token": access_token}
        except Exception as e:
            return str(e)