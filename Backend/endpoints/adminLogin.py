from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta
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
def login_user(request: LoginRequest):
    if request.email == DEFAULT_ADMIN_EMAIL and request.password == DEFAULT_ADMIN_PASSWORD:
        token_data = {
            "sub": request.email,
            "role": "admin"
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "role": "admin"}

    user = db.query(User).filter(User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token_data = {
        "sub": user.email,
        "role": user.role
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "role": user.role}