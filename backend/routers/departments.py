from fastapi import APIRouter
router = APIRouter()

@router.get("")
async def list_departments():
    return [
        {"id": 1, "name": "Roads Department", "code": "ROADS", "head": "Rajesh Kumar", "active_complaints": 2720, "workers": 45},
        {"id": 2, "name": "Sanitation Department", "code": "SANIT", "head": "Meena Patel", "active_complaints": 1540, "workers": 62},
        {"id": 3, "name": "Water Supply Department", "code": "WATER", "head": "Arun Sharma", "active_complaints": 1820, "workers": 38},
        {"id": 4, "name": "Drainage Department", "code": "DRAIN", "head": "Sanjay Gupta", "active_complaints": 1400, "workers": 29},
        {"id": 5, "name": "Electrical Department", "code": "ELECT", "head": "Priya Nair", "active_complaints": 700, "workers": 22},
        {"id": 6, "name": "Parks & Recreation", "code": "PARKS", "head": "Amit Singh", "active_complaints": 340, "workers": 18},
        {"id": 7, "name": "Traffic Department", "code": "TRAFF", "head": "Vikram Das", "active_complaints": 280, "workers": 15},
        {"id": 8, "name": "Public Works", "code": "PWD", "head": "Rekha Joshi", "active_complaints": 600, "workers": 35},
    ]
