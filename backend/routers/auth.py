from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.models import User
import hashlib

router = APIRouter()
SECRET_KEY = "civiclens-secret-key-sih-2026"
ALGORITHM = "HS256"

def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def verify_password(pw: str, hashed: str) -> bool:
    return hashlib.sha256(pw.encode()).hexdigest() == hashed

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    language: str = "en"

from jose import jwt
from datetime import datetime, timedelta

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=7)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": str(user.id), "role": user.role, "name": user.name})
    return {
        "token": token,
        "user": {
            "id": user.id, "name": user.name, "email": user.email,
            "role": user.role, "language": user.language, "ward_id": user.ward_id
        }
    }

@router.post("/register")
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=req.name, phone=req.phone, email=req.email,
        password_hash=hash_password(req.password),
        role="citizen", language=req.language
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_token({"sub": str(user.id), "role": user.role, "name": user.name})
    return {
        "token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.get("/demo-credentials")
async def demo_credentials():
    return {
        "credentials": [
            {"role": "admin", "email": "admin@civiclens.gov", "password": "admin123"},
            {"role": "officer", "email": "officer@civiclens.gov", "password": "officer123"},
            {"role": "worker", "email": "worker@civiclens.gov", "password": "worker123"},
            {"role": "citizen", "email": "citizen@civiclens.gov", "password": "citizen123"},
            {"role": "supervisor", "email": "supervisor@civiclens.gov", "password": "supervisor123"},
        ]
    }
