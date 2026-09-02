from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.models import Complaint, IssueCluster, Ward

router = APIRouter()

@router.get("/complaints")
async def get_map_complaints(
    limit: int = 500,
    severity: str = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(
        Complaint.id, Complaint.latitude, Complaint.longitude,
        Complaint.category, Complaint.severity, Complaint.status,
        Complaint.complaint_number, Complaint.ward_id
    )
    if severity:
        query = query.where(Complaint.severity == severity)
    query = query.where(Complaint.latitude.isnot(None)).limit(limit)
    result = await db.execute(query)
    rows = result.fetchall()
    return [
        {
            "id": r[0], "lat": r[1], "lng": r[2],
            "category": r[3], "severity": r[4],
            "status": r[5], "number": r[6], "ward_id": r[7]
        }
        for r in rows
    ]

@router.get("/clusters")
async def get_map_clusters(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IssueCluster))
    clusters = result.scalars().all()
    return [
        {
            "id": c.id, "title": c.title, "category": c.category,
            "lat": c.center_lat, "lng": c.center_lng,
            "radius": c.radius_meters, "complaint_count": c.complaint_count,
            "severity": c.severity, "risk_score": c.risk_score,
            "growth_rate": c.growth_rate, "ward_name": c.ward_name,
        }
        for c in clusters
    ]

@router.get("/heatmap")
async def get_heatmap(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            Complaint.latitude, Complaint.longitude, Complaint.priority_score
        ).where(Complaint.latitude.isnot(None)).limit(2000)
    )
    rows = result.fetchall()
    return [{"lat": r[0], "lng": r[1], "weight": (r[2] or 50) / 100} for r in rows]

@router.get("/wards")
async def get_wards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ward))
    wards = result.scalars().all()
    # Add complaint counts
    counts_result = await db.execute(
        select(Complaint.ward_id, func.count(Complaint.id)).group_by(Complaint.ward_id)
    )
    counts = {r[0]: r[1] for r in counts_result.fetchall()}
    return [
        {
            "id": w.id, "name": w.name, "number": w.number,
            "lat": w.center_lat, "lng": w.center_lng,
            "complaint_count": counts.get(w.id, 0),
        }
        for w in wards
    ]
