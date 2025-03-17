from pydantic import BaseModel, Field

class create_userDTO(BaseModel):
    username:str = Field(..., description="Nombre del usuario")
    password:str = Field(..., description="contraseña insertada")
    first_name:str = Field(..., description="primer nombre del usuario")
    last_name:str = Field(..., description="apellido del usuario")

    class Config:
        arbitrary_types_allowed = True