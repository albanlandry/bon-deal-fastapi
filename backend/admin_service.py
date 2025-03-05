from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.auth_service import get_current_user, get_db
from backend.models import User, Post

router = APIRouter()

@router.delete("/admin/delete_post/{post_id}")
def delete_post(post_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

@router.post("/admin/ban_user/{user_id}")
def ban_user(user_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    banned_user = db.query(User).filter(User.id == user_id).first()
    if not banned_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(banned_user)
    db.commit()
    return {"message": "User banned"}
