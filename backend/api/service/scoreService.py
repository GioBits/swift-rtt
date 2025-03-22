from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.scores import ScoreRecord, ScoresSchema


class ScoreService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_top_scores(self, n: int):
        """
        Consulta los N scores más altos.
        """
        try:
            score_top_user =  self.db.query(ScoreRecord).order_by(ScoreRecord.score.desc()).limit(n).all()
            return [ScoresSchema.from_orm(score).user for score in score_top_user]
        except Exception as e:
            return str(e)
        
    def get_score_by_user_id(self, user_id: int) -> ScoreRecord:
        """
        Retorna el score asociado a un usuario por su ID.
        """
        try:
            score_user = self.db.query(ScoreRecord).filter(ScoreRecord.user_id == user_id).first()
            return score_user
        except Exception as e:
                return str(e)