from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pickle
import os

PICKLE_FILE = "events_precomputed.pkl"
CSV_FILE = "events_for_recommender.csv"

# ---------------- Load or Precompute ----------------
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

        # Ensure no NaN values
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
        raise FileNotFoundError(
            f"Neither Pickle nor CSV file found. Please generate '{CSV_FILE}' first."
        )

# ---------------- Recommendation Function ----------------
def recommend_events(user_interests: list, top_n=5):
    """
    Recommend events based on user interests using precomputed data.
    """
    if not user_interests:
        return []

    user_text = " ".join(user_interests).lower()
    user_vec = count_vec.transform([user_text])

    similarity = cosine_similarity(user_vec, count_matrix).flatten()

    # Create a copy with similarity scores
    results = events_df.copy()
    results['score'] = similarity

    # Sort and return top N (excluding combined column)
    recommended = results.sort_values('score', ascending=False).head(top_n)

    return recommended.drop(columns=['combined', 'score']).to_dict(orient='records')
