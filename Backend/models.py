from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column

# -------------------- USER --------------------
class User(Base):
    __tablename__ = "users"

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

# -------------------- EVENT -------------------

class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    category: Mapped[str]
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    venue: Mapped[str]
    date: Mapped[datetime]
    ticket_price: Mapped[float]
    capacity_max: Mapped[int | None] = mapped_column(nullable=True)
    image_url: Mapped[str | None] = mapped_column(nullable=True)

    # Relations
    review = relationship("Review", back_populates="event",
                          cascade="all, delete-orphan")
    like = relationship("Like", back_populates="event")
    organizer = relationship("User", back_populates="event")
    organizer_id = Column(Integer, ForeignKey("users.id"))
    # ticket = relationship("Ticket", back_populates="event")
    # update = relationship("Update", back_populates="event")
    # message = relationship("MessageChat", back_populates="event")

# -------------------- TICKET --------------------
class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    purchase_date = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    comment = Column(Text, index=True)
    rating = Column(Integer)
    reply = Column(String, nullable=True) 
    # time = Column(DateTime, default=datetime.utcnow)

# Relations
    event = relationship("Event", back_populates="review")
    user = relationship("User", back_populates="review")

# -------------------- LIKE -------------------

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

# Un utilisateur ne peut liker un item qu’une seule fois
    __table_args__ = (UniqueConstraint(
        "user_id", "event_id", name="unique_like"),)

    user = relationship("User", back_populates="like")
    event = relationship("Event", back_populates="like")

# -------------------- NOTIFICATION --------------------
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True)
    message = Column(Text, index=True)

# -------------------- USER PREFERENCES --------------------


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    preference = Column(String, index=True)
    last_activity = Column(DateTime, default=datetime.utcnow)

# -------------------- MESSAGE CHAT --------------------
class MessageChat(Base):
    __tablename__ = "messages_chat"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    message = Column(Text, nullable=False)
    type = Column(String)
    intent = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

# Relations
    # user = relationship("User", back_populates="messages")
# event = relationship("Event", back_populates="messages”)
