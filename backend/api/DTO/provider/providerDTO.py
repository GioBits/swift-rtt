from pydantic import BaseModel, Field
from typing import Dict, Any

class add_providerDTO (BaseModel):
    data: Dict[str, Any] = Field(..., description="")

    class Config:
        arbitrary_types_allowed = True