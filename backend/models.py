from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    city = Column(String)
    role = Column(String, default="user")  # "user" or "admin"
    posts = relationship("Post", back_populates="owner", cascade="all, delete")


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
    owner =  relationship("User", back_populates="posts")
    city = Column(String)
    
    # relationships
    images = relationship("PostImage", back_populates="post")
    views = relationship("PostView", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")

    def get_like_count(self):
        return len(self.likes)

    def get_view_count(self):
        return len(self.views)

class PostImage(Base):
    __tablename__ = "post_images"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    image_url = Column(String, nullable=False)  # Store the image path/URL
    post = relationship("Post", back_populates="images")
    
class PostView(Base):
    """Tracks unique views per user."""
    __tablename__ = "post_views"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    post = relationship("Post", back_populates="views")
    user = relationship("User")

    __table_args__ = (UniqueConstraint("post_id", "user_id", name="unique_post_view"),)


class PostLike(Base):
    """Tracks likes per user per post."""
    __tablename__ = "post_likes"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    post = relationship("Post", back_populates="likes")
    user = relationship("User")

    __table_args__ = (UniqueConstraint("post_id", "user_id", name="unique_post_like"),)