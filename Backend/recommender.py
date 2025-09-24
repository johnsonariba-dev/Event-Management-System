from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd
import numpy as np

class Recommender:
    def __init__(self, events_df: pd.DataFrame):
        """
        events_df should have at least these columns:
        - 'id': event ID
        - 'title': event title
        - 'description': event description
        - 'category': event category
        - 'popularity': numeric score (optional)
        """
        self.events_df = events_df.fillna("")
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(
            self.events_df['title'] + " " + self.events_df['description']
        )
        self.cosine_sim = linear_kernel(self.tfidf_matrix, self.tfidf_matrix)
        self.indices = pd.Series(self.events_df.index, index=self.events_df['id']).to_dict()

    def recommend_similar(self, event_id: int, top_n: int = 5):
        if event_id not in self.indices:
            return []
        idx = self.indices[event_id]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = [s for s in sim_scores if s[0] != idx]  # exclude itself
        top_indices = [i[0] for i in sim_scores[:top_n]]
        return self.events_df.iloc[top_indices].to_dict(orient='records')

    def recommend_weighted(self, event_id: int, weight_column: str = 'popularity', top_n: int = 5):
        """
        Combine cosine similarity with a weight (popularity or rating)
        """
        if event_id not in self.indices or weight_column not in self.events_df.columns:
            return []
        idx = self.indices[event_id]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = [s for s in sim_scores if s[0] != idx]

        # Apply weighted score
        weighted_scores = [
            (i[0], i[1] * (1 + self.events_df.iloc[i[0]][weight_column]))
            for i in sim_scores
        ]
        weighted_scores = sorted(weighted_scores, key=lambda x: x[1], reverse=True)
        top_indices = [i[0] for i in weighted_scores[:top_n]]
        return self.events_df.iloc[top_indices].to_dict(orient='records')
