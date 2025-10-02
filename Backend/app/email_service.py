# email_service.py
from dotenv import load_dotenv
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import certifi
import requests

# Load environment variables
load_dotenv()
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

# Patch requests to use certifi CA bundle
requests.adapters.DEFAULT_CA_BUNDLE_PATH = certifi.where()

def send_email(to_email: str, subject: str, content: str):
    """
    Send an email using SendGrid.
    """
    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=to_email,
        subject=subject,
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ Email sent to {to_email}, status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Error sending email to {to_email}: {e}")
