from sqlalchemy.orm import Session
from backend.models.audio import models

# Crear un nuevo usuario
def create_user(db: Session, username: str, email: str, full_name: str):
    db_user = models.User(username=username, email=email, full_name=full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Obtener todos los usuarios
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Obtener un usuario por ID
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()
