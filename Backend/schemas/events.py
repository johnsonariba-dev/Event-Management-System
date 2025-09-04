from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import func
from database import db_dependency



# Schémas de base
class CreateEvent(BaseModel):
    title: str
    description: str
    category: str
    venue: str
    ticket_price: float
    date: str 
    image_url: str 
    # capacity_max : Optional[int] = 0


# Pydantic schema to serialize Event data
class EventResponse(CreateEvent):
    id: int


    class Config:
        orm_mode = True


# Schéma pour la mise à jour
class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None
    ticket_price: Optional[float] = None
    category: Optional[str] = None
    # capacity_max: Optional[int] = None
    image_url: Optional[str] = None

# 