from typing import List
<<<<<<< HEAD
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
from models import User
from database import get_db
from schemas.users import CreateUser, UserLogin, UserOut, UserResponse, Token, UserUpdate
from endpoints.auth import create_access_token, get_current_user, hash_password, verify_password
=======
<<<<<<< Updated upstream
from endpoints.auth import create_access_token, hash_password, verify_password
from schemas.users import CreateUser, UserLogin, UserResponse,Token, UserUpdate
from fastapi import HTTPException, status, APIRouter
import models
from database import db_dependency
=======
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
from models import User
from database import get_db
from schemas.users import CreateUser, UserLogin, UserResponse, Token, UserUpdate
from endpoints.auth import create_access_token, hash_password, verify_password
from endpoints.auth import get_current_user, get_current_organizer, get_current_admin


<<<<<<< Updated upstream
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
>>>>>>> Stashed changes

router = APIRouter()

@router.get("/me", response_model=UserOut)
async def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user

<<<<<<< Updated upstream
@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):

<<<<<<< HEAD
    # 1. Get user from DB
    user = db.query(models.User).filter(
        models.User.email == login_data.email).first()
=======
<<<<<<< Updated upstream
@router.post('/login', response_model=Token)
async def login(login_data: UserLogin, db: db_dependency):
=======
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Query the user from the database
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
>>>>>>> Stashed changes

    if not user:   # make sure user exists
        raise HTTPException(status_code=401, detail="Invalid credentials")
>>>>>>> b0ff3c1 (new install)

    # Use the submitted password (form_data.password) and the hashed password from the database
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

<<<<<<< HEAD
    # 2. Create JWT with role included
    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role  # include the role
        }
    )
=======

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Query the user from the database
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user:   # make sure user exists
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Use the submitted password (form_data.password) and the hashed password from the database
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token including role
    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }
>>>>>>> Stashed changes

    # 3. Return token
    return {
        "access_token": access_token,
        "token_type": "bearer"
=======
    # Create JWT token including role
    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
>>>>>>> b0ff3c1 (new install)
    }



@router.get("/profile")
def profile(user = Depends(get_current_user)):
    return {"email": user.email, "role": user.role}


@router.post("/events/create")
def create_event(user = Depends(get_current_organizer), db: Session = Depends(get_db)):
    # Organizer-only page to create events
    return {"msg": f"Event created by {user.email}"}


@router.get("/admin/dashboard")
def dashboard(user = Depends(get_current_admin)):
    return {"msg": f"Welcome to admin dashboard, {user.email}"}


@router.get("/profile")
def profile(user = Depends(get_current_user)):
    return {"email": user.email, "role": user.role}


@router.post("/events/create")
def create_event(user = Depends(get_current_organizer), db: Session = Depends(get_db)):
    # Organizer-only page to create events
    return {"msg": f"Event created by {user.email}"}


@router.get("/admin/dashboard")
def dashboard(user = Depends(get_current_admin)):
    return {"msg": f"Welcome to admin dashboard, {user.email}"}

# Route pour l'inscription
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
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
    db_user = models.User(email=user.email, hashed_password=hashed_password,
                          username=user.username, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Générer le JWT directement
<<<<<<< Updated upstream
<<<<<<< HEAD
    access_token = create_access_token(data={"sub": user.email})
=======
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
>>>>>>> b0ff3c1 (new install)
=======
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
>>>>>>> Stashed changes

    return {"access_token": access_token, "token_type": "bearer"}


# Route to get accounts
@router.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


# Route to get accounts
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found"
        )
    return user

# Route to update user
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
@router.put("/{user_id}", response_model = UserResponse)
>>>>>>> b0ff3c1 (new install)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):

    # Récupère l'événement existant
=======
=======
>>>>>>> Stashed changes
@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Only allow if admin or the user themselves
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# Route pour delete un account (admin)


@router.delete("/{user_id}")
<<<<<<< Updated upstream
<<<<<<< HEAD
async def delete_account(user_id: int, db: Session = Depends(get_db)):
=======
<<<<<<< Updated upstream
async def delete_account(user_id: int, db: db_dependency):
=======
async def delete_account(user_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
>>>>>>> Stashed changes
>>>>>>> b0ff3c1 (new install)
=======
async def delete_account(user_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
>>>>>>> Stashed changes
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Événement non trouvé"
        )

    db.delete(db_user)
    db.commit()
