from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.database import get_db
from api.controller.scoreController import ScoreController 
from models import ScoresSchema

score_controller = ScoreController()
router = APIRouter(prefix="/scores", tags=["Scores"])

@router.get("/top", response_model=list[ScoresSchema])
async def get_top_scores(n: int = Query(..., description="Cantidad de scores a mostrar")):
    return await score_controller.get_top_scores(n)