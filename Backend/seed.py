from faker import Faker
from datetime import datetime
import random
from database import SessionLocal, engine
from models import Event, Base

fake = Faker("en_US")

# Categories
CATEGORIES = ["Music", "Tech", "Sport", "Art", "Business", "Religious"]

# Major cities in Cameroon
CAMEROON_CITIES = [
    "Yaoundé", "Douala", "Bamenda", "Limbe", "Buea", "Kribi",
    "Garoua", "Maroua", "Ebolowa", "Nkongsamba"
]

# Base image URLs per category (unique seed per event later)
CATEGORY_IMAGE_BASE = {
    "Music": "https://picsum.photos/seed/music{seed}/600/400",
    "Tech": "https://picsum.photos/seed/tech{seed}/600/400",
    "Sport": "https://picsum.photos/seed/sport{seed}/600/400",
    "Art": "https://picsum.photos/seed/art{seed}/600/400",
    "Business": "https://picsum.photos/seed/business{seed}/600/400",
    "Religious": "https://picsum.photos/seed/religious{seed}/600/400",
}

# Human-like templates per category
CATEGORY_DESCRIPTIONS = {
    "Music": "Join us for an unforgettable night of live performances, featuring {band} and other talented artists in {city}.",
    "Tech": "A unique opportunity to connect with innovators, developers, and tech leaders at {venue} in {city}.",
    "Sport": "Experience the thrill of competition at {venue}, bringing together athletes and fans from across Cameroon.",
    "Art": "Discover breathtaking works of art and meet the creative minds shaping culture in {city}.",
    "Business": "A professional gathering where leaders and entrepreneurs in {city} share ideas and opportunities.",
    "Religious": "A time of worship, fellowship, and spiritual growth at {venue}, open to all.",
}

def generate_event_description(category, city, venue):
    # Use template for realism
    template = CATEGORY_DESCRIPTIONS.get(category, "An amazing event awaits you.")
    base = template.format(
        band=fake.company(),
        city=city,
        venue=venue
    )
    # Add extra filler paragraphs for detail
    extra = " ".join(fake.paragraphs(nb=random.randint(2, 4)))
    return f"{base}\n\n{extra}"

def generate_fake_event(organizer_id=1):
    category = random.choice(CATEGORIES)
    city = random.choice(CAMEROON_CITIES)
    venue = f"{fake.company()} Hall, {city}"
    
    # 20% chance the event is free
    ticket_price = 0 if random.random() < 0.2 else round(random.uniform(1000, 20000), -2)
    
    # Generate description
    description = generate_event_description(category, city, venue)
    
    # Unique seed for image
    unique_seed = random.randint(1, 1000000)
    image_url = CATEGORY_IMAGE_BASE[category].format(seed=unique_seed)

    return Event(
        title=fake.catch_phrase(),
        category=category,
        description=description,
        venue=venue,
        date=fake.date_time_between(start_date="now", end_date="+90d"),
        ticket_price=ticket_price,
        capacity_max=random.randint(50, 500),
        image_url=image_url,
        status="Approved",
        organizer_id=organizer_id
    )


def seed_db(n=40):
    db = SessionLocal()
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    # Add fake events
    for _ in range(n):
        db.add(generate_fake_event(organizer_id=1))
    db.commit()
    db.close()
    print(f"Seeded {n} fake events to the database.")


if __name__ == "__main__":
    seed_db()
