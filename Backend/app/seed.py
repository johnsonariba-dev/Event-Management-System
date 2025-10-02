from faker import Faker
from datetime import datetime
import random
from database import SessionLocal, engine
from models import Event, Base

fake = Faker("en_US")

CAMEROON_CITIES = [
    "Yaoundé", "Douala", "Bamenda", "Bertoua", "Buea", "Ngaoundere",
    "Garoua", "Maroua", "Ebolowa", "Bafoussam"
]

CATEGORY_EVENTS = {
    
    "Music": [
        {
            "title": "Live Concert: {band} in {city}",
            "desc": "Join us for an unforgettable live concert in {city}, featuring {band}!",
            "images": [
                  "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "{city} Music Festival {year}",
            "desc": "Experience {city}'s most exciting music festival of {year}.",
            "images": [
                 "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
          ]
        },
        {
            "title": "Acoustic Night at {venue}",
            "desc": "Relax with soulful acoustic performances at {venue} in {city}.",
            "images": [
                 "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=600&q=80",  # concert lights
                 "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=600&q=80",  
                 ]
        },
        {
            "title": "Afrobeat Vibes {year} – {city}",
            "desc": "Dance to the rhythm of Afrobeat in the heart of {city}.",
            "images": [
                "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=600&q=80",  # piano
   "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=600&q=80",  # jazz saxophone
    
                ]
        },
        {
            "title": "Jazz Night Live",
            "desc": "A smooth evening of live jazz music in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",  # festival crowd
    
               ]
        },
        {
            "title": "{city} Orchestra Gala",
            "desc": "An elegant night with classical performances in {city}.",
            "images": [
                 "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",  # acoustic performance
    "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=600&q=80",  # jazz saxophone
   
                ]
        },
    ],
    "Tech": [
        {
            "title": "{city} Tech Summit {year}",
            "desc": "A unique opportunity to connect with innovators and developers in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Innovation Hackathon {year}",
            "desc": "Join teams at {venue} in {city} to build the future.",
            "images": [
             "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", 
                "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Future of AI Conference – {city}",
            "desc": "Discover how artificial intelligence is shaping industries in {city}.",
            "images": [
               "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
               "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Developers Meetup at {venue}",
            "desc": "An informal gathering of developers, coders, and techies.",
            "images": [
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Startup Demo Day {year}",
            "desc": "See the hottest new startups showcase their products in {city}.",
            "images": [
               "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
               "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
         ]
        },
        {
            "title": "Blockchain & Fintech Expo",
            "desc": "Learn about the latest in blockchain and fintech in {city}.",
            "images": [
               "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
               "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
        ]
        },
    ],
    "Sport": [
        {
            "title": "{city} Championship Finals",
            "desc": "Feel the adrenaline at the championship finals happening in {city}!",
            "images": [
                 "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Friendly Match: {team1} vs {team2}",
            "desc": "Catch the excitement as {team1} takes on {team2} at {venue}.",
            "images": [
                "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=600&q=80",
       
                 ]
        },
        {
            "title": "{city} International Marathon {year}",
            "desc": "Run through the streets of {city} in this year's marathon event.",
            "images": [
               "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80", 
    
                ]
        },
        {
            "title": "Sports Gala Night at {venue}",
            "desc": "A celebration of sporting excellence in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",  # football stadium

                ]
        },
        {
            "title": "Basketball League Playoffs",
            "desc": "Watch the top basketball teams battle for glory.",
            "images": [
                "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80", 
    
                ]
        },
        {
            "title": "Cycling Tour of {city}",
            "desc": "A thrilling cycling race across the city streets.",
            "images": [
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
   ]
        },
    ],
    "Art": [
        {
            "title": "Art Exhibition: {artist} & Friends",
            "desc": "Explore a collection of stunning artworks by {artist} in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1505664063603-28e48ca204eb?auto=format&fit=crop&w=600&q=80",
       ]
        },
        {
            "title": "{city} Art Festival {year}",
            "desc": "Celebrate art and culture in {city}'s biggest art festival of {year}.",
            "images": [
               "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
         ]
        },
        {
            "title": "Gallery Showcase: {artist} Collection",
            "desc": "A night of creativity featuring the works of {artist}.",
            "images": [
                     "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Street Art Celebration",
            "desc": "Discover vibrant street art performances in {city}.",
            "images": [
    "https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&w=600&q=80",  # art festival
    
                 ]
        },
        {
            "title": "Cultural Gala Night at {venue}",
            "desc": "A colorful evening celebrating tradition and art.",
            "images": [
                    "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=600&q=80", 
                "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=600&q=80",
                ]
        },
        {
            "title": "Photography Showcase {year}",
            "desc": "A visual feast of photography talent in {city}.",
            "images": [
               "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
         ]
        },
    ],
    "Business": [
        {
            "title": "{city} Entrepreneurs Forum {year}",
            "desc": "Connect with visionaries, leaders, and entrepreneurs in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Startup Pitch Night at {venue}",
            "desc": "Watch startups pitch groundbreaking ideas at {venue} in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
         ]
        },
        {
            "title": "Leadership Summit {year} – {city}",
            "desc": "Leaders come together in {city} to discuss the future of business.",
            "images": [
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
       
                  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
        ]
        },
        {
            "title": "Business Networking Cocktail",
            "desc": "An evening of networking and opportunities in {city}.",
            "images": [
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
          ]
        },
        {
            "title": "{city} Investors Roundtable",
            "desc": "Meet investors and entrepreneurs to discuss growth opportunities.",
            "images": [
                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
       ]
        },
        {
            "title": "Corporate Training Workshop",
            "desc": "A hands-on workshop designed for professionals in {city}.",
            "images": [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
                 ]
        },
    ]
}

def generate_fake_event(organizer_id=1):
    category = random.choice(list(CATEGORY_EVENTS.keys()))
    city = random.choice(CAMEROON_CITIES)
    venue = f"{fake.company()} Hall, {city}"

    event_template = random.choice(CATEGORY_EVENTS[category])

    title = event_template["title"].format(
        band=fake.company(),
        city=city,
        venue=venue,
        artist=fake.name(),
        team1=fake.city_suffix(),
        team2=fake.city_suffix(),
        year=datetime.now().year
    )
    title = f"{title} #{random.randint(1000, 9999)}"

    description = event_template["desc"].format(
        band=fake.company(),
        city=city,
        venue=venue,
        artist=fake.name(),
        team1=fake.city_suffix(),
        team2=fake.city_suffix(),
        year=datetime.now().year
    )

    extra = " ".join(fake.paragraphs(nb=random.randint(1, 3)))
    description = f"{description}\n\n{extra}"

    image_url = random.choice(event_template["images"])
    ticket_price = 0 if random.random() < 0.2 else round(random.uniform(1000, 20000), -2)

    return Event(
        title=title,
        category=category,
        description=description,
        venue=venue,
        date=fake.date_time_between(start_date="now", end_date="+90d"),
        ticket_price=ticket_price,
        capacity_max=random.randint(50, 500),
        image_url=image_url,
        status="Approved",
        organizer_id=organizer_id,
        created_at=fake.date_time_between(start_date="-60d", end_date="now")
    )

def seed_db(n=50):
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)  # makes sure tables exist

    for _ in range(n):
        event = generate_fake_event(organizer_id=1)
        db.add(event)

    db.commit()
    db.close()
    print(f"Seeded {n} fake events to the database.")

if __name__ == "__main__":
    seed_db(50)