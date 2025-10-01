# scripts/create_tables.py
from database import engine, Base
import models  # importe les modèles pour enregistrer metadata

Base.metadata.create_all(bind=engine)
