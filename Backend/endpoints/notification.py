from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from endpoints.auth import get_current_user
import models
from schemas.notification import UpdateOut, UpdateBase
from email_service import send_email

router = APIRouter()

@router.post("/{event_id}/updates", response_model=UpdateOut)
def post_update(
    event_id: int,
    request: UpdateBase,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(
        models.Event.id == event_id,
        models.Event.organizer_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")

    update = models.Notification(
        user_id=current_user.id,       
        title=f"Update for {event.title}",
        message=request.message,
        event_id=event_id
    )
    db.add(update)
    db.commit()
    db.refresh(update)

    tickets = db.query(models.Ticket).filter(models.Ticket.event_id == event_id).all()
    for ticket in tickets:
        
        notif = models.Notification(
            user_id=ticket.user_id,         
            title=f"Update for {event.title}", 
            message=request.message,
            event_id=event_id
        )
        db.add(notif)

        user = db.query(models.User).filter(models.User.id == ticket.user_id).first()
        if user:
            background_tasks.add_task(
                send_email,
                user.email,
                f"Update for {event.title}",
                request.message
            )

    db.commit()

    return update


from sqlalchemy.orm import joinedload
from sqlalchemy import distinct

@router.get("/notifications/my", response_model=List[UpdateOut])
def get_my_updates(
    db: Session = Depends(get_db),
    get_current_user: models.User = Depends(get_current_user),
):
    events = db.query(models.Event).filter(
        models.Event.organizer_id == get_current_user.id
    ).all()
    event_ids = [e.id for e in events]

    updates = (
        db.query(models.Notification)
        .filter(models.Notification.event_id.in_(event_ids))
        .order_by(models.Notification.created_at.desc())
        .all()
    )

    seen = set()
    unique_updates = []
    for u in updates:
        key = (u.message, u.event_id) 
        if key not in seen:
            seen.add(key)
            unique_updates.append(u)

    return unique_updates

