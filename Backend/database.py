from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Annotated
from fastapi import Depends


# URL de connexion à la base SQLite
DATABASE_URL = "sqlite:///./Planvibes.db"

# Création du moteur de base de données
engine = create_engine(DATABASE_URL, connect_args = {"check_same_thread": False})

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()
Base.metadata.create_all(bind=engine)

# Dépendance pour injecter la session dans les routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
