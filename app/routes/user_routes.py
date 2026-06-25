from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserLogin
from app.models.user import User
from app.database.dependencies import get_db


router = APIRouter()

@router.post("/register")

def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return {
            "message": "Email already registered"
        }

    new_user = User(
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {
            "message": "User not found"
        }

    if existing_user.password != user.password:
        return {
            "message": "Invalid password"
        }

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
        "name": existing_user.name,
        "role": existing_user.role
    }

@router.get("/assistants")
def get_assistants(
    db: Session = Depends(get_db)
    ):

    assistants = db.query(User).filter(
        User.role == "assistant"
    ).all()

    return assistants