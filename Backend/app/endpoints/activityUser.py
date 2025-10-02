# Endpoint to know activity of user(active/ unactive) for user
from typing import Dict
import models
from endpoints.auth import get_user_id_from_token
from database import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect

router = APIRouter()

# user_id -> WebSocket
connected_users: Dict[int, WebSocket] = {}
 
@router.websocket("/ws/status")
async def websocket_status(websocket : WebSocket):
    await websocket.accept()
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008) 
        return
    
    try:
        user_id = get_user_id_from_token(token)
    except HTTPException:
        await websocket.close(code=1008)
        return
    
    connected_users[user_id] = websocket

    try: 
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_users.pop(user_id, None)


@router.get("/connected_count")
async def get_connected_count(db: Session = Depends(get_db)):

    total_users = db.query(models.User).filter(models.User.role == "user").count()
    active_count = len(connected_users)
    inactive_count = total_users - active_count

    return {
        "total_users": total_users,
        "active_count":active_count,
        "inactive_count":inactive_count
        }

@router.get("/organizer/connected_count")
async def get_connected_count(db: Session = Depends(get_db)):

    total_users = db.query(models.User).filter(models.User.role == "organizer").count()
    active_count = len(connected_users)
    inactive_count = total_users - active_count

    return {
        "total_users": total_users,
        "active_count":active_count,
        "inactive_count":inactive_count
        }

@router.get("/user/{user_id}/status")
async def user_status(user_id: int):
    """Permet de vérifier l'état d'un user précis"""
    return {"user_id": user_id, "active": user_id in connected_users}
