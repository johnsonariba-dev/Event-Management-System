# recommender.py
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pickle
import os
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
import models  # your SQLAlchemy models
from sqlalchemy import func

PICKLE_FILE = "events_precomputed.pkl"
CSV_FILE = "events_for_recommender.csv"

# Load or Precompute
events_df = None
count_vec = None
count_matrix = None

if os.path.exists(PICKLE_FILE):
    with open(PICKLE_FILE, "rb") as f:
        data = pickle.load(f)
        events_df = data["events_df"]
        count_vec = data["count_vec"]
        count_matrix = data["count_matrix"]
    print("✅ Loaded precomputed data from Pickle.")
else:
    if os.path.exists(CSV_FILE):
        # Load data
        events_df = pd.read_csv(CSV_FILE)
        events_df = events_df.fillna("")

        # Combine text fields for recommendation
        events_df['combined'] = (
            events_df['title'].astype(str).str.lower() + " " +
            events_df['category'].astype(str).str.lower() + " " +
            events_df['description'].astype(str).str.lower()
        )

        # Precompute vectorizer & matrix
        count_vec = CountVectorizer(stop_words="english")
        count_matrix = count_vec.fit_transform(events_df['combined'])

        # Save everything in pickle
        with open(PICKLE_FILE, "wb") as f:
            pickle.dump({
                "events_df": events_df,
                "count_vec": count_vec,
                "count_matrix": count_matrix
            }, f)
        print("✅ Precomputed data saved to Pickle.")
    else:
        # don't raise here — allow functions to build from DB if available
        events_df = None
        count_vec = None
        count_matrix = None
        print("⚠️ No pickle or CSV found. recommender functions will attempt to build from DB when called.")


# Helpers
def _ensure_precomputed_from_db(db: Session):
    """
    Build events_df/count_vec/count_matrix from DB (used when CSV/pickle not available).
    This will include only textual fields necessary for the recommender.
    """
    global events_df, count_vec, count_matrix

    rows = []
    q = db.query(models.Event).filter(models.Event.status == "Approved").all()
    for ev in q:
        rows.append({
            "id": ev.id,
            "title": getattr(ev, "title", "") or "",
            "category": getattr(ev, "category", "") or "",
            "description": getattr(ev, "description", "") or "",
        })
    events_df = pd.DataFrame(rows).fillna("")
    events_df['combined'] = (
        events_df['title'].astype(str).str.lower() + " " +
        events_df['category'].astype(str).str.lower() + " " +
        events_df['description'].astype(str).str.lower()
    )
    count_vec = CountVectorizer(stop_words="english")
    count_matrix = count_vec.fit_transform(events_df['combined'])


def _get_avg_ratings_by_event(db: Session) -> Dict[int, float]:
    """
    Returns mapping event_id -> avg_rating (0-5). Uses Review model.
    """
    if db is None:
        return {}
    # use SQL avg to be efficient
    rows = db.query(models.Review.event_id, func.avg(models.Review.rating).label("avg")).group_by(models.Review.event_id).all()
    avg_map = {int(r[0]): float(r[1] or 0.0) for r in rows}
    return avg_map


# Recommendation Functions
def recommend_events(user_interests: List[str], top_n: int = 5, db: Optional[Session] = None, rating_weight: float = 1.0):
    """
    Recommend events based on user interests using precomputed data (pickle/CSV) or DB-built vectors.
    If `db` is provided, the function fetches average ratings and returns DB event objects (as dicts)
    sorted by final weighted score = similarity * (1 + avg_rating/5 * rating_weight).
    Returns list of dicts (id, title, category, ... , similarity, avg_rating, final_score).
    """
    global events_df, count_vec, count_matrix

    if not user_interests:
        return []

    # ensure precomputed data
    if events_df is None or count_vec is None or count_matrix is None:
        if db is None:
            raise RuntimeError("No precomputed data (pickle/CSV) and no DB session provided to build vectors.")
        _ensure_precomputed_from_db(db=db)

    user_text = " ".join(user_interests).lower()
    user_vec = count_vec.transform([user_text])
    similarity = cosine_similarity(user_vec, count_matrix).flatten()

    results = events_df.copy()
    results['score'] = similarity

    # apply rating weighting if db provided
    if db is not None and rating_weight and rating_weight > 0:
        avg_ratings = _get_avg_ratings_by_event(db)
        # default avg 0 if not present
        results['avg_rating'] = results['id'].apply(lambda x: float(avg_ratings.get(int(x), 0.0)) if pd.notna(x) else 0.0)
        results['final_score'] = results['score'] * (1.0 + (results['avg_rating'] / 5.0) * rating_weight)
    else:
        results['avg_rating'] = 0.0
        results['final_score'] = results['score']

    # get top N rows by final_score
    top = results.sort_values('final_score', ascending=False).head(top_n)

    # fetch events from DB to return canonical event fields (preserve ordering)
    recommended = []
    if db is not None:
        for _, row in top.iterrows():
            try:
                ev_id = int(row['id'])
            except Exception:
                continue
            ev = db.query(models.Event).filter(models.Event.id == ev_id).first()
            if not ev:
                continue
            recommended.append({
                "id": ev.id,
                "title": ev.title,
                "category": ev.category,
                "description": ev.description,
                "venue": ev.venue,
                "date": ev.date.isoformat() if hasattr(ev.date, "isoformat") else ev.date,
                "ticket_price": ev.ticket_price,
                "capacity_max": ev.capacity_max,
                "image_url": ev.image_url,
                "similarity": float(row['score']),
                "avg_rating": float(row['avg_rating']),
                "final_score": float(row['final_score']),
            })
    else:
        # db not provided: return dataframe rows as dicts (no DB fields beyond csv)
        for _, row in top.iterrows():
            r = row.to_dict()
            # drop combined column if present
            r.pop('combined', None)
            recommended.append(r)

    return recommended


def recommend_for_user(user_id: int, top_n: int = 5, db: Session = None, rating_weight: float = 1.0):
    """
    Build user interests from user's liked reviews (rating >= 4) and call recommend_events.
    Returns list of event dicts (same format as recommend_events with db).
    """
    if db is None:
        raise RuntimeError("recommend_for_user requires a DB session to read user's reviews.")

    user_reviews = db.query(models.Review).filter(models.Review.user_id == user_id).all()
    if not user_reviews:
        return []

    liked_events = []
    for r in user_reviews:
        # consider liked events rating >= 4
        if getattr(r, "rating", None) and r.rating >= 4:
            # try to get event; r.event relationship may exist, but use id defensively
            ev = None
            if getattr(r, "event", None):
                ev = r.event
            else:
                ev = db.query(models.Event).filter(models.Event.id == r.event_id).first()
            if ev:
                liked_events.append(ev)

    if not liked_events:
        return []

    user_interests = []
    for ev in liked_events:
        user_interests.append(ev.title or "")
        user_interests.append(ev.category or "")
        if ev.description:
            user_interests.append(ev.description)

    return recommend_events(user_interests, top_n=top_n, db=db, rating_weight=rating_weight)