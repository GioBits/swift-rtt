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


