from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from typing import Annotated
from fastapi import Depends
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get the DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set in .env")

# Create the SQLAlchemy engine
# ⚡ Tune pool settings for Supabase free-tier (low connection limit)
engine = create_engine(
    DATABASE_URL,
    pool_size=5,           # keep only 5 connections
    max_overflow=0,        # don’t allow more
    pool_timeout=30,       # wait max 30s for a connection
    pool_recycle=1800,     # recycle every 30 mins
    pool_pre_ping=True     # check connections before using
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to inject session into FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Type alias for cleaner route annotations
db_dependency = get_db
