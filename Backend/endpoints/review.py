<<<<<<< Updated upstream
<<<<<<< Updated upstream
from fastapi import APIRouter, Depends, HTTPException
<<<<<<< HEAD
=======
from fastapi import APIRouter, Depends, HTTPException, status
>>>>>>> Stashed changes
from typing import List
=======
from database import db_dependency, get_db
=======
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
from sqlalchemy.orm import Session
from database import get_db

import models
from schemas.review import ReviewBase, ReviewCreate, Review
from endpoints.auth import get_current_organizer, get_current_user

router = APIRouter()


<<<<<<< Updated upstream
<<<<<<< Updated upstream
@router.post("/review/{event_id}", response_model=Review)
<<<<<<< HEAD
=======
def create_review(event_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
=======
=======
>>>>>>> Stashed changes
# -------------------------
# Create review
# -------------------------
@router.post("/review/{event_id}", response_model=Review, status_code=status.HTTP_201_CREATED)
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes
def create_review(
    event_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
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

<<<<<<< Updated upstream
<<<<<<< HEAD
    return Review(
        id=new_review.id,
        event_id=new_review.event_id,
        username=new_review.user.username,
        comment=new_review.comment,
        rating=new_review.rating,
    )


@router.get("/events/{event_id}/reviews", response_model=List[Review])
def get_event_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(
        models.Review.event_id == event_id).all()
    if not reviews:
        return []  # no reviews yet for this event
=======
    return Review.from_orm(new_review)


# -------------------------
# Get reviews for event
# -------------------------
@router.get("/events/{event_id}/reviews", response_model=List[Review])
def get_event_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.event_id == event_id).all()
    return [Review.from_orm(r) for r in reviews]
>>>>>>> Stashed changes


<<<<<<< Updated upstream

@router.delete("/review/{review_id}", status_code=204)
=======
<<<<<<< Updated upstream
=======
    return Review.from_orm(new_review)


# -------------------------
# Get reviews for event
# -------------------------
@router.get("/events/{event_id}/reviews", response_model=List[Review])
def get_event_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.event_id == event_id).all()
    return [Review.from_orm(r) for r in reviews]


=======
>>>>>>> Stashed changes
# -------------------------
# Delete review
# -------------------------
@router.delete("/review/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
<<<<<<< Updated upstream
<<<<<<< HEAD
    review = db.query(models.Review).filter(
        models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Only the author can delete
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this review"
        )
=======
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if getattr(review, "user_id") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
>>>>>>> b0ff3c1 (new install)
=======
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if getattr(review, "user_id") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
>>>>>>> Stashed changes

    db.delete(review)
    db.commit()
    return None
<<<<<<< Updated upstream
<<<<<<< HEAD
=======


# -------------------------
# Update review
>>>>>>> Stashed changes
# -------------------------


=======


# -------------------------
# Update review
# -------------------------
>>>>>>> b0ff3c1 (new install)
@router.put("/review/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    review_data: ReviewBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
<<<<<<< HEAD
    review = db.query(models.Review).filter(
        models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

<<<<<<< Updated upstream
    # Only the review author can update
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this review")
=======
    if getattr(review, "user_id") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")
>>>>>>> Stashed changes

    if review_data.comment is not None:
        setattr(review, "comment", review_data.comment)
    if review_data.rating is not None:
<<<<<<< Updated upstream
        review.rating = review_data.rating
=======
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if getattr(review, "user_id") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    if review_data.comment is not None:
        setattr(review, "comment", review_data.comment)
    if review_data.rating is not None:
        setattr(review, "rating", review_data.rating)
>>>>>>> b0ff3c1 (new install)
=======
        setattr(review, "rating", review_data.rating)
>>>>>>> Stashed changes

    db.commit()
    db.refresh(review)

<<<<<<< Updated upstream
<<<<<<< HEAD
    return Review(
        id=review.id,
        event_id=review.event_id,
        event_title=review.event_title,
        username=review.user.username,
        comment=review.comment,
        rating=review.rating,
        reply=review.reply,

    )
=======
    return Review.from_orm(review)

>>>>>>> Stashed changes


@router.get("/organizer/reviews", response_model=List[Review])
def get_organizer_reviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_organizer),
):
    # Fetch reviews for events owned by this organizer
    reviews = (
        db.query(models.Review)
        .join(models.Event)
        .filter(models.Event.organizer_id == current_user.id)
        .all()
    )

    return [
        Review(
            id=r.id,
            username=r.user.username if r.user else "Unknown",
            event_id=r.event_id,
            comment=r.comment,
            rating=r.rating,
            reply=r.reply,
        )
        for r in reviews
    ]


@router.put("/reviews/{review_id}/reply", response_model=Review)
def reply_to_review(
    review_id: int,
    reply: dict,   # expects {"reply": "..."} in JSON
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(
        models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Check ownership: only organizer of that event can reply
    if review.event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    review.reply = reply.get("reply")
    db.commit()
    db.refresh(review)
    return review


@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    review = db.query(models.Review).filter(
        models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Ownership check
    if review.event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(review)
    db.commit()
    return {"detail": "Review deleted successfully"}
=======
    return Review.from_orm(review)


# -------------------------
# Organizer reply to review
# -------------------------
@router.put("/review/reply/{review_id}", response_model=Review)
def reply_review(
    review_id: int,
    reply: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Get the review instance from DB
    review_instance = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review_instance:
        raise HTTPException(status_code=404, detail="Review not found")

    # Get the event instance from DB
    event_instance = db.query(models.Event).filter(models.Event.id == review_instance.event_id).first()
    if not event_instance:
        raise HTTPException(status_code=404, detail="Event not found")

    # ✅ Compare instance attributes, not class Column
    if getattr(event_instance, "organizer_id") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to reply to this review")

    # ✅ Assign reply to the DB instance
    review_instance.repl = reply
    db.commit()
    db.refresh(review_instance)

    # ✅ Return Pydantic model from DB instance
    return Review.from_orm(review_instance)
<<<<<<< Updated upstream
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes
