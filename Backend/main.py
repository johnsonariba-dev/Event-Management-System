from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from endpoints import event, like, paypal, review, ticket, user
from database import Base, engine
from seed import generate_fake_event  # your Faker generator


app = FastAPI(title="Event Management System", version="1.0.0")

# Create SQLite tables
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(event.router, tags=["event"]) 
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"]) 
app.include_router(like.router, tags=["like"]) 
app.include_router(paypal.router, tags=["paypal"]) 
app.include_router(review.router, tags=["review"])