from pydantic import BaseModel, Field

class add_translationDTO(BaseModel):
    transcription_id: int = Field(..., description="ID de transcripción")
    provider_id: int = Field(..., description="ID del proveedor")
    language_id: int = Field(..., description="ID del idioma de la traducción")

    class Config:
        arbitrary_types_allowed = True