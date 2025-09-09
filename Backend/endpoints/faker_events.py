import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine, Base
from models import Event

fake = Faker()

# # Categories for events
CATEGORIES = ["music", "tech", "art", "business", "sports", "food"]

# Some sample cover images (replace with your real ones later)

COVER_IMAGES = [
    "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505842465776-3d90f616310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
]


# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Open session
db = SessionLocal()

# Clear old data
db.query(Event).delete()
db.commit()

events = []

# Generate 30 fake events
for _ in range(30):
    event = Event(
        title=fake.catch_phrase(),
        description=fake.text(max_nb_chars=150),
        category=random.choice(CATEGORIES),
        venue=fake.address().replace("\n", ", "),
        ticket_price=random.choice([0, round(random.uniform(10, 100), 2)]),  # free or paid
        date=fake.future_datetime(end_date="+30d"),  # ✅ déjà un datetime
        image_url=random.choice(COVER_IMAGES),
        capacity_max = 100,

        # date=(datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),

    )
    events.append(event)
    db.add(event)

db.commit()
db.close()

print("✅ Seeded 30 fake events into Planvibes.db")

