from pydantic import BaseModel,EmailStr


class CreateUser(BaseModel):
    username: str
    email:EmailStr
    password: str

class UserLogin(BaseModel):
    email:EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email:EmailStr
    # password: str
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str  #JWT(JSON Web Token) token pour l'authentification
    token_type: str = "bearer" # Type de token (bearer)

