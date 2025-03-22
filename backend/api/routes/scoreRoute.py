from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.database import get_db
from api.controller.scoreController import ScoreController 
from models.scores import ScoresSchema

score_controller = ScoreController()
router = APIRouter(prefix="/scores", tags=["Scores"])

@router.get("/top", response_model=list[ScoresSchema])
async def get_top_scores(n: int = Query(..., description="Cantidad de scores a mostrar")):
    return await score_controller.get_top_scores(n)

@router.get("/user/{user_id}", response_model=ScoresSchema)
async def get_user_score(user_id: int):
    """
    Endpoint para obtener el score de un usuario específico.
    """
    return await score_controller.get_score_by_user(user_id)

