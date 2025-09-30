from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
from database import get_db
from schemas.users import CreateUser, UserLogin, UserOut, UserResponse, Token, UserUpdate
from endpoints.auth import create_access_token, hash_password, verify_password, get_current_user, get_current_organizer, get_current_admin
import re

router = APIRouter()


# ---------------- Current User ----------------
@router.get("/me", response_model=UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role,
        "phone": current_user.phone,
        "location": current_user.location,
        "profile_pic": current_user.profile_pic,
        "preferences": [p.preference for p in current_user.preferences],
    }


# ---------------- Login ----------------
@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    # Look up user by email
    user = db.query(models.User).filter(models.User.email == user_login.email).first()
    
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}



# ---------------- Register ----------------
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user: CreateUser, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")

# ---------- Validation du mot de passe ----------
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(pattern, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long, contain an uppercase, a lowercase, a number, and a special character."
        )
    hashed_password = hash_password(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        username=user.username,
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}


# ---------------- Admin & Organizer Routes ----------------
@router.get("/profile")
def profile(user: models.User = Depends(get_current_user)):
    return {"email": user.email, "role": user.role}


@router.post("/events/create")
def create_event(user: models.User = Depends(get_current_organizer), db: Session = Depends(get_db)):
    return {"msg": f"Event created by {user.email}"}


@router.get("/admin/dashboard")
def dashboard(user: models.User = Depends(get_current_admin)):
    return {"msg": f"Welcome to admin dashboard, {user.email}"}


# ---------------- Users Management ----------------
@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "profile_pic": user.profile_pic,
        "preferences": [p.preference for p in user.preferences],
    }


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "profile_pic": user.profile_pic,
        "preferences": [p.preference for p in user.preferences],
    }


@router.delete("/{user_id}")
def delete_account(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}

