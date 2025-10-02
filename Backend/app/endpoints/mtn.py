from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# In-memory storage for payments
PAYMENTS = {}

NKWA_API_KEY = os.getenv("NKWA_API_KEY")
NKWA_API_URL = os.getenv("NKWA_API_URL")  # e.g., https://api.sandbox.pay.mynkwa.com
BASE_URL = os.getenv("BASE_URL")          # e.g., https://your-ngrok-url.ngrok-free.dev

class MobilePayment(BaseModel):
    phoneNumber: str  # 9-digit local number
    amount: int       # XAF
    method: str       # "mtn" or "orange"

@router.post("/pay-mobile")
async def pay_mobile(payment: MobilePayment):
    """
    Initiate MTN/Orange payment via Nkwa API.
    """
    if payment.method.lower() not in ["mtn", "orange"]:
        raise HTTPException(status_code=400, detail="Invalid method")

    reference = f"txn_{uuid.uuid4().hex}"
    payload = {
        "phoneNumber": f"237{payment.phoneNumber}",
        "amount": payment.amount,
        "reference": reference,
        "description": f"{payment.method.upper()} payment",
        "paymentType": "collection",
        "callback_url": f"{BASE_URL}/mtn-callback"
    }

    headers = {
        "X-API-Key": NKWA_API_KEY,
        "Content-Type": "application/json"
    }

    print("DEBUG: Sending payload to Nkwa:", payload)

    try:
        resp = requests.post(f"{NKWA_API_URL}/collect", json=payload, headers=headers)
        print(f"DEBUG: Nkwa response status: {resp.status_code}")
        print(f"DEBUG: Nkwa response body: {resp.text}")
        resp.raise_for_status()
        data = resp.json()

        # Store locally for polling
        PAYMENTS[reference] = {
            "status": "pending",
            "amount": payment.amount,
            "phone": payment.phoneNumber,
            "method": payment.method.lower(),
            "nkwa_id": data.get("id")
        }

        return {"id": data.get("id"), "reference": reference, "status": "pending"}

    except requests.HTTPError as e:
        detail = e.response.text if e.response else str(e)
        print("Nkwa API error:", detail)
        raise HTTPException(status_code=500, detail=detail)
    except requests.RequestException as e:
        print("Failed to reach Nkwa API:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/payment-status/{reference}")
async def payment_status(reference: str):
    """
    Check payment status by reference.
    """
    payment = PAYMENTS.get(reference)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    nkwa_id = payment.get("nkwa_id")
    headers = {"apiKeyAuth": NKWA_API_KEY}

    try:
        resp = requests.get(f"{NKWA_API_URL}/collect/{nkwa_id}", headers=headers)
        resp.raise_for_status()
        data = resp.json()
        payment["status"] = data.get("status")
        return {"status": payment["status"]}
    except requests.RequestException:
        return {"status": "pending"}


@router.api_route("/mtn-callback", methods=["GET", "POST"])
async def mtn_callback(request: Request):
    """
    Optional webhook for Nkwa to POST updates automatically.
    """
    try:
        if request.method == "POST":
            data = await request.json()
        else:
            data = {"method": "GET"}
        print("MTN Callback received:", data)
        return {"message": "Callback received"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
