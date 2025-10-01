from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    comment: Optional[str] = None
    rating: Optional[int] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    event_id: int
    username: Optional[str] = None
    event_title: Optional[str] = None
    reply: Optional[str] = None
    time: Optional[datetime] = None

    class Config:
        from_attributes = True 

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            event_id=obj.event_id,
            username=getattr(obj.user, "username", "Unknown") if hasattr(obj, "user") else "Unknown",
            event_title=getattr(obj.event, "title", "Unknown") if hasattr(obj, "event") else "Unknown",  # <- clé
            comment=obj.comment,
            rating=obj.rating,
            reply=obj.reply,
            time=getattr(obj, "time", None),
        )
