from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .review import Review


class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    venue: str
    ticket_price: float
    category: str
    image_url: str
    capacity_max: Optional[int] = 0
    organizer_id: int
    status: Optional[str] = "Pending"


class EventOut(EventCreate):
    id: int
    reviews: List[Review] = []

    class Config:
        from_attributes = True


<<<<<<< HEAD
=======
# Schema for returning event data
class EventResponse(CreateEvent):
   id: int
   title: str
   class Config:
        from_attributes = True

# Schema for updating an event
>>>>>>> b0ff3c1 (new install)
class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    venue: Optional[str] = None
    ticket_price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    capacity_max: Optional[int] = None
    status: Optional[str] = None

# Optional schema for user interests


class UserInterests(BaseModel):
    interests: List[str]
