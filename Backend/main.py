from dotenv import load_dotenv

from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from endpoints import event_fake, user, ticket, like, paypal,review
from endpoints import event_fake, user, ticket, like
from database import Base,engine
from endpoints import user

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from endpoints import user
from endpoints import event_fake
from database import Base, engine
from sqlalchemy import text


app = FastAPI(title="Event Planner", version="1.0.0")


Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],

)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(event_fake.router, tags=["event"])
app.include_router(ticket.router, prefix="/ticket", tags=["ticket"])
app.include_router(like.router,  tags=["like"])
app.include_router(paypal.router,  tags=["paypal"])
app.include_router(review.router,  tags=["review"])

