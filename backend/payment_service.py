from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import stripe
import os
from backend.auth_service import get_current_user

router = APIRouter()

# Configure Stripe API key (ensure this is set in your environment)
stripe.api_key = os.getenv("JWT_SECRET_KEY", "your_stripe_secret_key")

class PaymentRequest(BaseModel):
    amount: int  # amount in cents
    currency: str = "usd"
    description: str = "Payment"

@router.post("/create-payment-intent")
def create_payment_intent(payment: PaymentRequest, user=Depends(get_current_user)):
    try:
        intent = stripe.PaymentIntent.create(
            amount=payment.amount,
            currency=payment.currency,
            description=payment.description,
            metadata={"user": user.username}
        )
        return {"clientSecret": intent["client_secret"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
