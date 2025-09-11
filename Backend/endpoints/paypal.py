import os
import requests
from fastapi import APIRouter, HTTPException


router = APIRouter()

# Load credentials from environment
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")

print("CLIENT ID:", PAYPAL_CLIENT_ID)
print("SECRET:", PAYPAL_SECRET)

PAYPAL_BASE = "https://api-m.sandbox.paypal.com"  # Sandbox for testing


def get_access_token():
    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    print("Using credentials:", auth)
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    r = requests.post(f"{PAYPAL_BASE}/v1/oauth2/token",
                      headers=headers, data=data, auth=auth)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.json())
    return r.json()["access_token"]


@router.post("/create-order")
def create_order(amount: float):
    token = get_access_token()
    headers = {"Content-Type": "application/json",
               "Authorization": f"Bearer {token}"}
    data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {"amount": {"currency_code": "USD", "value": str(amount)}}
        ]
    }
    r = requests.post(f"{PAYPAL_BASE}/v2/checkout/orders",
                      json=data, headers=headers)
    if r.status_code != 201:
        raise HTTPException(status_code=r.status_code, detail=r.json())
    return r.json()


@router.post("/capture-order/{order_id}")
def capture_order(order_id: str):
    token = get_access_token()
    headers = {"Content-Type": "application/json",
               "Authorization": f"Bearer {token}"}
    r = requests.post(
        f"{PAYPAL_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)
    if r.status_code != 201:
        raise HTTPException(status_code=r.status_code, detail=r.json())
    return r.json()
