from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    city = Column(String)
    role = Column(String, default="user")  # "user" or "admin"
    posts = relationship("Post", back_populates="owner")


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    price = Column(Float, nullable=True)
    is_free = Column(Boolean, default=False)
    exchange_items = Column(String, nullable=True)
    allow_negotiation = Column(Boolean, default=False)
    state = Column(Enum("draft", "published", "unpublished", name="post_state"), default="draft")
    owner_id = Column(Integer, ForeignKey("users.id"))
    city = Column(String)
    images = relationship("PostImage", back_populates="post")

class PostImage(Base):
    __tablename__ = "post_images"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    image_url = Column(String, nullable=False)  # Store the image path/URL
    post = relationship("Post", back_populates="images")