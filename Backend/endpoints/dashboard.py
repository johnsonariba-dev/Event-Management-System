# Endpoint pour récupérer les événements en attente

from typing import List
from schemas.ticket import Ticket
from endpoints.auth import get_current_admin
from schemas.users import OrganizerResponse, UserUpdate
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session,joinedload
from sqlalchemy import func, desc
import models

router = APIRouter()

# Récupérer tous les organizers
@router.get("/admin/organizers", response_model=List[OrganizerResponse])
async def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)
):
    organizers = db.query(models.User).filter(models.User.role == "organizer").all()

    organizer_responses = []
    for organizer in organizers:

        # Compter les événements de cet organisateur
        events_count = db.query(models.Event).filter(
            models.Event.organizer_id == organizer.id
        ).count()

        date = db.query(models.Event.date).filter(models.Event.organizer_id == organizer.id).first()
        last_date = date[0] if date else None

    # Calculer le nbre de ticket
        ticket = db.query(models.Ticket).count()

        organizer_responses.append({
            "id": organizer.id,
            "username": organizer.username,
            "email": organizer.email,
            "events": events_count,
            "revenu": ticket,
            "date_event": last_date

            })

    return organizer_responses
    
# Récupérer tous les utilisateurs
@router.get("/admin/users")
async def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    users = (
        db.query(
            models.User.id,
            models.User.username,
            models.User.email,
            func.count(models.Ticket.id).label("Ticket_buy"),
            func.coalesce(func.sum(models.Event.ticket_price), 0).label("Total_sent")
        )
        .outerjoin(models.Ticket, models.User.id == models.Ticket.user_id)
        .outerjoin(models.Event, models.Ticket.event_id == models.Event.id)
        .filter(models.User.role == "user")
        .group_by(models.User.id)
        .all()
    )

    # Convertir en liste de dictionnaires
    users_summary = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "Ticket_buy": u.Ticket_buy,
            "Total_sent": float(u.Total_sent),
        }
        for u in users
    ]
    return users_summary



# Modifier un utilisateur
@router.put("/admin/users/{user_id}")
async def update_user(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id== user_id).first()
    if not user:
        raise HTTPException(
            status_code = 404,
            detail= " user not found"
        )
    if user_update.role:
        user.role = user_update.role
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.email is not None:
        user.email = user_update.email

    db.commit()
    db.refresh(user)
    return user


@router.delete("/admin/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}



# Récupérer toutes les réservations
@router.get("/admin/bookings", response_model=List[Ticket])
async def get_all_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    return db.query(models.Ticket).all()


# Annuler une réservation
@router.delete("/admin/bookings/{ticket_id}")
async def cancel_booking(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    booking = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not booking:
        raise HTTPException(status_code = 404, detail = "Booking nit found")
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled successfully"}


# Statistiques générales
@router.get("/admin/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user:models.User = Depends(get_current_admin)):
    total_users = db.query(models.User).count()
    total_events = db.query(models.Event).count()
    total_bookings = db.query(models.Ticket).count()
    pending_events = db.query(models.Event).filter(models.Event.status == "pending").count()
    approved_events = db.query(models.Event).filter(models.Event.status == "approved").count()
    rejected_events = db.query(models.Event).filter(models.Event.status == "rejected").count()

    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_bookings": total_bookings,
        "pending_events":pending_events,
        "approved_events":approved_events,
        "rejected_events":rejected_events
    }


# Événements les plus populaires
@router.get("/admin/reports/popular-events")
async def get_popular_events(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    return db.query(
        models.Event.title, 
        func.count(models.Ticket.id).label("bookings_count")
    ).join(models.Ticket).group_by(models.Event.id).order_by(desc("bookings_count")).limit(10).all()
