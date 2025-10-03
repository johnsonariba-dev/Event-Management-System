from typing import List
from fastapi import Depends, FastAPI, HTTPException, Query, APIRouter
from fastapi.responses import StreamingResponse
from io import BytesIO
from fpdf import FPDF
import qrcode
from datetime import datetime, timedelta
from jose import jwt
import random
import models
from sqlalchemy.orm import Session
from database import get_db
from endpoints.auth import get_current_user
from schemas.ticket import TicketCreate, TicketOrganizerOut, TicketUserOut
import PIL

app = FastAPI()

router = APIRouter() 
# Secret key for JWT
SECRET_KEY = "YOUR_SUPER_SECRET_KEY"

# Mock Faker events DB (replace with your real Faker events)
FAKER_EVENTS = {
    "100": {
        "title": "AI Music Concert",
        "date": "2025-09-12",
        "time": "19:00",
        "venue": "Grand Arena",
        "organizer": "AI Events Hub",
        "ticket_price": 0,  # free
        "image_url": "https://example.com/banner.jpg",
    },
    "101": {
        "title": "Tech Workshop",
        "date": "2025-09-20",
        "time": "10:00",
        "venue": "Innovation Center",
        "organizer": "Tech Society",
        "ticket_price": 25.0,
        "image_url": None,
    },
}

@router.get("/generate-ticket/")
def generate_ticket(
    event_id: str = Query(..., description="ID of the event"),
    user_name: str = Query("Guest", description="Name of ticket holder")
):
    # 1️⃣ Validate event
    event = FAKER_EVENTS.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # 2️⃣ Generate unique ticket ID
    ticket_id = str(random.randint(100000, 999999))

    # 3️⃣ Generate JWT token (optional, for QR verification)
    payload = {"ticket_id": ticket_id, "event_id": event_id, "exp": datetime.utcnow() + timedelta(days=1)}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    # 4️⃣ Generate QR code
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data(f"https://yourapp.com/verify-ticket?token={token}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    qr_bytes = BytesIO()
    img.save(qr_bytes)
    qr_bytes.seek(0)

    # 5️⃣ Create PDF ticket
    pdf = FPDF()
    pdf.add_page()

    # Banner image if available
    if event.get("image_url"):
        try:
            import requests
            from PIL import Image
            response = requests.get(event["image_url"])
            banner = BytesIO(response.content)
            pdf.image(banner, x=10, y=10, w=190, h=50)
            pdf.ln(60)
        except:
            pdf.ln(10)

    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Your Event Ticket", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "", 14)
    pdf.cell(0, 8, f"Ticket ID: {ticket_id}", ln=True)
    pdf.cell(0, 8, f"Event: {event['title']}", ln=True)
    pdf.cell(0, 8, f"Date: {event['date']} {event['time']}", ln=True)
    pdf.cell(0, 8, f"Venue: {event['venue']}", ln=True)
    pdf.cell(0, 8, f"Organizer: {event['organizer']}", ln=True)
    pdf.cell(0, 8, f"Ticket Holder: {user_name}", ln=True)
    pdf.cell(0, 8, f"Price: £{event['ticket_price']}", ln=True)
    pdf.ln(10)

    # Insert QR code
    qr_bytes.seek(0)
    pdf.image(qr_bytes, x=80, y=pdf.get_y(), w=50, h=50)

    # Footer
    pdf.set_y(-20)
    pdf.set_font("Arial", "I", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, "Scan QR code at entrance. Ticket valid only once.", 0, 0, "C")

    # Output PDF
    pdf_output = BytesIO(pdf.output(dest='S'))  # no .encode()
    pdf_output.seek(0)


    return StreamingResponse(
        pdf_output,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ticket_{ticket_id}.pdf"}
    )


@router.get("/me", response_model=List[TicketUserOut])
def get_my_tickets(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    tickets = db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()
    return [
        TicketUserOut(
            id=t.id,
            event_id=t.event_id,
            event_title=t.event.title,
            quantity=t.quantity,
            price=t.price,
            purchase_date=t.purchase_date,
            venue = t.event.venue
        )
        for t in tickets
    ]


@router.get("/attendees", response_model=List[TicketOrganizerOut])
def get_organizer_tickets(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all tickets for events organized by the current user
    """
    # Get all events organized by this user
    events = db.query(models.Event).filter(models.Event.organizer_id == current_user.id).all()
    if not events:
        raise HTTPException(status_code=404, detail="No events found for this organizer")

    # Collect tickets for all these events
    tickets = []
    for event in events:
        event_tickets = db.query(models.Ticket).filter(models.Ticket.event_id == event.id).all()
        tickets.extend(event_tickets)
    return [
        TicketOrganizerOut(
            id=t.id,
            user_id=t.user.id,
            username=t.user.username,
            event_id=t.event.id,
            event_title=t.event.title,
            quantity=t.quantity,
            price=t.price,
            purchase_date=t.purchase_date
        )
        for t in tickets
    ]


#  CREATE TICKET 
@router.post("/tickets", response_model=TicketUserOut)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    event = db.query(models.Event).filter(models.Event.id == ticket.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db_ticket = models.Ticket(
        event_id=ticket.event_id,
        user_id=current_user.id,
        quantity=ticket.quantity,
        price=ticket.price or event.ticket_price, 
        purchase_date=datetime.utcnow(),
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    return TicketUserOut(
        id=db_ticket.id,
        event_id=event.id,
        event_title=event.title,
        quantity=db_ticket.quantity,
        price=db_ticket.price,
        purchase_date=db_ticket.purchase_date,
        total=db_ticket.price * db_ticket.quantity,
        organizer=event.organizer.username if event.organizer else None, 
        username=current_user.username,
    )