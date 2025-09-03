import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine,Base
from models import Event 

fake = Faker()

# # Categories for events
CATEGORIES = ["music", "tech", "art", "business", "sports", "food"]

# Some sample cover images (replace with your real ones later)
COVER_IMAGES = [
    "https://source.unsplash.com/800x600/?concert",
    "https://source.unsplash.com/800x600/?art",
    "https://source.unsplash.com/800x600/?conference",
    "https://source.unsplash.com/800x600/?food",
    "https://source.unsplash.com/800x600/?sports",
    "https://source.unsplash.com/800x600/?technology",
]

# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Open session
db = SessionLocal()

# Clear old data
# db.query(Event).delete()
# db.commit()

events = []

# Generate 30 fake events
for _ in range(30):
    event = Event(
        title=fake.catch_phrase(),
        description=fake.text(max_nb_chars=150),
        category=random.choice(CATEGORIES),
        venue=fake.address().replace("\n", ", "),
        ticket_price=random.choice([0, round(random.uniform(10, 100), 2)]),  # free or paid
        # date=(datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),
        # date=fake.future_datetime(end_date="+30d"),  # ✅ déjà un datetime

        image_url=random.choice(COVER_IMAGES),
    )
    events.append(event)
    db.add(event)

db.commit()
db.close()

print("✅ Seeded 30 fake events into Planvibes.db")







# import sqlite3
# import random
# from datetime import datetime, timedelta
# from faker import Faker

# fake = Faker()

# # Categories for events
# CATEGORIES = ["music", "tech", "art", "business", "sports", "food"]

# # Some sample cover images (replace with your real ones later)
# COVER_IMAGES = [
#     "https://source.unsplash.com/800x600/?concert",
#     "https://source.unsplash.com/800x600/?art",
#     "https://source.unsplash.com/800x600/?conference",
#     "https://source.unsplash.com/800x600/?food",
#     "https://source.unsplash.com/800x600/?sports",
#     "https://source.unsplash.com/800x600/?technology",
# ]

# # Connect to SQLite
# conn = sqlite3.connect("events.db")
# cursor = conn.cursor()

# # Create table if not exists
# cursor.execute("""
# CREATE TABLE IF NOT EXISTS events (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     title TEXT,
#     description TEXT,
#     category TEXT,
#     venue TEXT,
#     ticket_price REAL,
#     date TEXT,
#     cover_image TEXT
# )
# """)

# # Clear old data (optional, comment if you don’t want reset)
# cursor.execute("DELETE FROM events")

# # Generate 30 fake events
# for _ in range(30):
#     title = fake.catch_phrase()
#     description = fake.text(max_nb_chars=150)
#     category = random.choice(CATEGORIES)
#     venue = fake.address().replace("\n", ", ")
#     ticket_price = random.choice([0, round(random.uniform(10, 100), 2)])  # free or paid
#     date = (datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d")
#     cover_image = random.choice(COVER_IMAGES)

#     cursor.execute("""
#         INSERT INTO events (title, description, category, venue, ticket_price, date, cover_image)
#         VALUES (?, ?, ?, ?, ?, ?, ?)
#     """, (title, description, category, venue, ticket_price, date, cover_image))

# conn.commit()
# conn.close()

# print("✅ Seeded 30 fake events into events.db")