from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.auth_service import get_current_user, get_db
from backend.models import Post
from sqlalchemy.exc import NoResultFound

router = APIRouter()

class PriceProposal(BaseModel):
    post_id: int
    price: float

# In a real app, you would persist negotiations in a dedicated table.
negotiations_db = []

@router.post("/negotiations")
def propose_price(proposal: PriceProposal, user=Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == proposal.post_id).first()
    if not post or not post.allow_negotiation:
        raise HTTPException(status_code=400, detail="Negotiation not allowed for this post")
    negotiations_db.append({
        "post_id": proposal.post_id,
        "buyer": user.username,
        "price": proposal.price
    })
    return {"message": "Proposal submitted"}
