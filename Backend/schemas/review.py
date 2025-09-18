from pydantic import BaseModel
from typing import Optional

class ReviewBase(BaseModel):
    comment: Optional[str] = None
<<<<<<< Updated upstream
<<<<<<< HEAD
    rating: Optional[int] = None
    
=======
    rating: int                      
>>>>>>> b0ff3c1 (new install)
=======
    rating: Optional[int] = None                      
>>>>>>> Stashed changes

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
<<<<<<< Updated upstream
<<<<<<< HEAD
    username: str
    comment: str
    rating: int
=======
>>>>>>> Stashed changes
    event_id: int
    username: str  # will be populated from SQLAlchemy relationship
    reply: Optional[str] = None
<<<<<<< Updated upstream
    # time: datetime
=======
<<<<<<< Updated upstream
    time: datetime            
=======
    event_id: int
    username: str  # will be populated from SQLAlchemy relationship
    reply: Optional[str] = None
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes

    class Config:
       from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        """
        Override from_orm to automatically fetch username from user relationship.
        """
        data = {
            "id": obj.id,
            "event_id": obj.event_id,
            "username": getattr(obj.user, "username", "Unknown") if hasattr(obj, "user") else "Unknown",
            "comment": obj.comment,
            "rating": obj.rating,
            "reply": obj.reply,
        }
        return cls(**data)
