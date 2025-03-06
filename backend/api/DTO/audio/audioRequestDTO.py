from pydantic import BaseModel, Field
from fastapi import UploadFile

class create_audioDTO(BaseModel):
    user_id : int = Field(..., gt=0);
    language_id_from: int = Field(1, ge=1, le=2);
    language_id_to: int = Field(1, ge=1, le=2);
    file: UploadFile

    class Config:
        arbitrary_types_allowed = True


    