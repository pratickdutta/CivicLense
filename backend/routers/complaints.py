from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_, or_
from database import get_db
from models.models import Complaint, Department, Ward, IssueCluster, User, Assignment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import random

router = APIRouter()

class ComplaintCreate(BaseModel):
    description: str
    latitude: float
    longitude: float
    address: str = ""
    ward_id: int = 14
    category: Optional[str] = None
    language: str = "en"

CATEGORY_DEPT_MAP = {
    "Road Infrastructure": 1,
    "Garbage & Sanitation": 2,
    "Water Supply": 3,
    "Drainage": 4,
    "Streetlights": 5,
    "Public Infrastructure": 8,
    "Traffic": 7,
    "Noise": 9,
    "Other": 8,
}

def ai_classify(text: str, category: Optional[str] = None):
    """Rule-based AI classifier for demo"""
    text_lower = text.lower()
    if category:
        cat = category
    elif any(k in text_lower for k in ["pothole", "road", "pavement", "crack", "damaged road"]):
        cat = "Road Infrastructure"
    elif any(k in text_lower for k in ["garbage", "waste", "trash", "sanitation", "litter"]):
        cat = "Garbage & Sanitation"
    elif any(k in text_lower for k in ["water", "supply", "leak", "pipe", "pressure"]):
        cat = "Water Supply"
    elif any(k in text_lower for k in ["drain", "flood", "sewer", "waterlogging"]):
        cat = "Drainage"
    elif any(k in text_lower for k in ["light", "streetlight", "lamp", "dark"]):
        cat = "Streetlights"
    elif any(k in text_lower for k in ["traffic", "signal", "jam"]):
        cat = "Traffic"
    else:
        cat = "Other"

    severity_words = {
        "critical": ["dangerous", "accident", "emergency", "critical", "urgent", "death", "injury"],
        "high": ["large", "severe", "major", "serious", "big", "deep", "broken"],
        "low": ["small", "minor", "little", "slight"],
    }
    severity = "medium"
    for sev, words in severity_words.items():
        if any(w in text_lower for w in words):
            severity = sev
            break

    dept_id = CATEGORY_DEPT_MAP.get(cat, 8)
    confidence = round(random.uniform(0.82, 0.97), 2)
    priority = {"low": 25, "medium": 50, "high": 70, "critical": 88}[severity] + random.randint(-5, 10)

    subcategory_map = {
        "Road Infrastructure": "Pothole" if "pothole" in text_lower else "Road Damage",
        "Garbage & Sanitation": "Garbage Not Collected",
        "Water Supply": "Water Leakage" if "leak" in text_lower else "No Water Supply",
        "Drainage": "Blocked Drain",
        "Streetlights": "Light Not Working",
        "Traffic": "Signal Not Working",
        "Other": "General Complaint",
    }
    subcategory = subcategory_map.get(cat, "General Complaint")

    return {
        "category": cat, "subcategory": subcategory,
        "department_id": dept_id, "severity": severity,
        "priority_score": min(100, priority), "ai_confidence": confidence
    }


@router.post("")
async def submit_complaint(data: ComplaintCreate, db: AsyncSession = Depends(get_db)):
    ai = ai_classify(data.description, data.category)
    cnum = f"CL{random.randint(60000, 99999):05d}"
    complaint = Complaint(
        complaint_number=cnum,
        user_id=4,  # demo citizen
        description=data.description,
        category=ai["category"],
        subcategory=ai["subcategory"],
        department_id=ai["department_id"],
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address,
        ward_id=data.ward_id,
        severity=ai["severity"],
        priority_score=ai["priority_score"],
        ai_confidence=ai["ai_confidence"],
        status="classified",
        language=data.language
    )
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)
    return {
        "id": complaint.id,
        "complaint_number": complaint.complaint_number,
        "ai_analysis": ai,
        "message": "Complaint submitted and classified by AI"
    }


@router.get("")
async def list_complaints(
    page: int = 1, limit: int = 20,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    category: Optional[str] = None,
    ward_id: Optional[int] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Complaint).order_by(desc(Complaint.created_at))
    if status:
        query = query.where(Complaint.status == status)
    if severity:
        query = query.where(Complaint.severity == severity)
    if category:
        query = query.where(Complaint.category == category)
    if ward_id:
        query = query.where(Complaint.ward_id == ward_id)
    if search:
        query = query.where(Complaint.description.ilike(f"%{search}%"))

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar()

    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    complaints = result.scalars().all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "complaints": [
            {
                "id": c.id,
                "complaint_number": c.complaint_number,
                "description": c.description[:150] + "..." if len(c.description) > 150 else c.description,
                "category": c.category,
                "subcategory": c.subcategory,
                "severity": c.severity,
                "priority_score": c.priority_score,
                "status": c.status,
                "ward_id": c.ward_id,
                "latitude": c.latitude,
                "longitude": c.longitude,
                "address": c.address,
                "ai_confidence": c.ai_confidence,
                "cluster_id": c.cluster_id,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in complaints
        ]
    }


@router.get("/{complaint_id}")
async def get_complaint(complaint_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # Fetch related cluster
    cluster = None
    if c.cluster_id:
        cr = await db.execute(select(IssueCluster).where(IssueCluster.id == c.cluster_id))
        cluster_obj = cr.scalar_one_or_none()
        if cluster_obj:
            cluster = {
                "id": cluster_obj.id, "title": cluster_obj.title,
                "complaint_count": cluster_obj.complaint_count,
                "risk_score": cluster_obj.risk_score, "growth_rate": cluster_obj.growth_rate,
            }

    # Mock timeline
    timeline = [
        {"time": (c.created_at).isoformat(), "action": "Complaint submitted by citizen", "actor": "Priya Sharma"},
        {"time": (c.created_at + timedelta(minutes=2)).isoformat(), "action": f"AI classified as {c.category} ({int(c.ai_confidence*100)}% confidence)", "actor": "AI Engine"},
    ]
    if c.status in ["assigned", "in_progress", "resolved"]:
        timeline.append({"time": (c.created_at + timedelta(hours=1)).isoformat(), "action": "Assigned to Roads Department", "actor": "Rajesh Kumar"})
    if c.status in ["in_progress", "resolved"]:
        timeline.append({"time": (c.created_at + timedelta(hours=3)).isoformat(), "action": "Field worker Vijay Singh accepted task", "actor": "Vijay Singh"})
    if c.status == "resolved":
        timeline.append({"time": (c.created_at + timedelta(hours=8)).isoformat(), "action": "Resolution evidence submitted", "actor": "Vijay Singh"})
        timeline.append({"time": (c.created_at + timedelta(hours=10)).isoformat(), "action": "Resolution approved by officer", "actor": "Rajesh Kumar"})

    return {
        "id": c.id, "complaint_number": c.complaint_number,
        "description": c.description, "category": c.category,
        "subcategory": c.subcategory, "severity": c.severity,
        "priority_score": c.priority_score, "status": c.status,
        "ward_id": c.ward_id, "address": c.address,
        "latitude": c.latitude, "longitude": c.longitude,
        "ai_confidence": c.ai_confidence,
        "is_duplicate": c.is_duplicate,
        "cluster": cluster,
        "timeline": timeline,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }


@router.patch("/{complaint_id}/status")
async def update_status(complaint_id: int, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    c.status = status
    c.updated_at = datetime.utcnow()
    await db.commit()
    return {"message": f"Status updated to {status}"}
