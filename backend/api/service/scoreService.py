from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.scores import ScoreRecord, ScoresSchema
from models.process_media import ProcessMediaRecord
from models.languages import LanguageRecord
from models.users import UserRecord
from sqlalchemy import func

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
            return ScoresSchema.from_orm(score_user)
        except Exception as e:
                return str(e)
        
    def update_user_score_data(self, user_id: int):
        """
        Calcula y actualiza los datos necesarios del usuario para el cálculo del score.
        """

        '''
        # 1. TU – Total de traducciones del sistema
        tu = self.db.query(func.count(ProcessMediaRecord.id)).scalar() or 1

        # 2. MT – Máximo de traducciones hechas por un usuario
        mt = self.db.query(
            ProcessMediaRecord.user_id,
            func.count(ProcessMediaRecord.id).label("count")
        ).group_by(ProcessMediaRecord.user_id).order_by(func.count(ProcessMediaRecord.id).desc()).first()
        mt = mt.count if mt else 1

        # 3. IU – Idiomas distintos usados por el usuario
        iu = self.db.query(func.count(func.distinct(ProcessMediaRecord.languages_from))).filter(ProcessMediaRecord.user_id == user_id).scalar() or 0

        # 4. IT – Total de idiomas disponibles en el sistema
        it = self.db.query(func.count(LanguageRecord.id)).scalar() or 1

        # 5. LU – Usuarios distintos con los que interactuó
        # Este punto depende de cómo esté tu lógica de interacción. Si no tienes tabla de interacciones, puedes asumir 0 o simular.
        lu = 0  # Placeholder hasta que haya un sistema de interacción

        # 6. MU – Total de usuarios en el sistema
        mu = self.db.query(func.count(UserRecord.id)).scalar() or 1
        '''
        # Obtener o crear registro ScoreRecord
        score = self.db.query(ScoreRecord).filter(ScoreRecord.user_id == user_id).first()
        if not score:
            score = ScoreRecord(user_id=user_id)
            self.db.add(score)
        
        tu = 456 
        mt = 465 
        iu = 47431 
        it = 465123
        lu = 64946 
        mu = 4546 

        # Actualizar los campos
        score.total_translations = tu
        score.total_users_translations = mt
        score.total_languages_used = iu
        score.total_system_languages = it
        score.different_users_contacted = lu
        score.total_system_users = mu
        
        new_score = round(
            0.4 * (tu / mt) +
            0.4 * (iu / it) +
            0.2 * (lu / mu),
            4  # redondear a 4 decimales
        )
        
        score.score = new_score

        self.db.commit()
        self.db.refresh(score)
        

