from pydantic import BaseModel, Field

class loginDTO(BaseModel):
    username: str = Field(..., description="nombre de usuario");
    password: str = Field(..., description="contraseña en uso")

    class Config:
        arbitrary_types_allowed = True