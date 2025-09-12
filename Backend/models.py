from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# -------------------- USER --------------------


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, index=True, nullable=False)
    role = Column(String, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # created_at = Column(DateTime, default=datetime.utcnow)

 # Relations
    # event = relationship("Event", back_populates="organizer")   # "back_populates" fait référence à l'attribut dans la classe Message
    # ticket = relationship("Ticket", back_populates="user")

    # notification = relationship("Notification", back_populates="user")
    # message = relationship("MessageChat", back_populates="user")
    # preference = relationship("UserPreference", back_populates="user")
    like = relationship("Like", back_populates="user")

# -------------------- EVENT --------------------


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False, index=True)
    venue = Column(String(150), nullable=False, index=True)
    ticket_price = Column(Float, default=0.0, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    image_url = Column(String, nullable=True)
    capacity_max = Column(Integer, nullable=True)
    organizer_id = Column(Integer, ForeignKey(
        "users.id"), nullable=True, index=True)

    # Relations
    review = relationship("Review", back_populates="event",
                          cascade="all, delete-orphan")
    like = relationship("Like", back_populates="event")
    # organizer = relationship("User", back_populates="event")
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

# -------------------- REVIEW --------------------


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    comment = Column(Text, index=True)
    rating = Column(Integer)
    time = Column(DateTime, default=datetime.utcnow)

# Relations
    event = relationship("Event", back_populates="review")

# -------------------- LIKE --------------------


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)

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
