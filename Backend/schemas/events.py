from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .review import Review


# Base schema for creating an event
class CreateEvent(BaseModel):
    title: str
    description: str
    date: datetime
    venue: str
    ticket_price: float
    category: str
    image_url: str
    # capacity_max: Optional[int] = 0


class Event(CreateEvent):
    id: int
    reviews: List[Review] = []  # embed list of reviews

    class Config:
        orm_mode = True


# Schema for returning event data
class EventResponse(CreateEvent):
    id: int

    class Config:
        orm_mode = True


# Schema for updating an event
class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    venue: Optional[str] = None
    ticket_price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    # capacity_max: Optional[int] = None


class UserInterests(BaseModel):
    interests: List[str]
