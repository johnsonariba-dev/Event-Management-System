from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

import models
from database import get_db
from .supabase_test import upload_file

from pydantic import BaseModel

router = APIRouter()

# ---------------- SCHEMAS ----------------
class EventBase(BaseModel):
    title: str
    category: str
    description: Optional[str]
    venue: str
    date: datetime
    ticket_price: float
    capacity_max: Optional[int]

class EventResponse(EventBase):
    id: int
    image_url: Optional[str]

    class Config:
        orm_mode = True

class EventForm(EventBase):
    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        category: str = Form(...),
        description: Optional[str] = Form(None),
        venue: str = Form(...),
        date: datetime = Form(...),
        ticket_price: float = Form(...),
        capacity_max: Optional[int] = Form(None),
    ):
        return cls(
            title=title,
            category=category,
            description=description,
            venue=venue,
            date=date,
            ticket_price=ticket_price,
            capacity_max=capacity_max,
        )

# ---------------- GET ALL EVENTS ----------------
@router.get("/events", response_model=List[EventResponse])
async def read_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

# ---------------- GET SINGLE EVENT ----------------
@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# ---------------- SHARE EVENT HTML ----------------
@router.get("/events/{event_id}/share", response_class=HTMLResponse)
def share_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return HTMLResponse(content="<h1>Event not found</h1>", status_code=404)

    html_content = f"""
    <html>
      <head>
        <meta property="og:title" content="{event.title}" />
        <meta property="og:description" content="{event.description}" />
        <meta property="og:image" content="{event.image_url}" />
        <meta property="og:url" content="http://127.0.0.1:8000/events/{event.id}/share" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <img src="{event.image_url}" alt="{event.title}" />
      </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# ---------------- CREATE EVENT ----------------
@router.post("/events", response_model=EventResponse)
async def create_event(
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
     db: Session = Depends(get_db) 
):
    existing_event = db.query(models.Event).filter(models.Event.title == form_data.title).first()
    if existing_event:
        raise HTTPException(status_code=400, detail="Event already exists")

    image_url = upload_file(image, folder="events") if image else ""

    db_event = models.Event(**form_data.dict(), image_url=image_url)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# ---------------- UPDATE EVENT ----------------
@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
     db: Session = Depends(get_db) 
):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if image:
        db_event.image_url = upload_file(image, folder="events")

    for key, value in form_data.dict(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event

# ---------------- DELETE EVENT ----------------
@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(db_event)
    db.commit()