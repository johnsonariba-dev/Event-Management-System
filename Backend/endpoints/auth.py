<<<<<<< Updated upstream
<<<<<<< HEAD
# from datetime import datetime, timedelta, timezone
# from jose import JWTError,jwt
# from passlib.context import CryptContext
# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from sqlalchemy.orm import Session
# import models
# from database import get_db

# # Congiguration JWT
# SECRET_KEY = "your_secret_key"  
# ALGORITHM = "HS256"             
# ACCESS_TOKEN_EXPIRE_MINUTE = 60

# # Context pour le hashage des mots de passe
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

# # Scheme pour l'authentification OAuth2
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "login") 

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_pwd: str, hashed_pwd: str) -> bool:
#     return pwd_context.verify(plain_pwd, hashed_pwd)

# # Crée un JWT token
# def create_access_token(data: dict) -> str:
#     to_encode= data.copy() 
#     expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTE) 
#     to_encode.update({"exp": expire}) 
#     return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

# # Décode et vérifie un JWT token
# def decode_token(token: str):
#     try: 
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except JWTError:
#         return None
    
# # Obtient l'utilisateur courant à partir du token
# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    
#     credentials_expression = HTTPException(
#         status_code = status.HTTP_401_UNAUTHORIZED,
#         detail = "Token invalide ou expire",
#         headers = {"WWw-Authenticate": "Bearer"},
#     )

# # Décoder le token JWT
#     payload = decode_token(token)
#     if payload is None:
#         raise credentials_expression
    
#     email:str = payload.get("sub")
#     if email is None:
#         raise credentials_expression
    
#     user = db.query(models.User).filter(models.User.email == email).first()
#     if user is None:
#         raise credentials_expression
    
#     return user

# def get_current_organizer(
#         current_user: models.User = Depends(get_current_user) ) -> models.User:
    
#     # check if the user is the organizer
#     if current_user.role not in ["organizer","admin"]:
#         raise HTTPException(
#             status_code = status.HTTP_403_FORBIDDEN,
#             detail = "Access reserved for organizers"
#         )
#     return current_user

# async def get_current_admin(
#     current_user: models.User = Depends(get_current_user)
# ) -> models.User:
#     # check if the user is the admin
#     if current_user.role != "admin":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail = "Access reserved for admins"
#         )
#     return current_user

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
=======
# endpoints/auth.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
>>>>>>> b0ff3c1 (new install)
=======
# endpoints/auth.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
>>>>>>> Stashed changes
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import User

<<<<<<< Updated upstream
<<<<<<< HEAD
# ------------------ JWT CONFIG ------------------
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ------------------ PASSWORD CONTEXT ------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------ OAUTH2 SCHEME ------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ------------------ PASSWORD HELPERS ------------------
=======
# JWT & password hashing setup
SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------- JWT ----------------
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- Password utils ----------------
>>>>>>> b0ff3c1 (new install)
=======
# JWT & password hashing setup
SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------- JWT ----------------
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- Password utils ----------------
>>>>>>> Stashed changes
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

<<<<<<< Updated upstream
<<<<<<< HEAD
# ------------------ JWT HELPERS ------------------
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_access_token_for_user(user: models.User) -> str:
    """Generate token including role"""
    data = {"sub": user.email, "role": user.role}
    return create_access_token(data)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# ------------------ CURRENT USER ------------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expire",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    # attach role from token
    role = payload.get("role")
    if role:
        user.role = role

    return user

# ------------------ ROLE CHECKS ------------------
def get_current_organizer(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role not in ["organizer", "admin", "organiser"]:  # allow both spellings
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access reserved for organizers"
        )
    return current_user

async def get_current_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access reserved for admins"
        )
    return current_user
=======
# ---------------- Get current user ----------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if not user_email:  # checks for None or empty string
           raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------------- Role-based access ----------------
def require_role(*roles):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Access forbidden")
        return current_user
    return role_checker

get_current_organizer = require_role("organizer", "admin")
get_current_admin = require_role("admin")
>>>>>>> b0ff3c1 (new install)
=======
# ---------------- Get current user ----------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if not user_email:  # checks for None or empty string
           raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------------- Role-based access ----------------
def require_role(*roles):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Access forbidden")
        return current_user
    return role_checker

get_current_organizer = require_role("organizer", "admin")
get_current_admin = require_role("admin")
>>>>>>> Stashed changes
