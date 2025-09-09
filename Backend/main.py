from endpoints import event_fake
from database import Base,engine
from endpoints import user
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Event

app = FastAPI(title = "Event Planner", version = "1.0.0")

Base.metadata.create_all(bind = engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5173"],  # URL du frontend React
    allow_credentials=True,
    allow_methods=["*"], # Permet toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],
    expose_headers=["*"], # Expose tous les headers

)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(event_fake.router, prefix="/event_fake", tags=["event_fake"])


