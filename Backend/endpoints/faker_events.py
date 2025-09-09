import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine, Base
from models import Event

fake = Faker()

# # Categories for events
CATEGORIES = ["music", "tech", "art", "business", "sports", "food"]

COVER_IMAGES = [
    "https://images.unsplash.com/photo-1542124483-4b42e972a3e2",  # concert
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df",  # art event
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df",  # conference
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",  # food/festival
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",  # sports
    "https://images.unsplash.com/photo-1518770660439-4636190af475",  # technology
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
for _ in range(1000):
    event = Event(
        title=fake.catch_phrase(),
        description=fake.text(max_nb_chars=150),
        category=random.choice(CATEGORIES),
        venue=fake.address().replace("\n", ", "),
        ticket_price=random.choice(
            [0, round(random.uniform(10, 100), 2)]),  # free or paid
        date=fake.future_datetime(end_date="+30d"),  # ✅ déjà un datetime
        image_url=random.choice(COVER_IMAGES),
        capacity_max=100

        # date=(datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),

    )
    events.append(event)
    db.add(event)

db.commit()
db.close()

print("✅ Seeded 30 fake events into Planvibes.db")
