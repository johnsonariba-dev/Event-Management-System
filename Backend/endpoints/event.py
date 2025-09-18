from fastapi import (
    APIRouter, Depends, HTTPException, status,
    UploadFile, File, Form
)
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
import os
import shutil
from uuid import uuid4

from schemas.events import EventOut
import models
from database import get_db
=======
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
import models
from database import get_db
from .supabase_test import upload_file

=======
=======
>>>>>>> Stashed changes
import os
import shutil
from uuid import uuid4

import models
from database import get_db
<<<<<<< Updated upstream
>>>>>>> Stashed changes:Backend/endpoints/event.py
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
from pydantic import BaseModel

from .auth import get_current_user  # adjust import path
# Import recommender function
from recommender import recommend_events

<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py

=======
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
        from_attributes = True  # Pydantic v2
=======
        from_attributes = True

>>>>>>> Stashed changes:Backend/endpoints/event.py

=======
        from_attributes = True

>>>>>>> Stashed changes

class EventForm(EventBase):
    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        category: str = Form(...),
        description: Optional[str] = Form(None),
        venue: str = Form(...),
<<<<<<< Updated upstream
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
        date: datetime = Form(...),
        ticket_price: float = Form(..., description="Ticket price as float"),
        capacity_max: Optional[int] = Form(None, description="Maximum capacity as int"),
=======
=======
>>>>>>> Stashed changes
        date: str = Form(...),
        ticket_price: float = Form(...),
        capacity_max: Optional[int] = Form(None),
>>>>>>> Stashed changes:Backend/endpoints/event.py
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
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py

@router.get("/events/my", response_model=List[EventOut])
def get_my_events(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(
        models.Event.organizer_id == current_user.id).all()
    return events


=======
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),   # ✅ add this
=======
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
    db: Session = Depends(get_db)
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),   # ✅ add this
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        **form_data.dict(),
        image_url=image_url,
        organizer_id=current_user.id
    )

<<<<<<< HEAD:Backend/endpoints/event.py
=======
    db_event = models.Event(**form_data.model_dump(), image_url=image_url)
=======
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
=======
>>>>>>> Stashed changes
    **form_data.dict(),
    image_url=image_url,
    organizer_id=current_user["id"]  # dict access
)


<<<<<<< Updated upstream
>>>>>>> Stashed changes:Backend/endpoints/event.py
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
    db: Session = Depends(get_db),
=======
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
    db: Session = Depends(get_db)
=======
    db: Session = Depends(get_db),
>>>>>>> Stashed changes:Backend/endpoints/event.py
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
    db: Session = Depends(get_db),
>>>>>>> Stashed changes
):
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update image if uploaded
    if image:
        db_event.image_url = upload_file(image, folder="events")

    # Update other fields
    for key, value in form_data.model_dump(exclude_unset=True).items():
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
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
=======
<<<<<<< Updated upstream:Backend/endpoints/event_fake.py
=======
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes

# ---------------- RECOMMENDATIONS ----------------

# ------------------- RECOMMENDER BASED ON REVIEWS -------------------
<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py


=======
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
@router.get("/recommend/{user_id}")
def recommend_for_user(user_id: int, top_n: int = 5, db: Session = Depends(get_db)):
    """
    Recommend events for a given user based on their reviews & ratings.
    """

<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
    # 1. Get all reviews by this user
    user_reviews = db.query(models.Review).filter(
        models.Review.user_id == user_id).all()
    if not user_reviews:
        raise HTTPException(
            status_code=404, detail="No reviews found for this user")

    # 2. Take positively-rated events (rating >= 4)
    liked_events = [
        r.event for r in user_reviews if r.rating and r.rating >= 4]

    if not liked_events:
        raise HTTPException(
            status_code=404, detail="No liked events to base recommendations on")

    # 3. Extract user interests from those events
=======
=======
>>>>>>> Stashed changes
    # Fetch only reviews with rating >= 4, along with the event
    liked_reviews = (
        db.query(models.Review)
        .filter(models.Review.user_id == user_id, models.Review.rating >= 4)
        .all()
    )

    if not liked_reviews:
        raise HTTPException(status_code=404, detail="No liked events to base recommendations on")

    # Extract events
    liked_events = [r.event for r in liked_reviews]

    # Extract user interests
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
    user_interests = []
    for ev in liked_events:
        user_interests.append(ev.title)
        user_interests.append(ev.category)
        if ev.description:
            user_interests.append(ev.description)

<<<<<<< Updated upstream
<<<<<<< HEAD:Backend/endpoints/event.py
    # 4. Call the recommender
    recommended = recommend_events(user_interests, top_n=top_n)

    return {"user_id": user_id, "recommended": recommended}
=======
=======
>>>>>>> Stashed changes
    # Call recommender
    recommended = recommend_events(user_interests, top_n=top_n)

    return {"user_id": user_id, "recommended": recommended}
<<<<<<< Updated upstream
>>>>>>> Stashed changes:Backend/endpoints/event.py
>>>>>>> b0ff3c1 (new install):Backend/endpoints/event_fake.py
=======
>>>>>>> Stashed changes
