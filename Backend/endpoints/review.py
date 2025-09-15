
from endpoints.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from database import db_dependency, SessionLocal as Session, get_db
import models
from schemas.review import ReviewCreate, Review

from typing import List
 
router = APIRouter()


# @router.post("/review/{event_id}", response_model=Review)
# def create_review(event_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
#     event = db.query(models.Event).filter(models.Event.id == event_id).first()
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")

#     new_review = models.Review(
#         username=review.user.username,
#         comment=review.comment,
#         rating=review.rating,
#         event_id=event_id
#     )
#     db.add(new_review)
#     db.commit()
#     db.refresh(new_review)
#     return new_review


@router.post("/review/{event_id}", response_model=Review)
def create_review(
    event_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # <-- user connecté
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    new_review = models.Review(
        user_id=current_user.id,     # on stocke l'id du user
        comment=review.comment,
        rating=review.rating,
        event_id=event_id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return Review(
         id=new_review.id,
        event_id=new_review.event_id,
        # user_id=new_review.user_id,
        username=new_review.user.username,
        comment=new_review.comment,
        rating=new_review.rating,  
    )

@router.get("/review", response_model=List[Review])
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(models.Review).all()
    # Transforme pour inclure username
    result = [
        Review(
            id=r.id,
            username=r.user.username if r.user else "Unknown",
            event_id=r.event_id,
            comment=r.comment,
            rating=r.rating
        ) for r in reviews
    ]
    return result


@router.get("/review/{review_id}", response_model=Review)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return Review(
        id=review.id,
        username=review.user.username if review.user else "Unknown",
        event_id=review.event_id,
        comment=review.comment,
        rating=review.rating
    )


@router.put("/review/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Only the author can update
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    review.comment = review_data.comment
    review.rating = review_data.rating

    db.commit()
    db.refresh(review)

    return Review(
        id=review.id,
        event_id=review.event_id,
        username=review.user.username,
        comment=review.comment,
        rating=review.rating
    )



@router.delete("/review/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Only the author can delete
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(review)
    db.commit()
    return None

