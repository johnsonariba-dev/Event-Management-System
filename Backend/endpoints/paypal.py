# routers/paypal.py
from dotenv import load_dotenv
import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

# Load environment variables
load_dotenv()

router = APIRouter()

# -------------------------
# Load credentials from environment
# -------------------------
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_BASE = "https://api-m.sandbox.paypal.com"  # Sandbox for testing

if not PAYPAL_CLIENT_ID or not PAYPAL_SECRET:
    raise RuntimeError("PAYPAL_CLIENT_ID and PAYPAL_SECRET must be set in environment variables.")


# -------------------------
# Pydantic schema for order creation
# -------------------------
class OrderCreate(BaseModel):
    amount: float  # Amount in USD


# -------------------------
# Helper function to get access token
# -------------------------
def get_access_token() -> str:
    if not PAYPAL_CLIENT_ID or not PAYPAL_SECRET:
        raise RuntimeError("Missing PayPal credentials")

    auth: tuple[str, str] = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}

    try:
        response = requests.post(f"{PAYPAL_BASE}/v1/oauth2/token", headers=headers, data=data, auth=auth)
        response.raise_for_status()
        return response.json()["access_token"]
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to get PayPal access token: {e}")


# -------------------------
# Create a PayPal order
# -------------------------
@router.post("/create-order")
def create_order(order: OrderCreate):
    """
    Create a PayPal order.
    Frontend should send JSON: { "amount": 23.5 }
    """
    token = get_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "intent": "CAPTURE",
        "purchase_units": [{"amount": {"currency_code": "USD", "value": f"{order.amount:.2f}"}}]
    }

    response: Optional[requests.Response] = None
    try:
        response = requests.post(f"{PAYPAL_BASE}/v2/checkout/orders", json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        status_code = response.status_code if response is not None else 500
        raise HTTPException(
            status_code=status_code,
            detail=f"Failed to create PayPal order: {e}"
        )


# -------------------------
# Capture a PayPal order
# -------------------------
@router.post("/capture-order/{order_id}")
def capture_order(order_id: str):
    """
    Capture a PayPal order.
    Frontend should pass the orderID from PayPal exactly.
    """
    token = get_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    response: Optional[requests.Response] = None
    try:
        # Correct endpoint for capturing an existing order
        response = requests.post(f"{PAYPAL_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        status_code = response.status_code if response is not None else 500
        raise HTTPException(
            status_code=status_code,
            detail=f"Failed to capture PayPal order: {e}"
        )
