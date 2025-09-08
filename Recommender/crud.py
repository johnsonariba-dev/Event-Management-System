from sqlalchemy.orm import Session
from . import model, schema
from typing import List, Optional

def create_event(db: Session, event_in: schema.CreateEvent) -> model.Event:
    event = model.Event(title=event_in.title,
                        description=event_in.description,
                        organizer =event_in.organizer,
                        venue=event_in.venue,
                        ticket_price=event_in.ticket_price,
                        category=event_in.category,
                        capacity_max=event_in.capacity_max,
                        image_url=event_in.image_url)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def get_event(db: Session, event_id: int) -> Optional[model.Event]:
    return db.query(model.Event).filter(model.Event.id == event_id).first()

def list_events(db: Session, skip: int = 0, limit: int = 10) -> List[model.Event]:
    return db.query(model.Event).offset(skip).limit(limit).all()

