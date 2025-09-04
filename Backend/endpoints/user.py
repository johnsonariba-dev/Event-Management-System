from endpoints.auth import create_access_token, hash_password, verify_password
from schemas.users import CreateUser, UserLogin, UserResponse,Token
from fastapi import HTTPException, status, APIRouter
import models
from database import db_dependency

router = APIRouter()

# Route pour le login
@router.post('/login', response_model = Token)
async def login(login_data: UserLogin, db: db_dependency):

    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data = {"sub":user.email})

    return{"access_token": access_token, "type_token":"bearer"}

# Route pour l'inscription
@router.post("/register", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
async def register(user: CreateUser, db: db_dependency):

    # Vérifie si l'email existe déjà
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail = 'Email deja utilisee'
        )

    hashed_password = hash_password(user.password)
    db_user = models.User(email = user.email, hashed_password = hashed_password, username = user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user