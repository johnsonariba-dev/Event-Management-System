from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


#  BASE 
class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: str = "user"

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2


#  CREATE 
class CreateUser(UserBase):
    password: str


#  LOGIN 
class UserLogin(BaseModel):
    email: EmailStr
    password: str


#  TOKEN 
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


#  USER RESPONSE 
class UserOut(UserBase):
    id: int
    email: str
    username: str
    phone: Optional[str] = None
    location: Optional[str] = None
    profile_pic: Optional[str] = None


class UserResponse(UserOut):
    created_at: Optional[datetime] = None 


#  USER UPDATE 
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# class Token(BaseModel):
#     access_token: str
#     token_type: str = "bearer"
#     role: str 
#     role: Optional[str] = None
#     phone: Optional[str] = None
#     location: Optional[str] = None
#     profile_pic: Optional[str] = None


#  ORGANIZER RESPONSE 
class OrganizerResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    date_event: Optional[datetime]
    events: int = 0
    revenue: float = 0.0

