from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from . import model, schema, crud, recommender
from .database import engine, Base, get_db

# Create DB tables (for demo; in prod use migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Events + Content-based Recommender")

@app.post("/events/", response_model=schema.EventResponse)
def create_event(event_in: schema.CreateEvent, db: Session = Depends(get_db)):
    ev = crud.create_event(db, event_in)
    # Optionally: trigger artifact rebuild asynchronously in production.
    # For simplicity, we rebuild artifacts immediately here (blocking).
    recommender.build_artifacts_from_db(db)
    return ev

@app.get("/events/", response_model=List[schema.EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.list_events(db, skip=skip, limit=limit)
    return items

@app.get("/recommend/{event_id}", response_model=List[schema.RecommendationItem])
def get_recommendations(event_id: int, top_n: int = 5):
    results = recommender.recommend_by_event_id(event_id, top_n=top_n)
    if not results:
        raise HTTPException(status_code=404, detail="No recommendations or event not found. Make sure artifacts are built.")
    return results

@app.post("/recompute")
def recompute_artifacts(db: Session = Depends(get_db)):
    recommender.build_artifacts_from_db(db)
    return {"status": "ok", "message": "Artifacts rebuilt."}

# if __name__ == "__main__":
#     uvicorn.run("Recommender.main:app", host="127.0.0.1", port=8000, reload=True)
