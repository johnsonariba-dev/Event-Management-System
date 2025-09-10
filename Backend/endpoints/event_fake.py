from endpoints.auth import get_current_organizer
from schemas.events import CreateEvent, EventResponse, EventUpdate, UserInterests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from recommender import recommend_events
from typing import List
from pydantic import BaseModel
from database import db_dependency, get_db
import models


router = APIRouter()


# Endpoint to fetch all events
@router.get("/events", response_model=List[EventResponse])
async def read_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

# Endpoint to fetch one event


@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: db_dependency):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Événement non trouvé"
        )
    return event

# Endpoint to create an event


@router.post("/event_fake/events", response_model=EventResponse)
async def create_events(db: db_dependency,
                        event: CreateEvent,
                        # current_user: models.User = Depends(get_current_organizer)
                        ):

    # check if the event exist
    existing_event = db.query(models.Event).filter(
        models.Event.title == event.title).first()
    if existing_event:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please this event already exist"
        )

    db_event = models.Event(
        title=event.title,
        description=event.description,
        category=event.category,
        venue=event.venue,
        ticket_price=event.ticket_price,
        date=event.date,
        image_url=event.image_url,
        capacity_max=event.capacity_max
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return (db_event)


# endpoint to update events

@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_update: EventUpdate, db: db_dependency):
    # Récupère l'événement existant
    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found")

    # Met à jour uniquement les champs fournis
    for key, value in event_update.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event

# endpoint to delete an event


@router.delete("/{event_id}")
async def delete_event(db: db_dependency, event_id: int):

    db_event = db.query(models.Event).filter(
        models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Événement non trouvé"
        )

    db.delete(db_event)
    db.commit()
    
@router.post("/recommendations", response_model=List[dict])
def recommend(user: UserInterests):
    """
    Recommend events based on user interests.
    """
    recommended_events = recommend_events(user.interests, top_n=5)
    return recommended_events

    
