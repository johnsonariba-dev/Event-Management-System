from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column

# -------------------- USER --------------------
class User(Base):
    __tablename__ = "users"

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    # created_at = Column(DateTime, default=datetime.utcnow)

 # Relations
    # ticket = relationship("Ticket", back_populates="user")
    review = relationship("Review", back_populates="user")
    event = relationship("Event", back_populates="organizer")  
    # notification = relationship("Notification", back_populates="user")
    # message = relationship("MessageChat", back_populates="user")
    # preference = relationship("UserPreference", back_populates="user")
    like = relationship("Like", back_populates="user")
=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(index=True, nullable=False)
    role: Mapped[str] = mapped_column(default="user", nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
 
    # Relations
    events = relationship("Event", back_populates="organizer", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("MessageChat", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")

>>>>>>> Stashed changes

# -------------------- EVENT -------------------
class Event(Base):
    __tablename__ = "events"

<<<<<<< Updated upstream
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    category: Mapped[str]
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    venue: Mapped[str]
    date: Mapped[datetime]
    ticket_price: Mapped[float]
    capacity_max: Mapped[int | None] = mapped_column(nullable=True)
    image_url: Mapped[str | None] = mapped_column(nullable=True)
=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(index=True, nullable=False)
    role: Mapped[str] = mapped_column(default="user", nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
 
    # Relations
    events = relationship("Event", back_populates="organizer", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("MessageChat", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")


# -------------------- EVENT -------------------
class Event(Base):
    __tablename__ = "events"

=======
>>>>>>> Stashed changes
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    venue: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    ticket_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    capacity_max: Mapped[int] = mapped_column(Integer, nullable=True)
    image_url: Mapped[str] = mapped_column(String, nullable=True)
    organizer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
<<<<<<< Updated upstream
>>>>>>> Stashed changes

    # Relations
<<<<<<< HEAD
    review = relationship("Review", back_populates="event",
                          cascade="all, delete-orphan")
    like = relationship("Like", back_populates="event")
    organizer = relationship("User", back_populates="event")
    organizer_id = Column(Integer, ForeignKey("users.id"))
    # ticket = relationship("Ticket", back_populates="event")
    # update = relationship("Update", back_populates="event")
    # message = relationship("MessageChat", back_populates="event")
=======
=======

    # Relations
>>>>>>> Stashed changes
    organizer = relationship("User", back_populates="events")
    reviews = relationship("Review", back_populates="event", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="event", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="event", cascade="all, delete-orphan")
    messages = relationship("MessageChat", back_populates="event", cascade="all, delete-orphan")

<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes

# -------------------- TICKET --------------------
class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"), nullable=False)
    purchase_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="tickets")
    event = relationship("Event", back_populates="tickets")


# -------------------- REVIEW --------------------
class Review(Base):
    __tablename__ = "reviews"

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    comment = Column(Text, index=True)
    rating = Column(Integer)
    reply = Column(String, nullable=True) 
    # time = Column(DateTime, default=datetime.utcnow)
=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"))
    comment: Mapped[str] = mapped_column(String)
    rating: Mapped[int] = mapped_column(Integer, nullable=True)
    reply: Mapped[str] = mapped_column(String, nullable=True)
>>>>>>> Stashed changes

    # Relations
    user = relationship("User", back_populates="reviews")
    event = relationship("Event", back_populates="reviews")

<<<<<<< Updated upstream
<<<<<<< HEAD
# -------------------- LIKE -------------------
=======
# -------------------- LIKE --------------------

=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"))
    comment: Mapped[str] = mapped_column(String)
    rating: Mapped[int] = mapped_column(Integer, nullable=True)
    reply: Mapped[str] = mapped_column(String, nullable=True)
>>>>>>> b0ff3c1 (new install)

    # Relations
    user = relationship("User", back_populates="reviews")
    event = relationship("Event", back_populates="reviews")

>>>>>>> Stashed changes

=======

>>>>>>> Stashed changes
# -------------------- LIKE --------------------
class Like(Base):
    __tablename__ = "likes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"), nullable=False)

<<<<<<< Updated upstream
<<<<<<< HEAD
# Un utilisateur ne peut liker un item qu’une seule fois
=======
<<<<<<< Updated upstream
>>>>>>> b0ff3c1 (new install)
    __table_args__ = (UniqueConstraint(
        "user_id", "event_id", name="unique_like"),)
=======
=======
>>>>>>> Stashed changes
    __table_args__ = (UniqueConstraint("user_id", "event_id", name="unique_like"),)

    # Relations
    user = relationship("User", back_populates="likes")
    event = relationship("Event", back_populates="likes")
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes


# -------------------- NOTIFICATION --------------------
class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, index=True)
    message: Mapped[str] = mapped_column(Text, index=True)

    # Relations
    user = relationship("User", back_populates="notifications")


# -------------------- USER PREFERENCE --------------------
class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    preference: Mapped[str] = mapped_column(String, index=True)
    last_activity: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="preferences")


# -------------------- MESSAGE CHAT --------------------
class MessageChat(Base):
    __tablename__ = "messages_chat"

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    message = Column(Text, nullable=False)
    type = Column(String)
    intent = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
<<<<<<< HEAD

# Relations
    # user = relationship("User", back_populates="messages")
# event = relationship("Event", back_populates="messages”)
=======
=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=True)
    intent: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="messages")
    event = relationship("Event", back_populates="messages")
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=True)
    intent: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="messages")
    event = relationship("Event", back_populates="messages")
>>>>>>> Stashed changes
