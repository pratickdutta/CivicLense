from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    phone = Column(String(20), unique=True)
    email = Column(String(200), unique=True)
    password_hash = Column(String(500))
    role = Column(String(50), default="citizen")  # citizen, worker, officer, supervisor, admin, superadmin
    language = Column(String(10), default="en")
    ward_id = Column(Integer)
    department_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    code = Column(String(20))
    description = Column(Text)

class Ward(Base):
    __tablename__ = "wards"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    number = Column(Integer)
    center_lat = Column(Float)
    center_lng = Column(Float)

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True)
    complaint_number = Column(String(20), unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(Text)
    category = Column(String(100))
    subcategory = Column(String(100))
    department_id = Column(Integer, ForeignKey("departments.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String(500))
    ward_id = Column(Integer, ForeignKey("wards.id"))
    severity = Column(String(20), default="medium")  # low, medium, high, critical
    priority_score = Column(Integer, default=50)
    status = Column(String(50), default="submitted")
    ai_confidence = Column(Float, default=0.0)
    language = Column(String(10), default="en")
    cluster_id = Column(Integer, ForeignKey("issue_clusters.id"), nullable=True)
    is_duplicate = Column(Boolean, default=False)
    master_complaint_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    type = Column(String(20))  # image, video, audio
    url = Column(String(500))
    metadata_json = Column(JSON)
    ai_analysis = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class IssueCluster(Base):
    __tablename__ = "issue_clusters"
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    category = Column(String(100))
    ward_id = Column(Integer)
    ward_name = Column(String(100))
    center_lat = Column(Float)
    center_lng = Column(Float)
    radius_meters = Column(Float, default=500)
    complaint_count = Column(Integer, default=0)
    severity = Column(String(20))
    growth_rate = Column(Float, default=0.0)  # percentage growth this week
    risk_score = Column(Integer, default=0)
    root_cause_hypothesis = Column(Text)
    recommended_action = Column(Text)
    evidence_factors = Column(JSON)
    status = Column(String(20), default="active")  # active, monitoring, resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    deadline = Column(DateTime)
    status = Column(String(50), default="assigned")
    sla_hours = Column(Integer, default=48)
    notes = Column(Text)

class Resolution(Base):
    __tablename__ = "resolutions"
    id = Column(Integer, primary_key=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    worker_id = Column(Integer, ForeignKey("users.id"))
    description = Column(Text)
    before_evidence_url = Column(String(500))
    after_evidence_url = Column(String(500))
    ai_verification_score = Column(Float)
    officer_approved = Column(Boolean, nullable=True)
    citizen_confirmed = Column(Boolean, nullable=True)
    citizen_feedback = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    entity_type = Column(String(50))
    entity_id = Column(Integer)
    action = Column(String(200))
    actor_id = Column(Integer)
    actor_role = Column(String(50))
    metadata_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String(50))
    title = Column(String(200))
    body = Column(Text)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
