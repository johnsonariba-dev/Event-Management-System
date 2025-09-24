from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
from database import get_db
from sqlalchemy import func


router = APIRouter()

# total events
@router.get("/totalEvents")
async def total_events(db: Session = Depends(get_db)):
    return db.query(models.Event).count()

# total users
@router.get("/totalUsers")
async def totalUsers(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "user").count()

# total organizers
@router.get("/totalorganizers")
async def totalorganizers(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "organizer").count()

#total percentage of rating
@router.get("/rating")
async def rating(db: Session = Depends(get_db)):
    total_rating = db.query(models.Review).count()
    good_rating = db.query(models.Review).filter(models.Review.rating >= 3).count()
    percent = (good_rating / total_rating) * 100

    return percent

# total tickets and reviews by event
@router.get("/eventStats/{event_id}")
async def event_stats(event_id: int,db: Session = Depends(get_db)):
    results = (
        db.query(
            func.count(models.Ticket.id).label("total_tickets"),
            func.count(models.Review.id).label("total_reviews")
        )
        .outerjoin(models.Ticket, models.Ticket.event_id == models.Event.id)
        .outerjoin(models.Review, models.Review.event_id == models.Event.id)
        .filter(models.Event.id == event_id)
        .group_by(models.Event.id)
        .first()
    )
    if not results:
        raise HTTPException(status_code=404, detail="statistics not found")


    return {
            "total_tickets": r.total_tickets,
            "total_reviews": r.total_reviews
        }
    
