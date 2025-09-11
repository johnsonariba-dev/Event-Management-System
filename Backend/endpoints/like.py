from fastapi import APIRouter, Depends, HTTPException
from database import db_dependency
import models 
from schemas.like import LikeCreate, LikeResponse
from endpoints.auth import get_current_user

router = APIRouter()

@router.post("/like", response_model = LikeResponse)
async def toggle_like(like: LikeCreate,
                      db:db_dependency,
                    #   current_user: models.User = Depends(get_current_user)):
                    current_user: models.User ):

    user_id = current_user.id
    event_id = like.event_id

    existing_like = db.query(models.Like).filter(user_id == user_id, event_id==event_id).first()
    
    if existing_like:
        db.delete(existing_like)
        db.commit()
        liked = False
    else:
        new_like = models.Like( user_id = user_id, event_id = event_id)
        db.add(new_like)
        db.commit
        liked = True

    total_like = db.query(models.Like).filter(event_id==event_id).count()
    return LikeResponse(event_id=event_id, liked_by_user=liked, total_like= total_like)


@router.get("events/${evend_id}/likes",response_model= LikeResponse)
async def get_likes(event_id : int, db:db_dependency,
                    current_user: models.User = Depends(get_current_user)):
    
    total_like = db.query(models.Like).filter(event_id==event_id).count()
    liked_by_user = db.query(models.Like).filter(models.Like.user_id == current_user.id, models.Like.event_id==event_id).first() is not None


    return LikeResponse(event_id=event_id, total_like=total_like, liked_by_user=liked_by_user)
