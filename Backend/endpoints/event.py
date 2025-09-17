from fastapi import (
    APIRouter, Depends, HTTPException, status,
    UploadFile, File, Form
)
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import shutil
from uuid import uuid4

import models
from database import get_db
from pydantic import BaseModel

from .auth import get_current_user  # adjust import path
# Import recommender function
from recommender import recommend_events

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------- UTILS ----------------
def upload_file(file: UploadFile, folder: str = "events") -> str:
    if not file:
        return ""

    folder_path = os.path.join(UPLOAD_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)

    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(folder_path, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Public URL (served later by StaticFiles)
    return f"/{folder}/{filename}"


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
        date: str = Form(...),
        ticket_price: float = Form(...),
        capacity_max: Optional[int] = Form(None),
    ):
        return cls(
            title=title,
            category=category,
            description=description,
            venue=venue,
            date=datetime.fromisoformat(date),
            ticket_price=ticket_price,
            capacity_max=capacity_max,
        )


# ---------------- ROUTES ----------------
@router.get("/events", response_model=List[EventResponse])
async def read_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()


@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


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


@router.post("/events", response_model=EventResponse)
async def create_event(
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),   # ✅ add this
):
    # Check for duplicates
    existing_event = db.query(models.Event).filter(
        models.Event.title == form_data.title).first()
    if existing_event:
        raise HTTPException(status_code=400, detail="Event already exists")

    if form_data.ticket_price < 0:
        raise HTTPException(
            status_code=400, detail="Ticket price must be positive")

    if form_data.capacity_max is not None and form_data.capacity_max < 0:
        raise HTTPException(
            status_code=400, detail="Capacity must be positive")

    image_url = upload_file(image, folder="events") if image else ""

    # ✅ attach organizer_id from logged-in user
    db_event = models.Event(
        **form_data.dict(),
        image_url=image_url,
        organizer_id=current_user.id
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if image:
        db_event.image_url = upload_file(image, folder="events")

    for key, value in form_data.dict(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(db_event)
    db.commit()

# ---------------- RECOMMENDATIONS ----------------

# ------------------- RECOMMENDER BASED ON REVIEWS -------------------
@router.get("/recommend/{user_id}")
def recommend_for_user(user_id: int, top_n: int = 5, db: Session = Depends(get_db)):
    """
    Recommend events for a given user based on their reviews & ratings.
    """

    # 1. Get all reviews by this user
    user_reviews = db.query(models.Review).filter(models.Review.user_id == user_id).all()
    if not user_reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this user")

    # 2. Take positively-rated events (rating >= 4)
    liked_events = [r.event for r in user_reviews if r.rating and r.rating >= 4]

    if not liked_events:
        raise HTTPException(status_code=404, detail="No liked events to base recommendations on")

    # 3. Extract user interests from those events
    user_interests = []
    for ev in liked_events:
        user_interests.append(ev.title)
        user_interests.append(ev.category)
        if ev.description:
            user_interests.append(ev.description)

    # 4. Call the recommender
    recommended = recommend_events(user_interests, top_n=top_n)

    return {"user_id": user_id, "recommended": recommended}

