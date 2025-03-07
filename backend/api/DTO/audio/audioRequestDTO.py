from pydantic import BaseModel, Field
from fastapi import UploadFile, Query

class create_audioDTO(BaseModel):
    user_id : int = Field(..., description="The user ID");
    language_id_from: int = Field(Query(1, ge=1, le=2), description="audio language");
    language_id_to: int = Field(Query(1, ge=1, le=2), description="target language for audio translation");
    file: UploadFile = Field(..., description="Audio file to upload")

    class Config:
        arbitrary_types_allowed = True


    