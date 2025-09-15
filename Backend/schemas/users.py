from dataclasses import Field
import re
from typing import Annotated, Optional
from pydantic import BaseModel,EmailStr,validator


PasswordType = Annotated[
    str,
    "Mot de passe d'au moins 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial" 
    
]

class CreateUser(BaseModel):
    username: str
    email:EmailStr
    password: PasswordType
    role: str

    @validator("password")
    def password_complexity(cls, v):
        # Vérifie longueur minimale
        if len(v) < 8:
            raise ValueError(
                "Le mot de passe doit contenir au moins 8 caractères."
            )
        # Vérifie majuscule, minuscule, chiffre et caractère spécial
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])'
        if not re.search(pattern, v):
            raise ValueError(
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
            )
        return v

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
