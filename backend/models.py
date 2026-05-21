from sqlalchemy import Column, Integer, String, Text
from .database import Base


class Painting(Base):
    __tablename__ = "paintings"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    inventory_number = Column(String(50),  nullable=False, default="")
    last_name        = Column(String(100), nullable=False)
    first_name       = Column(String(100), nullable=False, default="")
    patronymic       = Column(String(100), nullable=False, default="")
    birth_year       = Column(Integer,     nullable=True)
    death_year       = Column(Integer,     nullable=True)
    year             = Column(Integer,     nullable=False)
    title            = Column(String(300), nullable=False)
    material         = Column(String(200), nullable=False, default="")
    technique        = Column(String(200), nullable=False, default="")
    size             = Column(String(100), nullable=False, default="")
    notes            = Column(Text,        nullable=False, default="")
