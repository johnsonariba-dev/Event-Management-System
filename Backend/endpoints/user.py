from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
import models
from database import get_db
from schemas.users import CreateUser, UserLogin, UserResponse, Token, UserUpdate
from endpoints.auth import create_access_token, hash_password, verify_password

router = APIRouter()

# Route pour le login


@router.post('/login', response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(
        models.User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "type_token": "bearer"}


# Route pour l'inscription
@router.post("/register", response_model = Token, status_code = status.HTTP_201_CREATED)
async def register(user: CreateUser, db: Session = Depends(get_db)):

    # Vérifie si l'email existe déjà
    existing_user = db.query(models.User).filter(
        models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email deja utilisee'
        )

    hashed_password = hash_password(user.password)
    db_user = models.User(email = user.email, hashed_password = hashed_password, username = user.username , role = user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Générer le JWT directement
    access_token = create_access_token(data = {"sub":user.email})

    return {"access_token": access_token, "token_type": "bearer"}
 

#Route to get accounts
@router.get("/users", response_model = List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


#Route to get accounts
@router.get("/{user_id}", response_model = UserResponse)
async def get_user(user_id : int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found"
        )
    return user

# Route to update user
@router.put("/{user_id}", response_model = UserResponse)

def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
   
    # Récupère l'événement existant
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found")

    # Met à jour uniquement les champs fournis
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user) 
    return user

# Route pour delete un account (admin)
@router.delete("/{user_id}")
async def delete_account(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Événement non trouvé"
        )

    db.delete(db_user)
    db.commit()
