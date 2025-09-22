
from dotenv import load_dotenv

from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from endpoints import event, user, ticket, like, paypal, review
from database import Base,engine
from endpoints import user


from fastapi import FastAPI, Depends

from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from endpoints import event, like, paypal, review, ticket, user, mtn 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from endpoints import event, like, paypal, review, ticket, user, mtn , dashboard, activityUser
from database import Base, engine
from seed import generate_fake_event  # your Faker generator


from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from endpoints import event, like, paypal, review, ticket, user
from database import Base, engine
from seed import generate_fake_event  # your Faker generator
from endpoints.auth_routes import router as auth_router  # your auth routes
from endpoints.auth import require_role, get_current_user  # role-based dependency


app = FastAPI(title="Event Management System", version="1.0.0")

# Create SQLite tables
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ---------------- Routers ----------------
app.include_router(auth_router, prefix="/auth", tags=["auth"])  # signup/login

# Existing routers
app.include_router(user.router, prefix="/user", tags=["user"]) 
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"]) 
app.include_router(like.router, tags=["like"]) 
app.include_router(paypal.router, tags=["paypal"]) 
app.include_router(review.router, tags=["review"])
app.include_router(mtn.router, tags=["mtn"]) 
app.include_router(event.router, tags=["event_fake"])
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"])
app.include_router(like.router,  tags=["like"])
app.include_router(paypal.router,  tags=["paypal"])
app.include_router(review.router,  tags=["review"])


app.include_router(event.router, tags=["event"])
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"])
app.include_router(like.router, tags=["like"])
app.include_router(paypal.router, tags=["paypal"])
app.include_router(review.router, tags=["review"])

# ---------------- Root ----------------
@app.get("/")
def root():
    return {"message": "Welcome to the Event Management System API!"}

app.include_router(dashboard.router, tags=["dashboard"]) 
app.include_router(activityUser.router, tags=["activityUser"]) 
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


