import random
from faker import Faker
from datetime import datetime
from database import SessionLocal, engine, Base
from models import Event

fake = Faker()

# ---------------- Categories ----------------
CATEGORIES = ["music", "tech", "art", "business", "sports", "food"]

# ---------------- Image URLs per category ----------------
CATEGORY_IMAGES = {
    "music": [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1507874457473-8ff47d8d9e9f?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1507874457474-2a0f2d5f57df?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
    "tech": [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1526378725258-4bfb2e12980f?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
    "art": [
        "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1473187983305-f615310e7daa?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1487014679447-9f8336841d58?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
    "business": [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1531497865144-046bfcda53d3?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
    "sports": [
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1507038730604-0e51aab6e43b?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
    "food": [
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?crop=entropy&cs=tinysrgb&fit=max&w=800",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&w=800",
    ],
}

# ---------------- Helpers ----------------
def get_random_image(category):
    images = CATEGORY_IMAGES.get(category, [])
    if not images:
        return "https://via.placeholder.com/400x300?text=Event"
    return random.choice(images)

# ---------------- Main ----------------
# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Open session
db = SessionLocal()

# Clear old data
db.query(Event).delete()
db.commit()

# Generate 100 fake events
for _ in range(100):
    category = random.choice(CATEGORIES)
    image_url = get_random_image(category)
    
    event = Event(
        title=fake.catch_phrase(),
        description=fake.text(max_nb_chars=150),
        category=category,
        venue=fake.address().replace("\n", ", "),
        ticket_price=random.choice([0, round(random.uniform(10, 100), 2)]),
        date=fake.future_datetime(end_date="+30d"),
        image_url=image_url,  # make sure this matches your Event model
        capacity_max=100,
         organizer_id=1,
    )
    db.add(event)

db.commit()
db.close()
print("✅ Seeded 100 fake events with category images")
