from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.scores import ScoreRecord, ScoresSchema
from .processMediaService import ProcessMediaService
from .languageService import LanguageService
from .userService import userService
from .translationService import TranslationService
from .loginRecordService import LoginRecordService
from sqlalchemy import func

class ScoreService:
    def __init__(self):
        """
        Initializes the ScoreService with required services and database session.
        """
        self.db = SessionLocal()
        self.user_service = userService()
        self.language_service = LanguageService()
        self.process_media_service = ProcessMediaService()
        self.translation_service = TranslationService()
        self.login_record_service = LoginRecordService()

    def __del__(self):
        """
        Closes the database session when the service is destroyed.
        """
        self.db.close()

    def get_top_scores(self, n: int):
        """
        Retrieves the top N scores in descending order.
        """
        try:
            score_top_user = self.db.query(ScoreRecord).order_by(ScoreRecord.score.desc()).limit(n).all()
            return [ScoresSchema.from_orm(score).user for score in score_top_user]
        except Exception as e:
            return str(e)

    def get_score_by_user_id(self, user_id: int) -> ScoreRecord:
        """
        Retrieves the score associated with a user by their ID.
        """
        try:
            score_user = self.db.query(ScoreRecord).filter(ScoreRecord.user_id == user_id).first()
            if not score_user:
                return None
            return score_user
        except Exception as e:
            return str(e)

    def update_user_score_data(self, user_id: int):
        """
        Calculates and updates the necessary data for a user's score.
        """
        try:
            # 1. TU – Total translations made by the user
            all_traduction_by_user = self.process_media_service.get_process_media_records_by_user_id(user_id)
            tu = all_traduction_by_user[1]

            # 2. MT – Total translations in the system   #TODO CHANGE THIS
            all_traduction = self.process_media_service.get_all_process_media_records()
            mt = all_traduction[1]

            # 3. IT – Total languages available in the system
            all_lenguage = self.language_service.get_all_languages()
            it = len(all_lenguage)

            # 4. IU – Distinct languages used by the user
            languages_used = set()
            for audio in all_traduction_by_user[0]:
                # Get the language of the audio
                if(audio['languages_from'] is not languages_used):
                    languages_used.add(audio['languages_from'])
                if(audio['languages_to'] is not languages_used):
                    languages_used.add(audio['languages_to'])

            iu = len(languages_used)

            # 5. LU – Number of times the user has logged in
            all_login_by_user = self.login_record_service.get_login_records_by_user_id(user_id)
            lu = len(all_login_by_user)

            # 6. MU – Total users in the system  #TODO CHANGE THIS
            all_login = self.login_record_service.get_login_records()
            mu = len(all_login)

            # Get or create ScoreRecord entry
            score = self.get_score_by_user_id(user_id)

            new_score = round(
                0.4 * (tu / mt) +
                0.4 * (iu / it) +
                0.2 * (lu / mu),
                4  # round to 4 decimal places
            )

            if not score:
                score = ScoreRecord(
                    user_id = user_id,
                    total_translations = tu,
                    total_users_translations = mt,
                    total_languages_used = iu,
                    total_system_languages = it,
                    different_users_contacted = lu,
                    total_system_users = mu,
                    score = new_score
                )
                self.db.add(score)
            else:
                # Update fields
                score.total_translations = tu
                score.total_users_translations = mt
                score.total_languages_used = iu
                score.total_system_languages = it
                score.different_users_contacted = lu
                score.total_system_users = mu
                score.score = new_score
            
            self.db.commit()
            self.db.refresh(score)
        except Exception as e:
            print(f"Error updating the score data for user {user_id}: {e}")

    def calculate_all_user_scores(self):
        """
        Calculates and updates the scores for all users in the ScoreRecord table.
        """
        try:
            # Retrieve all users
            all_users = self.user_service.get_all_users()

            for user in all_users:
                id = user.id
                self.update_user_score_data(id)
        except Exception as e:
            print(f"Error calculating scores for all users: {e}")