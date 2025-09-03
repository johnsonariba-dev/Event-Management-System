from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import SessionLocal, get_db
from datetime import date
import models


router = APIRouter()

# Pydantic schema to serialize Event data
class EventSchema(BaseModel):
    id: int
    title: str
    description: str
    category: str
    venue: str
    ticket_price: float
    # date: date
    image_url: str

    class Config:
        orm_mode = True



# Endpoint to fetch all events
@router.get("/events", response_model=List[EventSchema])
def read_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()
