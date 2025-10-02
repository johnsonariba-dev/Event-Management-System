from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
import models

router = APIRouter()

# -------------------------------
# Total events
# -------------------------------
@router.get("/totalEvents")
async def total_events(db: Session = Depends(get_db)):
    try:
        return {"total_events": db.query(models.Event).count()}
    except Exception as e:
        # Fallback using raw SQL
        total = db.execute(text("SELECT COUNT(*) FROM event")).scalar()
        return {"total_events": total, "warning": "Fallback raw SQL used"}

# -------------------------------
# Total users
# -------------------------------
@router.get("/totalUsers")
async def total_users(db: Session = Depends(get_db)):
    try:
        return {"total_users": db.query(models.User).filter(models.User.role == "user").count()}
    except Exception as e:
        total = db.execute(text("SELECT COUNT(*) FROM user WHERE role='user'")).scalar()
        return {"total_users": total, "warning": "Fallback raw SQL used"}

# -------------------------------
# Total organizers
# -------------------------------
@router.get("/totalOrganizers")
async def total_organizers(db: Session = Depends(get_db)):
    try:
        return {"total_organizers": db.query(models.User).filter(models.User.role == "organizer").count()}
    except Exception as e:
        total = db.execute(text("SELECT COUNT(*) FROM user WHERE role='organizer'")).scalar()
        return {"total_organizers": total, "warning": "Fallback raw SQL used"}

# -------------------------------
# Percentage of good ratings
# -------------------------------
@router.get("/rating")
async def rating(db: Session = Depends(get_db)):
    try:
        total_rating = db.query(models.Review).count()
        good_rating = db.query(models.Review).filter(models.Review.rating >= 3).count()
    except Exception as e:
        if "no such column: reviews.time" in str(e):
            total_rating = db.execute(text("SELECT COUNT(*) FROM reviews")).scalar()
            good_rating = db.execute(text("SELECT COUNT(*) FROM reviews WHERE rating >= 3")).scalar()
        else:
            raise e

    # Type-safe conversion
    total_rating = total_rating or 0
    good_rating = good_rating or 0

    percent = (good_rating / total_rating * 100) if total_rating else 0
    return {"percent_good_rating": percent}

# -------------------------------
# Event-specific stats
# -------------------------------
@router.get("/eventStats/{event_id}")
async def event_stats(event_id: int, db: Session = Depends(get_db)):
    try:
        total_tickets = db.query(models.Ticket).filter(models.Ticket.event_id == event_id).count()
    except Exception as e:
        total_tickets = db.execute(
            text("SELECT COUNT(*) FROM ticket WHERE event_id=:eid"), {"eid": event_id}
        ).scalar()

    try:
        total_reviews = db.query(models.Review).filter(models.Review.event_id == event_id).count()
    except Exception as e:
        total_reviews = db.execute(
            text("SELECT COUNT(*) FROM reviews WHERE event_id=:eid"), {"eid": event_id}
        ).scalar()

    return {
        "total_tickets": total_tickets,
        "total_reviews": total_reviews
    }
