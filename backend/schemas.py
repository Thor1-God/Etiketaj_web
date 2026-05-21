from pydantic import BaseModel, field_validator
from typing import Optional


class PaintingBase(BaseModel):
    inventory_number: str          = ""
    last_name:        str
    first_name:       str          = ""
    patronymic:       str          = ""
    birth_year:       Optional[int] = None
    death_year:       Optional[int] = None
    year:             int
    title:            str
    material:         str          = ""
    technique:        str          = ""
    size:             str          = ""
    notes:            str          = ""

    @field_validator("last_name", "title")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Поле не может быть пустым")
        return v.strip()


class PaintingCreate(PaintingBase):
    pass

class PaintingUpdate(PaintingBase):
    pass

class PaintingOut(PaintingBase):
    id: int
    model_config = {"from_attributes": True}


class ArtistOut(BaseModel):
    last_name:  str
    first_name: str
    patronymic: str
    birth_year: Optional[int]
    death_year: Optional[int]
    count:      int
    paintings:  list[dict]


class GenerateRequest(BaseModel):
    paintings: list[PaintingOut]
