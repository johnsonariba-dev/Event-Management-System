from endpoints import event_fake
from database import Base,engine
from endpoints import user
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "Event Planner", version = "1.0.0")

Base.metadata.create_all(bind = engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
    expose_headers=["*"],

)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(event_fake.router, tags=["event_fake"])
