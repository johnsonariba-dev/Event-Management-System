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
    # Ensure organizer owns the event
    event = db.query(models.Event).filter(
        models.Event.id == event_id,
        models.Event.organizer_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")

    # 1️⃣ Save the update separately
    update = models.Notification(
        user_id=current_user.id,        # Optional: organizer sees own update
        title=f"Update for {event.title}",
        message=request.message,
        event_id=event_id
    )
    db.add(update)
    db.commit()
    db.refresh(update)

    # 2️⃣ Notify attendees
    tickets = db.query(models.Ticket).filter(models.Ticket.event_id == event_id).all()
    for ticket in tickets:
        # Directly use ticket.user_id to avoid None
        notif = models.Notification(
            user_id=ticket.user_id,           # ✅ always exists
            title=f"Update for {event.title}", # ✅ title from event
            message=request.message,
            event_id=event_id
        )
        db.add(notif)

        # Send email asynchronously
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
