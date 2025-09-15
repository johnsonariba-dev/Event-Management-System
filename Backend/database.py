from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback to local SQLite if DATABASE_URL is not set
if not DATABASE_URL:
    print("⚠️ DATABASE_URL not found, falling back to local SQLite database")
    DATABASE_URL = "sqlite:///./local.db"

# Detect if using SQLite (different connection args)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
        pool_pre_ping=True
    )
else:
    # PostgreSQL / Supabase
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,          # keep only 5 connections
        max_overflow=0,       # don't allow more
        pool_timeout=30,      # wait max 30s for a connection
        pool_recycle=1800,    # recycle every 30 mins
        pool_pre_ping=True
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
