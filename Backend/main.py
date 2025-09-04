from database import Base,engine
from endpoints import user,events
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "Event Planner", version = "1.0.0")

Base.metadata.create_all(bind = engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5175"],  # URL du frontend React
    allow_credentials=True,
    allow_methods=["*"], # Permet toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],
    expose_headers=["*"], # Expose tous les headers

)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(events.router, prefix="/events", tags=["events"])
