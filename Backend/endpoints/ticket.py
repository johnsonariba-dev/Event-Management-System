import qrcode
from fpdf import FPDF
from io import BytesIO
from fastapi.responses import StreamingResponse
from fastapi import APIRouter

router = APIRouter()

@router.get("/ticket/{ticket_id}")
def generate_ticket(ticket_id: str):
    # 1. Generate QR code
    qr = qrcode.QRCode(box_size=10, border=4)
    qr.add_data(f"https://yourwebapp.com/verify?ticket={ticket_id}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    # Save QR code to memory
    qr_bytes = BytesIO()
    img.save(qr_bytes)
    qr_bytes.seek(0)

    # 2. Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Your Event Ticket", ln=True, align="C")
    pdf.ln(10)
    pdf.cell(0, 10, f"Ticket ID: {ticket_id}", ln=True)
    pdf.cell(0, 10, f"Event: Amazing Concert", ln=True)
    pdf.cell(0, 10, f"Date: 20th September 2025", ln=True)
    
    # Insert QR code image
    qr_bytes.seek(0)
    pdf.image(qr_bytes, x=80, y=60, w=50, h=50)

    # Output PDF to memory
    pdf_output = BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)

    return StreamingResponse(pdf_output, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=ticket_{ticket_id}.pdf"
    })

