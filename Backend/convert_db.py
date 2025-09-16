import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load .env (optional, not really needed for SQLite unless you override path)
load_dotenv()

# Default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Path to save CSV
CSV_PATH = "events_for_recommender.csv"

# Create SQLAlchemy engine
if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

# Load events table into pandas
df = pd.read_sql("SELECT * FROM events", con=engine)

# Save to CSV
df.to_csv(CSV_PATH, index=False)

print(f"✅ Exported {len(df)} rows to {CSV_PATH}")
