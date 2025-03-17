from pydantic import BaseModel, Field

class add_languageDTO(BaseModel):
    code: str = Field(..., description="");
    name: str = Field(..., description="");

    class Config:
        arbitrary_types_allowed = True