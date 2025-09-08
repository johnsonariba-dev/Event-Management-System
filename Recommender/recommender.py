import os
import pickle
import json
from typing import List, Tuple
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from . import model

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)
SIM_PATH = os.path.join(ARTIFACTS_DIR, "similarity.pkl")
VECT_PATH = os.path.join(ARTIFACTS_DIR, "vectorizer.pkl")
INDEX_PATH = os.path.join(ARTIFACTS_DIR, "events_index.json")

def build_artifacts_from_db(db: Session, text_field: str = "description", max_features: int = 5000):
    """
    Reads events from DB, builds CountVectorizer, computes cosine similarity.
    Saves:
      - similarity matrix (pickle) for quick lookup
      - vectorizer (pickle)
      - events index JSON mapping index->id/title/description
    """
    # Load events into a DataFrame
    rows = db.query(model.Event).all()
    df = pd.DataFrame([{
        "id": r.id,
        "title": r.title,
        "description": (r.description or "") + " " + (r.title or "")
    } for r in rows])

    if df.empty:
        # save empty versions so the API can start gracefully
        with open(SIM_PATH, "wb") as f: pickle.dump(np.array([]), f)
        with open(VECT_PATH, "wb") as f: pickle.dump(None, f)
        with open(INDEX_PATH, "w") as f: json.dump([], f)
        return

    # Vectorize
    cv = CountVectorizer(max_features=max_features, stop_words='english')
    tf = cv.fit_transform(df['description']).toarray()  # shape: (n_events, n_features)

    # Cosine similarity
    sim = cosine_similarity(tf)

    # Save artifacts
    with open(SIM_PATH, "wb") as f:
        pickle.dump(sim, f)

    with open(VECT_PATH, "wb") as f:
        pickle.dump(cv, f)

    idx_list = df.to_dict(orient='records')  # includes id/title/description
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(idx_list, f, ensure_ascii=False, indent=2)

def load_artifacts():
    """Return (sim, vectorizer, index_list) — may return empty artifacts if none built"""
    import pickle, json
    sim = None; cv = None; index = []
    try:
        with open(SIM_PATH, "rb") as f:
            sim = pickle.load(f)
    except Exception:
        sim = np.array([])

    try:
        with open(VECT_PATH, "rb") as f:
            cv = pickle.load(f)
    except Exception:
        cv = None

    try:
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            index = json.load(f)
    except Exception:
        index = []

    return sim, cv, index

def recommend_by_event_id(event_id: int, top_n: int = 5) -> List[dict]:
    """
    Returns list of recommended items (id, title, description, score).
    Uses artifacts saved to artifacts/.
    """
    sim, cv, index = load_artifacts()
    if sim is None or len(index) == 0:
        return []

    # Build a mapping from event id to index
    id_to_idx = {int(it["id"]): idx for idx, it in enumerate(index)}
    if int(event_id) not in id_to_idx:
        return []

    idx = id_to_idx[int(event_id)]
    scores = list(enumerate(sim[idx]))
    # sort by score descending and skip the same event
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    results = []
    for i, score in scores[1: top_n + 1]:
        item = index[i]
        results.append({
            "id": item["id"],
            "title": item["title"],
            "description": item.get("description", ""),
            "score": float(score)
        })
    return results
