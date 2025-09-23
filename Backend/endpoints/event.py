# endpoints/event.py
from fastapi import (
    APIRouter, Depends, HTTPException, status,
    UploadFile, File, Form
)
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import extract, func
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
import os
import shutil
from uuid import uuid4

from schemas.users import UserOut
from schemas.events import AdminEventOut, EventBase, EventOut, EventResponse, LineChartData, OrganizerOut
import models
from database import get_db
from pydantic import BaseModel

from .auth import get_current_user
from recommender import recommend_events

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def upload_file(file: UploadFile, folder: str = "events") -> str:
    if not file:
        return ""

    folder_path = os.path.join("uploads", folder)
    os.makedirs(folder_path, exist_ok=True)

    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(folder_path, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the **full URL path** the frontend can use
    return f"/uploads/{folder}/{filename}"


class EventResponse(EventBase):
    id: int
    image_url: Optional[str]

    class Config:
        from_attributes = True  # Pydantic v2


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


# ROUTES

@router.get("/events/stats")
def get_event_stats(db: Session = Depends(get_db)):
    total = db.query(models.Event).count()
    pending = db.query(models.Event).filter(models.Event.status == "Pending").count()
    approved = db.query(models.Event).filter(models.Event.status == "Approved").count()
    rejected = db.query(models.Event).filter(models.Event.status == "Rejected").count()

    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }


@router.get("/line-data", response_model=LineChartData)
def get_line_data(db: Session = Depends(get_db)):
    current_year = datetime.utcnow().year

    counts = (
        db.query(
            extract("month", models.Event.date).label("month"),
            func.count(models.Event.id)
        )
        .filter(extract("year", models.Event.date) == current_year)
        .group_by("month")
        .all()
    )

    # Initialize all months to 0
    monthly_counts = [0] * 12
    for month, count in counts:
        monthly_counts[int(month)-1] = count

    return LineChartData(
        labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        data=monthly_counts
    )


@router.get("/events/pending")
def get_pending_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(models.Event.status == "Pending").all()
    result = []
    for event in events:
        # Assuming event.organizer is a relationship to the User model
        result.append({
            "title": event.title,
            "status": event.status,
           
            "username": event.organizer.username  # fetch username from related User
        })
    return result
@router.get("/user/me", response_model=UserOut)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

# Organizer: see own events
@router.get("/events/my", response_model=List[AdminEventOut])
def get_my_events(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    events = db.query(models.Event).filter(
        models.Event.organizer_id == current_user.id
    ).all()
    return events

# Public: see only approved events
@router.get("/events", response_model=List[EventResponse])
async def read_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(models.Event.status == "Approved").all()
    return events

# admin: see for everybody

@router.get("/events/all", response_model=List[AdminEventOut])
def get_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    result = []

    for event in events:
        organizer_obj = db.query(models.User).filter(models.User.id == event.organizer_id).first()
        organizer_data = OrganizerOut(
            id=organizer_obj.id if organizer_obj else None,
            username=organizer_obj.username if organizer_obj else "Unknown",
            email=organizer_obj.email if organizer_obj else None
        )

        result.append(
            AdminEventOut(
                id=event.id,
                title=event.title,
                description=event.description,
                date=event.date,
                venue=event.venue,
                ticket_price=event.ticket_price,
                category=event.category,
                capacity_max=event.capacity_max,
                status=event.status,
                image_url=event.image_url,
                reviews=[],  # add reviews if needed
                organizer=organizer_data
            )
        )
    return result

# Single event by ID
@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


# Share event (Open Graph meta tags)
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
        <meta property="og:image" content="{event.image_url or ''}" />
        <meta property="og:url" content="http://127.0.0.1:8000/events/{event.id}/share" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <img src="{event.image_url or ''}" alt="{event.title}" />
      </body>
    </html>
    """
    return HTMLResponse(content=html_content)


# Create event
@router.post("/events", response_model=EventResponse)
def create_event(
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    existing_event = db.query(models.Event).filter(
        models.Event.title == form_data.title
    ).first()
    if existing_event:
        raise HTTPException(status_code=400, detail="Event already exists")

    if form_data.ticket_price < 0:
        raise HTTPException(status_code=400, detail="Ticket price must be positive")
    if form_data.capacity_max is not None and form_data.capacity_max < 0:
        raise HTTPException(status_code=400, detail="Capacity must be positive")

    image_url = upload_file(image, folder="events") if image else ""

    db_event = models.Event(
        **form_data.dict(exclude={"image_url"}),
        image_url=image_url,
        organizer_id=current_user.id
    )
    print("Current user ID:", current_user.id)
    print("Created event organizer ID:", db_event.organizer_id)


    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


# Update event
@router.put("/events/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    form_data: EventForm = Depends(EventForm.as_form),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if image:
        db_event.image_url = upload_file(image, folder="events")

    for key, value in form_data.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event


# Delete event
@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(db_event)
    db.commit()


# ---------------- ADMIN ----------------
@router.patch("/admin/events/{event_id}/status")
def update_event_status(event_id: int, status: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if status not in ["Pending", "Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    event.status = status
    db.commit()
    db.refresh(event)
    return {"message": "Status updated", "event": event}

# ---------------- RECOMMENDATIONS ----------------
@router.get("/recommend/{user_id}")
def recommend_for_user(user_id: int, top_n: int = 5, db: Session = Depends(get_db)):
    """
    Recommend events for a user based on their liked events (rating >=4)
    """
    user_reviews = db.query(models.Review).filter(
        models.Review.user_id == user_id
    ).all()
    if not user_reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this user")

    liked_events = [r.event for r in user_reviews if r.rating and r.rating >= 4]
    if not liked_events:
        raise HTTPException(status_code=404, detail="No liked events to base recommendations on")

    user_interests = []
    for ev in liked_events:
        user_interests.append(ev.title)
        user_interests.append(ev.category)
        if ev.description:
            user_interests.append(ev.description)

    recommended = recommend_events(user_interests, top_n=top_n)
    return {"user_id": user_id, "recommended": recommended}
