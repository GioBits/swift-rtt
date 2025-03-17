from pydantic import BaseModel, Field

class add_translationDTO(BaseModel):
    transcription_id: int = Field(..., description="ID de transcripción")
    provider_id: int = Field(..., description="ID del proveedor")
    language_id_from: int = Field(..., description="ID del idioma de origen")
    language_id_to: int = Field(..., description="ID del idioma de destino")

    class Config:
        arbitrary_types_allowed = True