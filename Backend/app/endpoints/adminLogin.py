from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from jose import jwt
from passlib.context import CryptContext

from models import User

router = APIRouter()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Default admin credentials
DEFAULT_ADMIN_EMAIL = "planvibes@gmail.com"
DEFAULT_ADMIN_PASSWORD = "planvibes237" 

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/admin/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    # Find user (admin or normal)
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Verify password (always hashed check)
    if not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Generate token
    token_data = {"sub": user.email, "role": user.role}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "role": user.role}