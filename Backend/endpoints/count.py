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

    
@router.get("/eventStats/{event_id}")
async def event_stats(event_id: int,db: Session = Depends(get_db)):
    
        # Get counts using separate queries (more reliable)
    total_tickets = db.query(models.Ticket).filter(models.Ticket.event_id == event_id).count()
    total_reviews = db.query(models.Review).filter(models.Review.event_id == event_id).count()

    return {
        "total_tickets": total_tickets,
        "total_reviews": total_reviews
    }
