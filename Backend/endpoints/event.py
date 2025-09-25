# endpoints/event.py
import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Form
from fastapi.responses import HTMLResponse
from sqlalchemy import extract, func
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from base64 import b64encode

import models
from database import get_db
from .auth import get_current_user
import recommender 
from schemas.users import UserOut
from schemas.events import AdminEventOut, EventBase, EventResponse, LineChartData, OrganizerOut

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


# ---------------- FORMS ----------------
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
        image_url: Optional[str] = Form(None),
    ):
        return cls(
            title=title,
            category=category,
            description=description,
            venue=venue,
            date=datetime.fromisoformat(date),
            ticket_price=ticket_price,
            capacity_max=capacity_max,
            image_url=image_url,
        )


# ---------------- ROUTES ----------------
@router.get("/events/stats")
def get_event_stats(db: Session = Depends(get_db)):
    total = db.query(models.Event).count()
    pending = db.query(models.Event).filter(
        models.Event.status == "Pending").count()
    approved = db.query(models.Event).filter(
        models.Event.status == "Approved").count()
    rejected = db.query(models.Event).filter(
        models.Event.status == "Rejected").count()

    return {"total": total, "pending": pending, "approved": approved, "rejected": rejected}


@router.get("/line-data", response_model=LineChartData)
def get_line_data(db: Session = Depends(get_db)):
    current_year = datetime.utcnow().year
    counts = (
        db.query(extract("month", models.Event.date).label(
            "month"), func.count(models.Event.id))
        .filter(extract("year", models.Event.date) == current_year)
        .group_by("month")
        .all()
    )
    monthly_counts = [0] * 12
    for month, count in counts:
        monthly_counts[int(month)-1] = count

    return LineChartData(
        labels=["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data=monthly_counts
    )


@router.get("/events/pending")
def get_pending_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).filter(
        models.Event.status == "Pending").all()
    result = [{"title": e.title, "status": e.status,
               "username": e.organizer.username} for e in events]
    return result


@router.get("/user/me", response_model=UserOut)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.get("/events/my", response_model=List[AdminEventOut])
def get_my_events(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    events = db.query(models.Event).filter(
        models.Event.organizer_id == current_user.id
    ).all()

    for e in events:
        if e.image_url and not e.image_url.startswith("/uploads/events/"):
            e.image_url = f"/uploads/events/{e.image_url}"

    return events


@router.get("/events", response_model=List[EventResponse])
async def read_events(db: Session = Depends(get_db)):
    events = (
        db.query(models.Event)
        .filter(models.Event.status == "Approved")
        .order_by(models.Event.created_at.desc())   # 👈 newest first
        .all()
    )
    return events

@router.get("/events/city/{city_name}", response_model=List[EventResponse])
def get_events_by_city(city_name: str, db: Session = Depends(get_db)):
    """
    Fetch only Approved events in a given city (case-insensitive),
    ordered by newest first.
    """
    events = (
        db.query(models.Event)
        .filter(
            models.Event.status == "Approved",
            models.Event.venue.ilike(f"%{city_name}%")   # case-insensitive
        )
        .order_by(models.Event.created_at.desc())       # newest first
        .all()
    )
    return events


@router.get("/events/all", response_model=List[AdminEventOut])
def get_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    return events


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


@router.post("/events", response_model=EventResponse)
async def create_event(
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
        raise HTTPException(
            status_code=400, detail="Ticket price must be positive")
    if form_data.capacity_max is not None and form_data.capacity_max < 0:
        raise HTTPException(
            status_code=400, detail="Capacity must be positive")

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


@router.delete("/delete_events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
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
@router.get("/recommend/me")
def recommend_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Return personalized weighted recommendations for the logged-in user.
    Call this endpoint with the user's Bearer token.
    """
    try:
        recs = recommender.recommend_for_user(current_user.id, top_n=5, db=db, rating_weight=1.0)
    except Exception as e:
        # avoid leaking internal details; log and return empty list or error as you prefer
        print("recommender error:", e)
        recs = []

    return {"user_id": current_user.id, "recommended": recs}

# Organiser name
@router.get("/events/{event_id}/organizer")
def get_organizer_name(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return  event.organizer.username