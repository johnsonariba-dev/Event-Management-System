from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.responses import StreamingResponse
from io import BytesIO
from fpdf import FPDF
import qrcode
from datetime import datetime, timedelta
import jwt
import random

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
