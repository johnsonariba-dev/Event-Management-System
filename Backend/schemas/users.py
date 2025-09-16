from typing import Optional
from pydantic import BaseModel,EmailStr


class CreateUser(BaseModel):
    username: str
    email:EmailStr
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    # password: str

    class Config:
        From_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
    email:Optional[EmailStr] = None
    password: Optional[str] = None



class Token(BaseModel):
    access_token: str  # JWT(JSON Web Token) token pour l'authentification
    token_type: str = "bearer"  # Type de token (bearer)
