from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from api.service.scoreService import ScoreService
from api.controller.userController import userController
from utils.auth import AuthUtils
#from schemas.score_schema import ScoresSchema

class ScoreController:
    def __init__(self):
        self.score_service = ScoreService()
        self.user_controller = userController()
        self.auth = AuthUtils()
    async def get_top_scores(self, n: int):
        """
        Controlador que obtiene los N scores más altos.
        """
        try:
            if n <= 0:
                raise HTTPException(status_code=400, detail="El número debe ser mayor que cero")

            top_scores = self.score_service.get_top_scores(n)
            return top_scores
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
        
    async def get_score_by_user(self, user_id: int):
        """
        Controlador que maneja la lógica para obtener el score de un usuario por su ID.
        """
        try:
            score = self.score_service.get_score_by_user_id(user_id)
            if not score:
                raise HTTPException(status_code=404, detail="Score no encontrado para el usuario")
            return score
        except HTTPException as e:
            print(f"HTTPException captured: {e.detail}")
            raise e
        except Exception as e:  # Capture general exceptions
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
        
    async def get_current_user_score(self, session_token: str):
        """
        Obtains the information of the authenticated user from the token in the cookie.
        """
        try:
            user = self.user_controller.get_current_user(session_token)
            id = user.get("id")
            score = self.score_service(id)
            return score
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
