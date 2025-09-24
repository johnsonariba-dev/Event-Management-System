from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from .users import CreateUser
from .events import EventCreate

# Schema create/base ticket   

class CreateTicket(BaseModel):
    event_id: int
    nb_place: int = 1
    price: float


# schema de lecture
class Ticket(CreateTicket):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    status: str
    purchase_date: datetime
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# Schéma pour la mise à jour
class TicketUpdate(BaseModel):
    status: Optional[str] = None
    nb_places: Optional[int] = None
    price: Optional[float] = None


# Schéma avec relations
class TicketWithRelations(Ticket):
    utilisateur: Optional[CreateUser] = None
    evenement: Optional[EventCreate] = None



# USER
class TicketUserOut(BaseModel):
    id: int
    event_id: int
    event_title: str
    quantity: int
    price: float
    purchase_date: datetime

    class Config:
        orm_mode = True


# ORGANIZER
class TicketOrganizerOut(BaseModel):
    id: int
    user_id: int
    username: str
    event_id: int
    event_title: str
    quantity: int
    price: float
    purchase_date: datetime

    class Config:
        orm_mode = True


# CREATE TICKET
class TicketCreate(BaseModel):
    event_id: int
    quantity: int = 1
    price: float = 0.0

    class Config:
        orm_mode = True
