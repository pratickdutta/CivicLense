from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/tasks")
async def get_worker_tasks():
    now = datetime.utcnow()
    return [
        {
            "id": 1, "complaint_id": 10001,
            "complaint_number": "CL10001",
            "category": "Road Infrastructure", "subcategory": "Pothole",
            "address": "Nagar Road near City School, Ward 14, Pune",
            "latitude": 18.5536, "longitude": 73.9243,
            "priority": "critical", "priority_score": 91,
            "status": "in_progress",
            "deadline": (now + timedelta(hours=6)).isoformat(),
            "description": "Large pothole near school causing vehicle damage. Urgent repair needed.",
            "department": "Roads Department",
            "sla_hours_remaining": 6,
        },
        {
            "id": 2, "complaint_id": 10025,
            "complaint_number": "CL10025",
            "category": "Streetlights", "subcategory": "Light Not Working",
            "address": "Market Road, Ward 14, Pune",
            "latitude": 18.5540, "longitude": 73.9250,
            "priority": "high", "priority_score": 68,
            "status": "assigned",
            "deadline": (now + timedelta(hours=24)).isoformat(),
            "description": "Three consecutive streetlights not working.",
            "department": "Electrical Department",
            "sla_hours_remaining": 24,
        },
    ]

@router.get("/stats")
async def get_worker_stats():
    return {
        "tasks_today": 3,
        "completed_this_week": 12,
        "pending": 2,
        "avg_completion_hours": 4.2,
    }
