from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db
from sqlalchemy.ext.asyncio import AsyncSession
import routers.auth as auth_router
import routers.complaints as complaints_router
import routers.ai_engine as ai_router
import routers.analytics as analytics_router
import routers.map as map_router
import routers.departments as dept_router
import routers.workers as worker_router

app = FastAPI(
    title="CivicLens API",
    description="AI-Powered Predictive Civic Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await init_db()
    # Seed if empty
    from sqlalchemy import select, func
    from models.models import Complaint, User
    async for db in get_db():
        result = await db.execute(select(func.count(User.id)))
        count = result.scalar()
        if count == 0:
            from seed_data import seed_database
            await seed_database(db)

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(complaints_router.router, prefix="/api/complaints", tags=["complaints"])
app.include_router(ai_router.router, prefix="/api/ai", tags=["ai"])
app.include_router(analytics_router.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(map_router.router, prefix="/api/map", tags=["map"])
app.include_router(dept_router.router, prefix="/api/departments", tags=["departments"])
app.include_router(worker_router.router, prefix="/api/workers", tags=["workers"])

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "CivicLens API v1.0"}
