from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from database import get_db
from models.models import IssueCluster, Complaint
import random

router = APIRouter()

@router.get("/clusters")
async def get_clusters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IssueCluster).order_by(desc(IssueCluster.risk_score)))
    clusters = result.scalars().all()
    return [
        {
            "id": c.id, "title": c.title, "category": c.category,
            "ward_id": c.ward_id, "ward_name": c.ward_name,
            "center_lat": c.center_lat, "center_lng": c.center_lng,
            "radius_meters": c.radius_meters, "complaint_count": c.complaint_count,
            "severity": c.severity, "growth_rate": c.growth_rate,
            "risk_score": c.risk_score,
            "root_cause_hypothesis": c.root_cause_hypothesis,
            "recommended_action": c.recommended_action,
            "evidence_factors": c.evidence_factors, "status": c.status,
        }
        for c in clusters
    ]

@router.get("/hotspots")
async def get_hotspots(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(IssueCluster).where(IssueCluster.risk_score >= 60).order_by(desc(IssueCluster.risk_score))
    )
    hotspots = result.scalars().all()
    return {
        "hotspots": [
            {
                "id": h.id, "title": h.title, "ward_name": h.ward_name,
                "severity": h.severity, "risk_score": h.risk_score,
                "complaint_count": h.complaint_count, "growth_rate": h.growth_rate,
                "center_lat": h.center_lat, "center_lng": h.center_lng,
            }
            for h in hotspots
        ],
        "total_hotspots": len(hotspots),
        "critical_count": sum(1 for h in hotspots if h.severity == "critical"),
    }

@router.get("/recommendations")
async def get_recommendations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(IssueCluster).where(IssueCluster.status == "active").order_by(desc(IssueCluster.risk_score)).limit(5)
    )
    clusters = result.scalars().all()
    return [
        {
            "id": c.id,
            "cluster_id": c.id,
            "title": c.title,
            "category": c.category,
            "ward_name": c.ward_name,
            "complaint_count": c.complaint_count,
            "growth_rate": c.growth_rate,
            "risk_score": c.risk_score,
            "severity": c.severity,
            "recommended_action": c.recommended_action,
            "evidence_factors": c.evidence_factors,
            "urgency": "critical" if c.risk_score >= 80 else "high" if c.risk_score >= 60 else "medium",
        }
        for c in clusters
    ]

@router.get("/risk/{cluster_id}")
async def get_cluster_risk(cluster_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IssueCluster).where(IssueCluster.id == cluster_id))
    c = result.scalar_one_or_none()
    if not c:
        return {"error": "Cluster not found"}
    # Mock time series for escalation trend
    trend_data = []
    base = max(1, c.complaint_count // 7)
    for day in range(7, 0, -1):
        factor = (8 - day) / 7
        trend_data.append({
            "day": f"Day {8-day}", "count": max(1, int(base * factor * random.uniform(0.85, 1.15)))
        })

    return {
        "cluster_id": c.id, "title": c.title,
        "risk_score": c.risk_score, "severity": c.severity,
        "growth_rate": c.growth_rate,
        "trend": trend_data,
        "risk_factors": {
            "complaint_velocity": min(100, int(c.growth_rate * 1.5)),
            "severity_weight": {"low": 20, "medium": 40, "high": 70, "critical": 90}[c.severity],
            "duration_days": random.randint(3, 8),
            "schools_nearby": random.randint(0, 3),
            "historical_recurrence": True if c.risk_score > 70 else False,
        },
        "recommended_action": c.recommended_action,
        "evidence_factors": c.evidence_factors,
    }

@router.post("/classify")
async def classify_complaint(text: str, db: AsyncSession = Depends(get_db)):
    """Quick AI classification endpoint"""
    from routers.complaints import ai_classify
    result = ai_classify(text)
    # Look up dept name
    dept_names = {1: "Roads", 2: "Sanitation", 3: "Water Supply", 4: "Drainage", 5: "Electrical", 8: "Public Works"}
    result["department_name"] = dept_names.get(result["department_id"], "Public Works")
    return result
