from models import Ticket
from fastapi import APIRouter, Depends,HTTPException,Query
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

@router.get("/verify")
async def verify_ticket(db: Session = Depends(get_db),ticket_id: int = Query(...)):
    """
    Vérifie un ticket dans la base de données.
    """
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return {"ticket": db_ticket.id, "status": db_ticket.status}
