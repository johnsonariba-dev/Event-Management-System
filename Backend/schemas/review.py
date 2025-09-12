from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReviewBase(BaseModel):
    username: str                      
    comment: Optional[str] = None
    rating: int                      


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    id: int
    time: datetime            

    class Config:
        orm_mode = True
