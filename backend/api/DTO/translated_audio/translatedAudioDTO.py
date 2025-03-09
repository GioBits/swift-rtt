from pydantic import BaseModel, Field

class add_translated_audioDTO(BaseModel):
    translation_id: int = Field(..., description="ID de la traducción")
    provider_id: int = Field(..., description="ID del proveedor")

    class Config:
        arbitrary_types_allowed = True