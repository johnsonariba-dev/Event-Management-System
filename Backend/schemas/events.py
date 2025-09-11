from typing import  Optional, List
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import func



# Schémas de base
class CreateEvent(BaseModel):
    title: str
    description: str
    date: datetime
    venue: str
    ticket_price: float
    category: str
    image_url: str 
    capacity_max : Optional[int] = 0


# Pydantic schema to serialize Event data
class EventResponse(CreateEvent):
    id: int

    class Config:
        From_attributes = True


# Schéma pour la mise à jour
class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    venue: Optional[str] = None
    ticket_price: Optional[float] = None
    category: Optional[str] = None
    capacity_max: Optional[int] = None
    image_url: Optional[str] = None

class UserInterests(BaseModel):
    interests: List[str]