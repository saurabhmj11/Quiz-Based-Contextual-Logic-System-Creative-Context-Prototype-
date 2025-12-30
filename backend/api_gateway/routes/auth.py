from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from database.session import get_db
from database.models import User

router = APIRouter()

# --- Configuration ---
SECRET_KEY = "your-secret-key-should-be-in-env"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600 # 10 hours for dev

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Helpers ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Schemas ---
class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str

# --- Endpoints ---

@router.post("/signup", response_model=Token)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": new_user.id,
        "email": new_user.email
    }

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(user_data.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    access_token = create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email
    }
