from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List
from enum import Enum
from fastapi import Body, Form
from backend.database import SessionLocal
from backend.models import Post, User, PostImage
from backend.auth_service import get_current_user, get_db
from backend.upload_service.upload_service import save_image

router = APIRouter()

class PostState(str, Enum):
    draft = "draft"
    published = "published"
    unpublished = "unpublished"

class PostCreate(BaseModel):
    title: str
    description: str
    price: Optional[float] = None
    is_free: bool = False
    exchange_items: Optional[str] = None  # comma-separated list
    allow_negotiation: bool = False
    state: PostState = PostState.draft

@router.post("/posts")
def create_post(
    post_data: Optional[PostCreate] = Body(default=None),
    title: str = Form(...),
    description: str = Form(...),
    price: Optional[float] = Form(None),
    is_free: bool = Form(False),
    exchange_items: Optional[str] = Form(None),  # comma-separated list
    allow_negotiation: bool = Form(False),
    state: PostState = Form(PostState.draft),
    images: List[UploadFile] = File(None),  # ✅ Image Uploads
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)):
    new_post = None
    
    if post_data is not None:
        new_post = Post(
            title=post_data.title,
            description=post_data.description,
            price=post_data.price,
            is_free=post_data.is_free,
            exchange_items=post_data.exchange_items,
            allow_negotiation=post_data.allow_negotiation,
            state=post_data.state,
            owner_id=user.id,
            city=user.city
        )
    """ Creates a new post with image uploads. """
    if new_post is None:
        print("new_post is None")
        new_post = Post(
            title=title,
            description=description,
            price=price,
            is_free=is_free,
            exchange_items=exchange_items,
            allow_negotiation=allow_negotiation,
            state=state,
            owner_id=user.id,
            city=user.city
        ) 
    
    print(new_post.title)
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
        
    
        # Save and attach images
    if images and new_post:
        for image in images:
            image_path = save_image(image)
            db.add(PostImage(post_id=new_post.id, image_url=image_path))
        db.commit()
    
    return new_post

@router.get("/posts")
def get_posts(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.city == user.city, Post.state == "published").all()
    return posts

@router.patch("/posts/{post_id}")
def update_post(post_id: int, post_data: PostCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.owner_id == user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.title = post_data.title
    post.description = post_data.description
    post.price = post_data.price
    post.is_free = post_data.is_free
    post.exchange_items = post_data.exchange_items
    post.allow_negotiation = post_data.allow_negotiation
    post.state = post_data.state
    db.commit()
    db.refresh(post)
    return post
