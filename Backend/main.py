from models import User
from dotenv import load_dotenv
from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from endpoints import event, user, ticket, like, paypal, review,exportPDF,adminLogin,count, notification,mtn , dashboard, activityUser
from database import Base, SessionLocal,engine
from fastapi.security import OAuth2PasswordBearer 
from fastapi.staticfiles import StaticFiles 
from seed import generate_fake_event 
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from endpoints.auth_routes import router as auth_router 
from endpoints.auth import require_role, get_current_user 

app = FastAPI(title="Event Management System", version="1.0.0")
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ---------------- Routers ----------------
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/user", tags=["user"]) 
app.include_router(mtn.router, tags=["mtn"]) 
app.include_router(event.router, tags=["event_fake"])
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"])
app.include_router(like.router,  tags=["like"])
app.include_router(paypal.router,  tags=["paypal"])
app.include_router(review.router,  tags=["review"])
app.include_router(count.router,  tags=["count"])
app.include_router(event.router, tags=["event"])
app.include_router(exportPDF.router, tags=["exportPDF"])
app.include_router(notification.router, prefix="/events", tags=["notification"])
app.include_router(dashboard.router, tags=["dashboard"]) 
app.include_router(adminLogin.router, tags=["adminLogin"]) 
app.include_router(activityUser.router, tags=["activityUser"]) 
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "Welcome to the Event Management System API!"}

from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_ADMIN_EMAIL = "planvibes@gmail.com"
DEFAULT_ADMIN_PASSWORD = "planvibes237"

@app.on_event("startup")
def create_default_admin():
    """Ensure default admin exists when app starts"""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first()
        if not admin:
            hashed_pw = pwd_context.hash(DEFAULT_ADMIN_PASSWORD)
            admin = User(
                username = "Plan Vibes",
                email=DEFAULT_ADMIN_EMAIL,
                hashed_password=hashed_pw,
                role="admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("✅ Default admin created")
        else:
            print("ℹ️ Default admin already exists")
    finally:
        db.close()
