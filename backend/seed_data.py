import random
import math
from datetime import datetime, timedelta
import hashlib
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import User, Department, Ward, Complaint, IssueCluster, Assignment, Resolution, AuditLog

fake = Faker('en_IN')


def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

CATEGORIES = [
    ("Road Infrastructure", "Pothole", 1),
    ("Road Infrastructure", "Road Damage", 1),
    ("Road Infrastructure", "Speed Breaker", 1),
    ("Garbage & Sanitation", "Garbage Not Collected", 2),
    ("Garbage & Sanitation", "Overflowing Bins", 2),
    ("Garbage & Sanitation", "Open Burning", 2),
    ("Water Supply", "No Water Supply", 3),
    ("Water Supply", "Water Leakage", 3),
    ("Water Supply", "Low Pressure", 3),
    ("Drainage", "Blocked Drain", 4),
    ("Drainage", "Flooding", 4),
    ("Streetlights", "Light Not Working", 5),
    ("Streetlights", "Damaged Pole", 5),
    ("Public Infrastructure", "Broken Footpath", 6),
    ("Public Infrastructure", "Damaged Park", 6),
    ("Traffic", "Signal Not Working", 7),
    ("Noise", "Loud Speaker Noise", 8),
    ("Other", "General Complaint", 9),
]

SEVERITIES = ["low", "medium", "high", "critical"]
SEVERITY_WEIGHTS = [0.25, 0.40, 0.25, 0.10]

STATUSES = ["submitted", "classified", "assigned", "in_progress", "resolved", "closed"]

# 20 wards centered around a fictional city (Pune-like coordinates)
WARDS = [
    (1, "Shivajinagar", 18.5204, 73.8567),
    (2, "Kothrud", 18.5074, 73.8077),
    (3, "Hadapsar", 18.5018, 73.9260),
    (4, "Yerawada", 18.5563, 73.8932),
    (5, "Bibwewadi", 18.4677, 73.8601),
    (6, "Wanowrie", 18.4796, 73.8913),
    (7, "Aundh", 18.5590, 73.8070),
    (8, "Baner", 18.5590, 73.7868),
    (9, "Pimple Saudagar", 18.5933, 73.7862),
    (10, "Wakad", 18.5989, 73.7618),
    (11, "Hinjewadi", 18.5944, 73.7303),
    (12, "Magarpatta", 18.5089, 73.9283),
    (13, "Koregaon Park", 18.5362, 73.8938),
    (14, "Nagar Road", 18.5536, 73.9243),  # THE HOTSPOT WARD
    (15, "Viman Nagar", 18.5679, 73.9143),
    (16, "Kalyani Nagar", 18.5497, 73.9053),
    (17, "Deccan", 18.5154, 73.8368),
    (18, "Camp", 18.5176, 73.8745),
    (19, "Waked Road", 18.5821, 73.7508),
    (20, "Mundhwa", 18.5038, 73.9323),
]

DEPARTMENTS = [
    (1, "Roads Department", "ROADS"),
    (2, "Sanitation Department", "SANIT"),
    (3, "Water Supply Department", "WATER"),
    (4, "Drainage Department", "DRAIN"),
    (5, "Electrical Department", "ELECT"),
    (6, "Parks & Recreation", "PARKS"),
    (7, "Traffic Department", "TRAFF"),
    (8, "Public Works", "PWD"),
    (9, "Health Department", "HLTH"),
    (10, "Revenue Department", "REV"),
    (11, "Emergency Services", "EMRG"),
    (12, "Planning Department", "PLAN"),
]

DEPT_CATEGORY_MAP = {
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

COMPLAINT_TEMPLATES = {
    "Road Infrastructure": [
        "There is a large {sub} on {road} near {landmark}. It is causing accidents.",
        "The road near {landmark} has a {sub}. Please repair urgently.",
        "{sub} on the main road near {landmark} is getting bigger.",
        "Dangerous {sub} outside {landmark}. Vehicles are getting damaged.",
        "Road is broken near {landmark}. Need urgent repair.",
    ],
    "Garbage & Sanitation": [
        "Garbage has not been collected near {landmark} for several days.",
        "Overflowing garbage bin near {landmark}. Causing health hazard.",
        "Garbage dumped illegally near {landmark}.",
        "No garbage collection for a week near {landmark}.",
    ],
    "Water Supply": [
        "No water supply in area near {landmark} for {days} days.",
        "Water leakage on the road near {landmark}.",
        "Water pressure is very low near {landmark}.",
        "No water supply since {days} days. Please resolve urgently.",
    ],
    "Drainage": [
        "Blocked drain near {landmark} causing flooding.",
        "Sewage overflow near {landmark}.",
        "Drain is choked near {landmark}.",
    ],
    "Streetlights": [
        "Streetlight not working near {landmark} for {days} days.",
        "Multiple streetlights not working on road near {landmark}.",
        "Dark road near {landmark}. Safety concern at night.",
    ],
    "Public Infrastructure": [
        "Broken footpath near {landmark}.",
        "Damaged footpath causing injury risk near {landmark}.",
    ],
    "Traffic": [
        "Traffic signal not working at {landmark}.",
        "Signal malfunction causing traffic jam near {landmark}.",
    ],
    "Noise": [
        "Loud noise from {landmark}.",
        "Noise pollution near {landmark}.",
    ],
    "Other": [
        "Issue near {landmark}. Please send inspection team.",
        "Civic problem near {landmark}. Needs attention.",
    ],
}

LANDMARKS = [
    "the school", "railway station", "bus stop", "the market", "the hospital",
    "the park", "the temple", "the mosque", "the church", "the college",
    "the government office", "the police station", "the junction",
    "the flyover", "the underpass",
]
ROADS = ["Main Road", "Market Road", "Station Road", "College Road", "Ring Road"]


def get_template_text(category, subcategory):
    templates = COMPLAINT_TEMPLATES.get(category, COMPLAINT_TEMPLATES["Other"])
    t = random.choice(templates)
    return t.format(
        sub=subcategory.lower(),
        road=random.choice(ROADS),
        landmark=random.choice(LANDMARKS),
        days=random.randint(2, 10)
    )


def ward_coords_jitter(center_lat, center_lng, radius_deg=0.005):
    angle = random.uniform(0, 2 * math.pi)
    r = random.uniform(0, radius_deg)
    return center_lat + r * math.cos(angle), center_lng + r * math.sin(angle)


async def seed_database(db: AsyncSession):
    print("[SEED] Seeding CivicLens database...")

    # Departments
    for dept_id, name, code in DEPARTMENTS:
        dept = Department(id=dept_id, name=name, code=code, description=f"{name} handles civic issues")
        db.add(dept)

    # Wards
    for ward_num, ward_name, lat, lng in WARDS:
        ward = Ward(id=ward_num, name=ward_name, number=ward_num, center_lat=lat, center_lng=lng)
        db.add(ward)

    await db.flush()

    # Admin user
    admin = User(
        id=1, name="Municipal Administrator", phone="9000000001",
        email="admin@civiclens.gov", password_hash=hash_password("admin123"),
        role="admin", ward_id=None
    )
    officer = User(
        id=2, name="Rajesh Kumar (Roads Officer)", phone="9000000002",
        email="officer@civiclens.gov", password_hash=hash_password("officer123"),
        role="officer", ward_id=14, department_id=1
    )
    worker = User(
        id=3, name="Vijay Singh (Field Worker)", phone="9000000003",
        email="worker@civiclens.gov", password_hash=hash_password("worker123"),
        role="worker", ward_id=14, department_id=1
    )
    citizen = User(
        id=4, name="Priya Sharma", phone="9000000004",
        email="citizen@civiclens.gov", password_hash=hash_password("citizen123"),
        role="citizen", ward_id=14
    )
    supervisor = User(
        id=5, name="Anita Desai (Supervisor)", phone="9000000005",
        email="supervisor@civiclens.gov", password_hash=hash_password("supervisor123"),
        role="supervisor", ward_id=None, department_id=1
    )

    for u in [admin, officer, worker, citizen, supervisor]:
        db.add(u)

    await db.flush()

    print("  [OK] Users and departments seeded")

    # ── ISSUE CLUSTERS (pre-seeded hotspots) ──────────────────────────────
    ward14_lat, ward14_lng = 18.5536, 73.9243

    clusters = [
        IssueCluster(
            id=1, title="Road Damage — Ward 14 (Nagar Road)",
            category="Road Infrastructure", ward_id=14, ward_name="Nagar Road",
            center_lat=ward14_lat, center_lng=ward14_lng, radius_meters=600,
            complaint_count=42, severity="critical", growth_rate=64.0, risk_score=91,
            root_cause_hypothesis="Sustained heavy traffic combined with poor sub-base condition causing progressive road failure.",
            recommended_action="Schedule road inspection and emergency patching within 24 hours.",
            evidence_factors=["42 related complaints", "+64% growth this week", "2 schools within 500m", "Unresolved for 4 days", "Historical recurrence detected"],
            status="active"
        ),
        IssueCluster(
            id=2, title="Garbage Overflow — Ward 8 (Baner)",
            category="Garbage & Sanitation", ward_id=8, ward_name="Baner",
            center_lat=18.5590, center_lng=73.7868, radius_meters=400,
            complaint_count=28, severity="high", growth_rate=35.0, risk_score=72,
            root_cause_hypothesis="Inadequate collection frequency in rapidly urbanizing zone.",
            recommended_action="Double collection frequency in Ward 8 immediately.",
            evidence_factors=["28 related complaints", "+35% growth this week", "1 school within 300m", "Unresolved for 6 days"],
            status="active"
        ),
        IssueCluster(
            id=3, title="Streetlight Failure — Ward 3 (Hadapsar)",
            category="Streetlights", ward_id=3, ward_name="Hadapsar",
            center_lat=18.5018, center_lng=73.9260, radius_meters=500,
            complaint_count=18, severity="high", growth_rate=22.0, risk_score=67,
            root_cause_hypothesis="Aging electrical infrastructure in Hadapsar sector causing cascade failures.",
            recommended_action="Electrical team inspection of main supply line for Hadapsar sector.",
            evidence_factors=["18 related complaints", "+22% growth", "Night safety risk", "3 consecutive days"],
            status="active"
        ),
        IssueCluster(
            id=4, title="Water Leakage — Ward 7 (Aundh)",
            category="Water Supply", ward_id=7, ward_name="Aundh",
            center_lat=18.5590, center_lng=73.8070, radius_meters=350,
            complaint_count=12, severity="medium", growth_rate=15.0, risk_score=48,
            root_cause_hypothesis="Possible pipe joint failure in Aundh distribution network.",
            recommended_action="Water department inspection of main distribution line.",
            evidence_factors=["12 related complaints", "+15% growth", "Potential road damage risk"],
            status="monitoring"
        ),
        IssueCluster(
            id=5, title="Pothole Cluster — Ward 2 (Kothrud)",
            category="Road Infrastructure", ward_id=2, ward_name="Kothrud",
            center_lat=18.5074, center_lng=73.8077, radius_meters=450,
            complaint_count=19, severity="high", growth_rate=28.0, risk_score=63,
            root_cause_hypothesis="Drainage failure causing subgrade saturation.",
            recommended_action="Repair potholes and investigate drainage in Kothrud sector.",
            evidence_factors=["19 complaints", "+28% growth", "Near college"],
            status="active"
        ),
    ]
    for c in clusters:
        db.add(c)

    await db.flush()
    print("  [OK] Issue clusters seeded")

    # ── SYNTHETIC COMPLAINTS (50,000) ──────────────────────────────────────
    now = datetime.utcnow()
    complaint_objects = []
    cnum = 10000

    # First, seed the 42 Ward-14 road damage complaints (the demo scenario)
    ward14_info = WARDS[13]  # index 13 = ward 14
    for i in range(42):
        days_ago = random.randint(0, 4)
        created = now - timedelta(days=days_ago, hours=random.randint(0, 23))
        severity = random.choices(["high", "critical"], [0.5, 0.5])[0]
        lat, lng = ward_coords_jitter(ward14_info[2], ward14_info[3], 0.003)
        complaint_objects.append(Complaint(
            complaint_number=f"CL{cnum:05d}",
            user_id=4, description=get_template_text("Road Infrastructure", "Pothole"),
            category="Road Infrastructure", subcategory="Pothole",
            department_id=1, latitude=lat, longitude=lng,
            address=f"Nagar Road, Ward 14, Pune",
            ward_id=14, severity=severity,
            priority_score=random.randint(72, 98),
            status=random.choice(["submitted", "classified", "assigned"]),
            ai_confidence=random.uniform(0.87, 0.97),
            cluster_id=1, is_duplicate=(i > 0),
            created_at=created, updated_at=created
        ))
        cnum += 1

    # Now seed 49,958 more complaints across all wards
    BATCH = 500
    seeded = 0
    while seeded < 49958:
        batch_size = min(BATCH, 49958 - seeded)
        for _ in range(batch_size):
            # Pick ward
            ward_idx = random.randint(0, 19)
            ward_info = WARDS[ward_idx]
            ward_id = ward_info[0]
            # Pick category
            cat_info = random.choice(CATEGORIES)
            category, subcategory, dept_id = cat_info
            # Pick severity and status
            severity = random.choices(SEVERITIES, SEVERITY_WEIGHTS)[0]
            pri_base = {"low": 20, "medium": 45, "high": 65, "critical": 82}[severity]
            priority = min(100, pri_base + random.randint(-10, 15))
            # Time: spread over 2 years
            days_ago = random.randint(0, 730)
            hours_ago = random.randint(0, 23)
            created = now - timedelta(days=days_ago, hours=hours_ago)

            if days_ago < 30:
                status = random.choices(STATUSES[:4], [0.2, 0.3, 0.3, 0.2])[0]
            elif days_ago < 180:
                status = random.choices(STATUSES, [0.05, 0.1, 0.15, 0.2, 0.35, 0.15])[0]
            else:
                status = random.choices(["resolved", "closed"], [0.6, 0.4])[0]

            lat, lng = ward_coords_jitter(ward_info[2], ward_info[3], 0.004)
            complaint_objects.append(Complaint(
                complaint_number=f"CL{cnum:05d}",
                user_id=4,
                description=get_template_text(category, subcategory),
                category=category, subcategory=subcategory,
                department_id=dept_id,
                latitude=lat, longitude=lng,
                address=f"{ward_info[1]}, Pune",
                ward_id=ward_id, severity=severity,
                priority_score=priority, status=status,
                ai_confidence=random.uniform(0.72, 0.98),
                created_at=created, updated_at=created
            ))
            cnum += 1

        db.add_all(complaint_objects[-batch_size:])
        await db.flush()
        seeded += batch_size
        if seeded % 5000 == 0:
            print(f"  [OK] {seeded + 42} complaints seeded...")

    print(f"  [OK] Total {len(complaint_objects)} complaints seeded")

    # Sample assignment for worker
    assignment = Assignment(
        complaint_id=10001, department_id=1, officer_id=2, worker_id=3,
        assigned_at=now - timedelta(hours=2),
        deadline=now + timedelta(hours=22),
        status="in_progress", sla_hours=24
    )
    db.add(assignment)

    await db.commit()
    print("[DONE] Database seeding complete!")
