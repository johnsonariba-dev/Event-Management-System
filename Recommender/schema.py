from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CreateEvent(BaseModel):
    title: str
    description: str
    date: datetime
    venue: str
    organizer: str
    ticket_price: float
    category: str
    image_url: str 
    capacity_max : Optional[int] = 0

class EventResponse(CreateEvent):
    id: int

    model_config = {
        "from_attributes": True
    }

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None
    organizer: Optional[str] = None
    ticket_price: Optional[float] = None
    category: Optional[str] = None
    capacity_max: Optional[int] = None
    image_url: Optional[str] = None

class RecommendationItem(BaseModel):
    id: int
    title: str
    description: Optional[str]
    score: float