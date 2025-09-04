from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime



# -------------------- USER --------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

 # Relations
    # event = relationship("Event", back_populates="organizer")   # "back_populates" fait référence à l'attribut dans la classe Message
    # ticket = relationship("Ticket", back_populates="user")
    # review = relationship("Review", back_populates="user")
    # notification = relationship("Notification", back_populates="user")
    # message = relationship("MessageChat", back_populates="user")
    # preference = relationship("UserPreference", back_populates="user")

# -------------------- EVENT --------------------
class Event(Base):
    __tablename__= "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(Text, index=True)
    # date = Column(DateTime, index=True)
    date = Column(String, index=True)
    venue = Column(String, index=True)
    ticket_price = Column(Float, index=True)
    category = Column(String, index=True)
    image_url = Column(String)
    
    # status = Column(Boolean, default=True) # completed or not
    # attendees_count = Column(Integer, default=0)
    # organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

# Relations
    # organizer = relationship("User", back_populates="event")
    # ticket = relationship("Ticket", back_populates="event")
    # review = relationship("Review", back_populates="event")
    # update = relationship("Update", back_populates="event")
    # message = relationship("MessageChat", back_populates="event")

# -------------------- TICKET --------------------
class Ticket(Base):
    __tablename__= "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    status = Column(String)
    purchase_date = Column(DateTime, default=datetime.utcnow)

 # Relations
    # user = relationship("User", back_populates="ticket")
    # event = relationship("Event", back_populates="ticket")

# -------------------- REVIEW --------------------
class Review(Base):
    __tablename__="reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    comment = Column(Text, index=True)

# Relations
    # user = relationship("User", back_populates="review")
    # event = relationship("Event", back_populates="review")

# -------------------- NOTIFICATION --------------------
class Notification(Base):
    __tablename__="notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True)
    message = Column(Text, index=True)

# Relation
    # user = relationship("User", back_populates="notification")

# -------------------- USER PREFERENCES --------------------
class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    preference = Column(String, index=True)
    last_activity = Column(DateTime, default=datetime.utcnow)

    # Relation
    # user = relationship("User", back_populates="preference")

# -------------------- MESSAGE CHAT --------------------
class MessageChat(Base):
    __tablename__ = "messages_chat"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    message = Column(Text, nullable=False)
    type = Column(String)  # 'question' ou 'response'
    intent = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

# Relations
    # user = relationship("User", back_populates="messages")
    # event = relationship("Event", back_populates="messages")
