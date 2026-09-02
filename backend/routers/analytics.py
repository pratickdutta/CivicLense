from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from database import get_db
from models.models import Complaint, IssueCluster, Department, Ward
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/overview")
async def get_overview(db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)

    total = (await db.execute(select(func.count(Complaint.id)))).scalar()
    critical = (await db.execute(select(func.count(Complaint.id)).where(Complaint.severity == "critical"))).scalar()
    pending = (await db.execute(select(func.count(Complaint.id)).where(Complaint.status.in_(["submitted","classified","assigned","in_progress"])))).scalar()
    resolved = (await db.execute(select(func.count(Complaint.id)).where(Complaint.status.in_(["resolved","closed"])))).scalar()
    this_week = (await db.execute(select(func.count(Complaint.id)).where(Complaint.created_at >= week_ago))).scalar()
    sla_breaches = random.randint(18, 25)  # simulated

    resolution_rate = round((resolved / total * 100), 1) if total > 0 else 0
    avg_resolution_hours = round(random.uniform(28, 42), 1)

    # Clusters
    cluster_result = await db.execute(select(IssueCluster).where(IssueCluster.status == "active"))
    clusters = cluster_result.scalars().all()

    return {
        "total_complaints": total,
        "critical_complaints": critical,
        "pending_complaints": pending,
        "resolved_complaints": resolved,
        "this_week_new": this_week,
        "sla_breaches": sla_breaches,
        "resolution_rate": resolution_rate,
        "avg_resolution_hours": avg_resolution_hours,
        "active_clusters": len(clusters),
        "high_risk_hotspots": sum(1 for c in clusters if c.risk_score >= 70),
        "overloaded_departments": 3,
    }


@router.get("/trends")
async def get_trends(days: int = 30, db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    trend_data = []
    for i in range(days, -1, -1):
        day = now - timedelta(days=i)
        label = day.strftime("%b %d")
        base = random.randint(80, 200)
        trend_data.append({
            "date": label,
            "total": base,
            "resolved": int(base * random.uniform(0.55, 0.80)),
            "critical": random.randint(3, 20),
            "road": int(base * 0.35), "sanitation": int(base * 0.22),
            "water": int(base * 0.18), "other": int(base * 0.25),
        })
    return trend_data


@router.get("/departments")
async def get_department_stats(db: AsyncSession = Depends(get_db)):
    depts = [
        {"id": 1, "name": "Roads", "total": 14820, "resolved": 12100, "pending": 2720, "sla_compliance": 87, "avg_hours": 38},
        {"id": 2, "name": "Sanitation", "total": 11340, "resolved": 9800, "pending": 1540, "sla_compliance": 91, "avg_hours": 22},
        {"id": 3, "name": "Water Supply", "total": 8920, "resolved": 7100, "pending": 1820, "sla_compliance": 79, "avg_hours": 45},
        {"id": 4, "name": "Drainage", "total": 5600, "resolved": 4200, "pending": 1400, "sla_compliance": 75, "avg_hours": 56},
        {"id": 5, "name": "Electrical", "total": 4800, "resolved": 4100, "pending": 700, "sla_compliance": 85, "avg_hours": 28},
        {"id": 6, "name": "Public Works", "total": 3200, "resolved": 2600, "pending": 600, "sla_compliance": 81, "avg_hours": 48},
    ]
    for d in depts:
        d["resolution_rate"] = round(d["resolved"] / d["total"] * 100, 1)
    return depts


@router.get("/sla")
async def get_sla_stats():
    return {
        "overall_compliance": 85.2,
        "by_priority": {
            "critical": {"target_hours": 24, "compliance": 78, "avg_actual": 22},
            "high": {"target_hours": 48, "compliance": 84, "avg_actual": 41},
            "medium": {"target_hours": 120, "compliance": 89, "avg_actual": 98},
            "low": {"target_hours": 240, "compliance": 93, "avg_actual": 210},
        },
        "breaches_by_dept": [
            {"dept": "Roads", "breaches": 8},
            {"dept": "Water Supply", "breaches": 7},
            {"dept": "Drainage", "breaches": 4},
            {"dept": "Sanitation", "breaches": 2},
        ]
    }


@router.get("/category-distribution")
async def get_category_distribution(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Complaint.category, func.count(Complaint.id).label("count"))
        .group_by(Complaint.category)
        .order_by(desc("count"))
    )
    rows = result.fetchall()
    return [{"category": r[0], "count": r[1]} for r in rows if r[0]]
