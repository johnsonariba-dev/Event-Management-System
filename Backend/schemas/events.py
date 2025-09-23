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
    title: str
    description: str
    date: datetime
    venue: str
    category: str
    ticket_price: float
    capacity_max: Optional[int] = 0
    status: str
    image_url: Optional[str] = ""
    reviews: List[Review] = []

    class Config:
        orm_mode = True

class OrganizerOut(BaseModel):
    id: int | None = None
    username: str
    email: str | None = None

    class Config:
        orm_mode = True

class AdminEventOut(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    venue: str
    ticket_price: float
    category: str
    capacity_max: Optional[int] = 0
    status: str
    image_url: Optional[str] = ""
    reviews: List[Review] = []
    organizer: OrganizerOut  # <- we include the nested organizer object

    class Config:
        orm_mode = True

# Schema for returning event data
# class EventResponse(CreateEvent):
#    id: int
#    title: str
#    class Config:
#         from_attributes = True

# Schema for updating an event
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

class EventBase(BaseModel):
    title: str
    category: str
    description: Optional[str]
    venue: str
    date: datetime
    ticket_price: float
    capacity_max: Optional[int]
    image_url: Optional[str] = None

class EventResponse(EventBase):
    id: int
    image_url: Optional[str]

    class Config:
        orm_mode = True

class UserInterests(BaseModel):
    interests: List[str]


class LineChartData(BaseModel):
    labels: list[str]
    data: list[int]