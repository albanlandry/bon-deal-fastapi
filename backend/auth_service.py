from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, Field, constr
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

from backend.database import SessionLocal
from backend.models import User

router = APIRouter()

# Secret key for JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expiry time

# Security hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 token endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# === Password Utility Functions ===
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


# === JWT Token Functions ===
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# === Database Dependency ===
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """ Validates JWT and returns the authenticated user. """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user

# === Request Models ===
class UserCreate(BaseModel):
    username: str
    password: str = constr(min_length=8, pattern=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
    confirm_password: str
    city: str

class Token(BaseModel):
    access_token: str
    token_type: str

COOKIE_EXPIRE_MINUTES = 60  # Session valid for 1 hour

# === Authentication Logic ===
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """ Handles user signup with password verification. """
    if user.password != user.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, password=hashed_password, city=user.city)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), response: Response = None):
    """ Handles user login and returns JWT token. """
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.username})
    
    # Set HttpOnly cookie
    expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,         # Prevent JS access
        secure=False,          # Set to True in production (HTTPS)
        samesite="lax",        # Prevent CSRF attacks
        max_age=int(expire.total_seconds()),
        path="/"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def logout(response: Response):
    response.delete_cookie(key="token", path="/")
    return {"message": "Logged out"}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role
    }

# from fastapi import APIRouter, Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from passlib.context import CryptContext
# from pydantic import BaseModel
# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from sqlalchemy.orm import Session
# from backend.database import SessionLocal
# from backend.models import User
# import os

# router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "JWT_SECRET_KEY")  # replace with a secure key
# ALGORITHM = "HS256"

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class UserCreate(BaseModel):
#     username: str
#     password: str
#     city: str

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(username: str):
#     expire = datetime.utcnow() + timedelta(hours=2)
#     to_encode = {"sub": username, "exp": expire}
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise HTTPException(status_code=401, detail="Invalid token")
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")
#     user = db.query(User).filter(User.username == username).first()
#     if user is None:
#         raise HTTPException(status_code=401, detail="User not found")
#     return user

# @router.post("/signup")
# def signup(user: UserCreate, db: Session = Depends(get_db)):
#     if db.query(User).filter(User.username == user.username).first():
#         raise HTTPException(status_code=400, detail="User already exists")
#     hashed_password = get_password_hash(user.password)
#     new_user = User(username=user.username, password=hashed_password, city=user.city)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return {"message": "User registered successfully"}

# @router.post("/login", response_model=Token)
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     """
#     Authenticates a user and generates an access token for subsequent API requests.

#     Parameters:
#     form_data (OAuth2PasswordRequestForm): The username and password provided by the user.
#         This parameter is optional and has a default value of Depends().

#     db (Session): A database session object. This parameter is optional and has a default value of Depends(get_db).

#     Returns:
#     Token: A Token object containing the access token and token type.
#         If the authentication is successful, the access token is generated and returned.
#         If the authentication fails, an HTTPException with a status code of 400 and a detail message of "Invalid credentials" is raised.
#     """
#     user = db.query(User).filter(User.username == form_data.username).first()
#     if not user or not verify_password(form_data.password, user.password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")
#     token = create_access_token(user.username)
#     return Token(access_token=token, token_type="bearer")

