from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, validator
from .review import Review


# ---------- CREATE ----------
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
    status: str = "Pending"   # <- unified type (was Optional[str])


# ---------- OUT / READ ----------
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
    organizer: str
    image_url: Optional[str] = ""
    reviews: List[Review] = []
    image_urls: list[str] = []        # multiple images
    reviews: list[Review] = []

    @validator("image_urls", pre=True, always=True)
    def normalize_image_urls(cls, v):
        """
        Ensure every image has a full URL or fallback placeholder.
        Accepts either a single string or a list.
        """
        placeholder = "https://via.placeholder.com/600x400?text=No+Image"

        if not v:
            return [placeholder]

        # If a single string was passed, wrap in list
        if isinstance(v, str):
            v = [v]

        def fix(u: str) -> str:
            u = u.strip()
            if not u:
                return placeholder
            if u.startswith("http"):
                return u
            if u.startswith("/uploads/events/"):
                return f"http://localhost:8000{u}"
            return f"http://localhost:8000/uploads/events/{u.lstrip('/')}"

        return [fix(u) for u in v]

    class Config:
        orm_mode = True


class OrganizerOut(BaseModel):
    id: Optional[int] = None
    username: str
    email: Optional[str] = None

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
    reviews: list[Review] = []
    organizer: OrganizerOut

    @validator("image_url", pre=True, always=True)
    def normalize_image_url(cls, v):
        placeholder = "https://via.placeholder.com/600x400?text=No+Image"
        if not v:
            return placeholder
        v = v.strip()
        if v.startswith("http"):
            return v
        if v.startswith("/uploads/events/"):
            return f"http://localhost:8000{v}"
        return f"http://localhost:8000/uploads/events/{v.lstrip('/')}"

    class Config:
        orm_mode = True


# ---------- UPDATE ----------
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


# ---------- BASE / GENERIC ----------
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
    image_urls: Optional[list[str]] = None

    class Config:
        orm_mode = True


# ---------- MISC ----------
class UserInterests(BaseModel):
    interests: list[str]


class LineChartData(BaseModel):
    labels: list[str]
    data: list[int]
