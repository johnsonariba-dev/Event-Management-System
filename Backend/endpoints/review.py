from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from database import get_db

import models
from schemas.review import ReviewBase, ReviewCreate, Review
from endpoints.auth import get_current_user

router = APIRouter()


@router.post("/review/{event_id}", response_model=Review)
def create_review(
    event_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    new_review = models.Review(
        user_id=current_user.id,
        comment=review.comment,
        rating=review.rating,
        event_id=event_id,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return Review(
        id=new_review.id,
        event_id=new_review.event_id,
        username=new_review.user.username,
        comment=new_review.comment,
        rating=new_review.rating,
    )

@router.get("/events/{event_id}/reviews", response_model=List[Review])
def get_event_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.event_id == event_id).all()
    if not reviews:
        return []  # no reviews yet for this event

    result = [
        Review(
            id=r.id,
            username=r.user.username if r.user else "Unknown",
            event_id=r.event_id,
            comment=r.comment,
            rating=r.rating,
        )
        for r in reviews
    ]
    return result

       

@router.delete("/review/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(
        models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Only the author can delete
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this review"
        )

    db.delete(review)
    db.commit()
    return None
# -------------------------
@router.put("/review/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    review_data: ReviewBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Only the review author can update
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    # Update only provided fields
    if review_data.comment is not None:
        review.comment = review_data.comment
    if review_data.rating is not None:
        review.rating = review_data.rating

    db.commit()
    db.refresh(review)

    return Review(
        id=review.id,
        event_id=review.event_id,
        username=review.user.username,  # from relationship
        comment=review.comment,
        rating=review.rating,
        reply=review.reply
    )

# -------------------------
# Reply to review (organizer only)
# -------------------------
@router.put("/review/reply/{review_id}", response_model=Review)
def reply_review(
    review_id: int,
    reply: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    event = db.query(models.Event).filter(models.Event.id == review.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    print(f"[DEBUG] Current user id: {current_user.id}, Event organizer id: {event.organizer_id}")

    # Only the event organizer can reply
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to reply to this review")

    review.reply = reply
    db.commit()
    db.refresh(review)

    return Review(
        id=review.id,
        event_id=review.event_id,
        username=review.user.username,
        comment=review.comment,
        rating=review.rating,
        reply=review.reply
    )