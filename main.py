from fastapi import FastAPI
# from database import init_db
import backend.database as database
from backend.auth_service import router as auth_router
from backend.post_service import router as post_router
from backend.negotiation_service import router as negotiation_router
from backend.chat_service import router as chat_router
from backend.admin_service import router as admin_router
from backend.payment_service import router as payment_router
from backend.upload_service.upload_service import router as upload_router

app = FastAPI()

# Initialize database tables
database.init_db()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(post_router, tags=["Posts"])
app.include_router(negotiation_router, tags=["Negotiations"])
app.include_router(chat_router, tags=["Chat"])
app.include_router(admin_router, tags=["Admin"])
app.include_router(payment_router, tags=["Payments"])
app.include_router(upload_router, tags=["Upload"])

@app.get("/")
def read_root():
    return {"message": "Marketplace API"}
