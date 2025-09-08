from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    venue = Column(String(255), nullable=False)
    organizer = Column(String(255), nullable=False)
    ticket_price = Column(Integer, nullable=False)
    category = Column(String(100), nullable=False)
    capacity_max = Column(Integer, nullable=True, default=0)
    image_url = Column(String(255), nullable=True)
    date = Column(DateTime, nullable=False)  # <- changed to Date, no default
