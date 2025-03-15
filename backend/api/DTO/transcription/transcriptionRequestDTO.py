from pydantic import BaseModel, Field

class add_transcriptionDTO(BaseModel):
    audio_id: int = Field(..., description="ID del audio")
    provider_id: int = Field(..., description="ID del proveedor")

    class Config:
        arbitrary_types_allowed = True