from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.scores import ScoreRecord, ScoresSchema
from .processMediaService import ProcessMediaService
from .languageService import LanguageService
from .userService import userService
from .translationService import TranslationService
from sqlalchemy import func

class ScoreService:
    def __init__(self):
        self.db = SessionLocal()
        self.user_service = userService()
        self.language_service = LanguageService()
        self.process_media_service= ProcessMediaService()
        self.translation_service = TranslationService()

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

        
        # 1. TU – Total de traducciones hechas por el usuari
        all_traduction_by_user = self.process_media_service.get_process_media_records_by_user_id(user_id)
        tu = len(all_traduction_by_user[0])

        
        # 2. MT – Total de traducciones en el sistema
        all_traduction = self.process_media_service.get_all_process_media_records()
        mt = len(all_traduction[0])

        # 3. IT – Total de idiomas disponibles en el sistema
        all_lenguage = self.language_service.get_all_languages()
        it = len(all_lenguage)

        
        # 4. IU – Idiomas distintos usados por el usuario
        languages_used = {}
        for audio in all_traduction_by_user[0]:
            # Obtiene el lenguaje del audio
            language_id = audio['language_id']
            languages_used.add(language_id)
            
            # Obtiene el lenguaje de la traducción de ese audio
            translate_audio = self.language_service.get_language_by_id(audio['id'])
            translate_audio_language = translate_audio['language_id']
            languages_used.add(translate_audio_language)

        iu = len(languages_used)
        '''
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
        

    def calculate_all_user_scores(self):
        """
        Calcula y actualiza el score de todos los usuarios en la tabla ScoreRecord.
        """
        # Obtener todos los scores
        all_users = self.db.query(UserRecord).all()

        for user in all_users:
            id = user.id
            self.update_user_score_data(id)