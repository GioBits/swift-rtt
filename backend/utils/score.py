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


