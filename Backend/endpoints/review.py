from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas.review import ReviewBase, ReviewCreate, Review
from endpoints.auth import get_current_user, get_current_organizer

router = APIRouter()


# -------------------------
# Create review
# -------------------------
@router.post("/review/{event_id}", response_model=Review, status_code=status.HTTP_201_CREATED)
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

    return Review.from_orm(new_review)


# -------------------------
# Get reviews for event
# -------------------------
@router.get("/events/{event_id}/reviews", response_model=List[Review])
def get_event_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.event_id == event_id).all()
    return [Review.from_orm(r) for r in reviews]


# -------------------------
# Update review
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

    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    if review_data.comment is not None:
        review.comment = review_data.comment
    if review_data.rating is not None:
        review.rating = review_data.rating

    db.commit()
    db.refresh(review)
    return Review.from_orm(review)


# -------------------------
# Delete review (by author)
# -------------------------
@router.delete("/review/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(review)
    db.commit()
    return None


# -------------------------
# Organizer: Get all reviews for their events
# -------------------------
@router.get("/organizer/reviews", response_model=List[Review])
def get_organizer_reviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_organizer),
):
    reviews = (
        db.query(models.Review)
        .join(models.Event)
        .filter(models.Event.organizer_id == current_user.id)
        .all()
    )
    return [Review.from_orm(r) for r in reviews]


# -------------------------
# Organizer reply to a review
# -------------------------
@router.put("/review/{review_id}/reply", response_model=Review)
def reply_to_review(
    review_id: int,
    reply: dict,   # expects {"reply": "..."}
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_organizer),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Only organizer of the event can reply
    if review.event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    review.reply = reply.get("reply")
    db.commit()
    db.refresh(review)
    return Review.from_orm(review)


# -------------------------
# Organizer delete a review
# -------------------------
@router.delete("/reviews/{review_id}")
def delete_review_as_organizer(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_organizer),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(review)
    db.commit()
    return {"detail": "Review deleted successfully"}
