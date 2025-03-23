from fastapi import APIRouter, Depends, Query, Cookie
from api.controller.scoreController import ScoreController 
from models.scores import ScoresSchema
from typing import List

score_controller = ScoreController()
router = APIRouter(prefix="/scores", tags=["Scores"])

@router.get("/top", response_model=List[ScoresSchema], tags=["Scores"])
async def get_top_scores(n: int = Query(..., description="Cantidad de scores a mostrar")):
    return await score_controller.get_top_scores(n)

@router.get("/user/me", tags=["Scores"])
async def get_current_user_score(session_token: str = Cookie(None)):
    """
    Obtiene la información del usuario autenticado a partir del token en la cookie.
    """
    return await score_controller.get_current_user_score(session_token)

@router.get("/user/{user_id}", response_model=ScoresSchema, tags=["Scores"])
async def get_user_score(user_id: int):
    """
    Endpoint para obtener el score de un usuario específico.
    """
    return await score_controller.get_score_by_user(user_id)

