from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Event, Ticket, User
from auth import get_current_user, require_role

router = APIRouter(prefix="/api", tags=["API"])

# ---------------- Public access ----------------
@router.get("/events")
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return {"events": [e.title for e in events]}

# ---------------- User access ----------------
@router.get("/my-tickets")
def my_tickets(current_user: User = Depends(require_role("user", "organizer", "admin")), 
               db: Session = Depends(get_db)):
    tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).all()
    return {"tickets": [t.id for t in tickets]}

# ---------------- Organizer access ----------------
@router.post("/create-event")
def create_event(title: str, venue: str, date: str, category: str, 
                 current_user: User = Depends(require_role("organizer", "admin")), 
                 db: Session = Depends(get_db)):
    event = Event(title=title, venue=venue, date=date, category=category, organizer_id=current_user.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return {"msg": f"Event '{event.title}' created", "event_id": event.id}

# ---------------- Admin access ----------------
@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(require_role("admin")), 
                db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"msg": "User not found"}
    db.delete(user)
    db.commit()
    return {"msg": f"User {user_id} deleted by {current_user.username}"}
