from sqlalchemy.orm import Session
from db.database import SessionLocal
from datetime import datetime
from models.process_media import ProcessMediaRecord
from models.languages import LanguageRecord
from models.users import UserRecord
from models.scores import ScoreRecord
from models.login_records import LoginRecord
from sqlalchemy import func

def calculate_all_user_scores():
    """
    Calcula y actualiza el score de todos los usuarios en la tabla ScoreRecord.
    """

    db = SessionLocal()
    # Obtener todos los scores
    all_scores = db.query(ScoreRecord).all()

    for record in all_scores:
        TU = record.total_translations
        MT = record.total_users_translations  # evitar división por cero
        IU = record.total_languages_used 
        IT = record.total_system_languages 
        LU = record.different_users_contacted 
        MU = record.total_system_users 

        # Cálculo del score con fórmula proporcionada
        score = round(
            0.4 * (TU / MT) +
            0.4 * (IU / IT) +
            0.2 * (LU / MU),
            4  # redondear a 4 decimales
        )

        record.score = score
        record.last_updated = datetime.utcnow()

        db.add(record)

    db.commit()
    print("✅ Scores actualizados exitosamente.")


def update_user_score_data(user_id: int):
    """
    Calcula y actualiza los datos necesarios del usuario para el cálculo del score.
    """

    db = SessionLocal()
    # 1. TU – Total de traducciones del sistema
    tu = db.query(func.count(ProcessMediaRecord.id)).scalar() 

    # 2. MT – Máximo de traducciones hechas por un usuario
    mt = db.query(
        ProcessMediaRecord.user_id,
        func.count(ProcessMediaRecord.id).label("count")
    ).group_by(ProcessMediaRecord.user_id).order_by(func.count(ProcessMediaRecord.id).desc()).first()
    mt = mt.count if mt else 1

    # 3. IU – Idiomas distintos usados por el usuario
    iu = db.query(func.count(func.distinct(ProcessMediaRecord.languages_from))).filter(ProcessMediaRecord.user_id == user_id).scalar() or 0

    # 4. IT – Total de idiomas disponibles en el sistema
    it = db.query(func.count(LanguageRecord.id)).scalar() or 1

    # 5. LU- Veces que el usuario ha ingresado al sistema
    lu = db.query(func.count(LoginRecord.id)).filter(LoginRecord.user_id == user_id).scalar() or 0
    
    # 6. MU – Total de usuarios en el sistema
    mu = db.query(func.count(UserRecord.id)).scalar() or 1

    # Obtener o crear registro ScoreRecord
    score = db.query(ScoreRecord).filter(ScoreRecord.user_id == user_id).first()
    if not score:
        score = ScoreRecord(user_id=user_id)
        db.add(score)

    # Actualizar los campos
    score.total_translations = tu
    score.total_users_translations = mt
    score.total_languages_used = iu
    score.total_system_languages = it
    score.different_users_contacted = lu
    score.total_system_users = mu

    db.commit()
    db.refresh(score)

    print(f"✅ Datos del usuario {user_id} actualizados para el cálculo del score.")