from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

NKWA_API_KEY = os.getenv("NKWA_API_KEY")
NKWA_API_URL = os.getenv("NKWA_API_URL")

router = APIRouter()


class MTNPayment(BaseModel):
    phone: str
    amount: float


@router.post("/pay-mtn")
async def pay_mtn(payment: MTNPayment):
    """
    Initiate MTN payment via Nkwa API.
    """
    url = f"{NKWA_API_URL}/collect"

    headers = {
        "X-API-Key": NKWA_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "phoneNumber": f"237{payment.phone}",
        "amount": int(payment.amount),
        "callback_url": "https://abc123.ngrok.io/mtn-callback",
        "reference": f"txn_{uuid.uuid4().hex}"
    }

    print("DEBUG PAYLOAD:", payload)

    try:
        response = requests.post(url, headers=headers, json=payload)
        print(
            f"DEBUG STATUS: {response.status_code}, RESPONSE: {response.text}")

        if response.status_code not in (200, 201):
            raise HTTPException(
                status_code=response.status_code, detail=response.text)

        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mtn-callback")
async def mtn_callback(request: Request):
    """
    Receive MTN payment status updates from Nkwa.
    """
    try:
        data = await request.json()
        print(f"MTN Callback received: {data}")
        # Here you can update your database or payment status
        return {"message": "Callback received"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
