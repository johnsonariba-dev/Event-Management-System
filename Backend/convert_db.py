import sqlite3
import pandas as pd

DB_PATH = "Planvibes.db"
CSV_PATH = "events_for_recommender.csv"

# Connect to DB
conn = sqlite3.connect(DB_PATH)

# Load events table into pandas
df = pd.read_sql_query("SELECT * FROM events", conn)

# Save to CSV
df.to_csv(CSV_PATH, index=False)

conn.close()
print(f"✅ Exported {len(df)} rows to {CSV_PATH}")
