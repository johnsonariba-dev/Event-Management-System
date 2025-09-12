from fastapi import APIRouter, Depends, HTTPException
from database import db_dependency, Session, get_db
import models
from schemas.review import ReviewCreate, Review

router = APIRouter()


@router.post("/review/{event_id}", response_model=Review)
def create_review(event_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    new_review = models.Review(
        username=review.username,
        comment=review.comment,
        rating=review.rating,
        event_id=event_id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

