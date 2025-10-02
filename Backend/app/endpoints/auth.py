from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import models
from database import get_db

#  JWT CONFIG 
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

#  PASSWORD CONTEXT 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#  OAUTH2 SCHEME 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

#  PASSWORD HELPERS 
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ------------------ JWT HELPERS ------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token_for_user(user: "models.User") -> str:
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
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> "models.User":
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalid or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    email = payload.get("sub")
    if not isinstance(email, str):
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    # attach role from token (to be consistent with frontend)
    role = payload.get("role")
    if role:
        user.role = role

    # attach id from token
    id = payload.get("id")
    if id:
        user.id = id

    return user


# ------------------ ROLE CHECKS ------------------
def require_role(*roles: str):
    def role_checker(current_user: "models.User" = Depends(get_current_user)):
        if current_user.role.lower() not in [r.lower() for r in roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden"
            )
        return current_user
    return role_checker


get_current_organizer = require_role("organizer", "admin")
get_current_admin = require_role("admin")
#  ROLE CHECKS 
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

# checks status
def get_user_id_from_token(token: str) -> int:
    try:
        payload = jwt.decode(token, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM)
        return int(payload.get("sub", {}).get("id"))

    except:
        raise HTTPException(status_code=401, detail="Token invalid")
