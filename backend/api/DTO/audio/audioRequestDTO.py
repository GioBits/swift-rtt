from pydantic import BaseModel, Field
from fastapi import UploadFile, Query

class create_audioDTO(BaseModel):
    user_id : int = Field(..., description="ID del usuario");
    language_id_from: int = Field(Query(1, ge=1, le=4), description="idioma del audio");
    language_id_to: int = Field(Query(1, ge=1, le=4), description="idioma a traducir el audio");
    file: UploadFile = Field(..., description="archivo de audio a subir")

    class Config:
        arbitrary_types_allowed = True

class process_mediaDTO(BaseModel):
    user_id: int= Field(..., description="ID del usuario");
    audio_id: int = Field(..., description="ID del audio");
    language_id_from: int = Field(Query(1, ge=1, le=4), description="idioma del audio");
    language_id_to: int = Field(Query(1, ge=1, le=4), description="idioma a traducir el audio")

    class Config:
        arbitrary_types_allowed = True

class retrieve_audios_listDTO(BaseModel):
    page: int = Field(Query(1, ge=1, description="Número de página"));
    size: int = Field(Query(10, ge=1, le=50, description="Número de elementos por página"))

    class Config:
        arbitrary_types_allowed = True