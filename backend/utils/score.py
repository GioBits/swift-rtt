from sqlalchemy.orm import Session
from db.database import SessionLocal
from sqlalchemy import func
from datetime import datetime
from models.scores import ScoreRecord
from models.process_media import ProcessMediaRecord
from models.users import UserRecord
from models.languages import LanguageRecord
from models.login_records import LoginRecord

class UpdateScore:
    def __init__(self):
        self.db = SessionLocal

    def get_score_record(self, user_id: int):
        """
        Función estática que obtiene o crea un registro de ScoreRecord para un usuario.
        """
        score_record = self.db.query(ScoreRecord).filter(ScoreRecord.user_id == user_id).first()
        if not score_record:
            score_record = ScoreRecord(user_id=user_id)
            self.db.add(score_record)
            self.db.commit()
            self.db.refresh(score_record)
        return score_record

    def update_total_translations(self, user_id: int):
        """
        Actualiza el total de traducciones (TU) realizadas por el usuario.
        """
        score_record = self.get_score_record(user_id, self.db)
        tu = self.db.query(func.count(ProcessMediaRecord.id)).scalar() or 0
        score_record.total_translations = tu
        print(f"Actualizado TU: {tu} para el usuario {user_id}")
        self.save(score_record)

    def update_max_user_translations(self, user_id: int):
        """
        Actualiza el máximo de traducciones realizadas por cualquier usuario (MT).
        """
        score_record = self.get_score_record(user_id)
        mt = self.db.query(
            ProcessMediaRecord.user_id,
            func.count(ProcessMediaRecord.id).label("count")
        ).group_by(ProcessMediaRecord.user_id).order_by(func.count(ProcessMediaRecord.id).desc()).first()
        score_record.total_users_translations = mt.count if mt else 1
        print(f"Actualizado MT: {score_record.total_users_translations} para el usuario {user_id}")
        self.save(score_record)

    
    def save(self, score_record: ScoreRecord):
        """
        Guarda el registro actualizado en la base de datos.
        """
        self.db.commit()
        self.db.refresh(score_record)
        print(f"✅ Score actualizado para el usuario {score_record.user_id}.")

    def calculate_all_user_scores(self):
        """
        Calcula y actualiza el score de todos los usuarios en la tabla ScoreRecord.
        """
        # Obtener todos los scores
        all_scores = self.db.query(ScoreRecord).all()

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

            self.db.add(record)

        self.db.commit()
