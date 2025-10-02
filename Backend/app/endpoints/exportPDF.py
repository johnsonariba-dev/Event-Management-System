from fastapi import APIRouter, Response
from fpdf import FPDF
from io import BytesIO

router = APIRouter()

@router.get("/export-pdf")
def export_pdf():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Example content
    pdf.cell(200, 10, txt="Event Report", ln=True, align="C")
    pdf.ln(10)
    pdf.cell(60, 10, "Event: Tech Conference", ln=True)
    pdf.cell(60, 10, "Attendees: 120", ln=True)
    pdf.cell(60, 10, "Revenue: $3000", ln=True)

    # ✅ Use dest="S" to get PDF as string (latin1 encoded)
    pdf_bytes = pdf.output(dest="S").encode("latin1")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=report.pdf"}
    )
