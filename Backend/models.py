from datetime import datetime
from sqlalchemy import (
    Column, Integer, LargeBinary, String, Float, ForeignKey, Text, DateTime, UniqueConstraint,func
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

# -------------------- USER --------------------
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String, default="user", nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    # Extra profile fields
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    profile_pic: Mapped[str | None] = mapped_column(String, nullable=True)

    # ✅ Relationships (always plural for collections)
    events = relationship("Event", back_populates="organizer", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")


# -------------------- EVENT -------------------
class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    venue: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    ticket_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    capacity_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Pending", nullable=False, index=True)
    organizer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(String(20), default="Pending", nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # ✅ Relationships
    organizer = relationship("User", back_populates="events")
    tickets = relationship("Ticket", back_populates="event", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="event", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="event", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="event", cascade="all, delete-orphan")




# -------------------- TICKET --------------------
class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    purchase_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # ✅ Relationships
    user = relationship("User", back_populates="tickets")
    event = relationship("Event", back_populates="tickets")


# -------------------- REVIEW --------------------
class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"))
    comment: Mapped[str] = mapped_column(Text)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    reply: Mapped[str | None] = mapped_column(String, nullable=True)
    time = Column(DateTime, default=datetime.utcnow) 
    # ✅ Relationships
    user = relationship("User", back_populates="reviews")
    event = relationship("Event", back_populates="reviews")


# -------------------- LIKE --------------------
class Like(Base):
    __tablename__ = "likes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(Integer, ForeignKey("events.id"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "event_id", name="unique_like"),)

    # ✅ Relationships
    user = relationship("User", back_populates="likes")
    event = relationship("Event", back_populates="likes")


# -------------------- NOTIFICATION --------------------
class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, index=True)
    message: Mapped[str] = mapped_column(Text, index=True)
    event_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("events.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


    # ✅ Relationship
    user = relationship("User", back_populates="notifications")
    event = relationship("Event", back_populates="notifications")



# -------------------- USER PREFERENCE --------------------
class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    preference: Mapped[str] = mapped_column(String, index=True)
    last_activity: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="preferences")

