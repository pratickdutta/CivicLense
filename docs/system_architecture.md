# CivicLens — System Architecture

**Version:** 1.0  
**Date:** August 2026

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CIVICLENS PLATFORM                       │
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────────────────┐ │
│  │   CITIZEN PORTAL  │          │      ADMIN / OFFICER PORTAL  │ │
│  │   (Next.js PWA)   │          │         (Next.js)            │ │
│  └────────┬─────────┘          └──────────────┬───────────────┘ │
│           │                                    │                 │
│           └────────────────┬───────────────────┘                 │
│                            ↓                                     │
│                   ┌─────────────────┐                            │
│                   │  API PLATFORM   │                            │
│                   │   (FastAPI)     │                            │
│                   └────────┬────────┘                            │
│                            │                                     │
│           ┌────────────────┼────────────────┐                   │
│           ↓                ↓                ↓                   │
│  ┌─────────────┐  ┌─────────────────┐  ┌───────────┐           │
│  │  COMPLAINT  │  │   AI ENGINE     │  │    MAP    │           │
│  │   ENGINE    │  │                 │  │  ENGINE   │           │
│  └──────┬──────┘  └────────┬────────┘  └─────┬─────┘           │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            ↓                                     │
│                   ┌─────────────────┐                            │
│                   │   DATA LAYER    │                            │
│                   │  PostgreSQL +   │                            │
│                   │   PostGIS +     │                            │
│                   │   pgvector      │                            │
│                   └─────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Frontend (Next.js 14)

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (citizen)/
│   │   ├── dashboard/
│   │   ├── report/
│   │   └── complaint/[id]/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── complaints/
│   │   ├── map/
│   │   ├── intelligence/
│   │   ├── analytics/
│   │   └── departments/
│   ├── (worker)/
│   │   ├── dashboard/
│   │   └── task/[id]/
│   └── page.tsx (landing)
├── components/
│   ├── civic/
│   │   ├── CivicInsightCard
│   │   ├── HotspotMap
│   │   ├── AIAnalysisPanel
│   │   ├── ClusterSummary
│   │   └── EscalationAlert
│   ├── complaints/
│   │   ├── ComplaintCard
│   │   ├── ComplaintTimeline
│   │   ├── PriorityBadge
│   │   └── SLATracker
│   ├── forms/
│   │   ├── ComplaintForm
│   │   ├── EvidenceUploader
│   │   └── VoiceReporter
│   └── ui/
│       ├── Button, Card, Badge
│       ├── Modal, Drawer
│       └── DataTable, Chart
├── lib/
│   ├── api.ts (API client)
│   ├── auth.ts
│   └── utils.ts
└── styles/
    └── globals.css (design tokens)
```

### 2.2 Backend (FastAPI)

```
backend/
├── main.py
├── routers/
│   ├── auth.py
│   ├── complaints.py
│   ├── ai_engine.py
│   ├── analytics.py
│   ├── map.py
│   ├── departments.py
│   └── workers.py
├── services/
│   ├── classifier.py      (AI classification)
│   ├── clusterer.py       (Issue clustering)
│   ├── predictor.py       (Escalation prediction)
│   ├── recommender.py     (Civic recommendations)
│   ├── duplicate_detector.py
│   └── notifier.py
├── models/
│   ├── complaint.py
│   ├── user.py
│   ├── cluster.py
│   └── resolution.py
├── database.py
└── seed_data.py           (50K synthetic complaints)
```

---

## 3. AI Engine Architecture

```
                    COMPLAINT INPUT
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
       TEXT NLP      IMAGE CV        VOICE STT
          │               │               │
          └───────────────┼───────────────┘
                          ↓
                  STRUCTURED COMPLAINT
                    (Category, Severity,
                     Location, Confidence)
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
    DUPLICATE        CLUSTER         PRIORITY
    DETECTOR         ENGINE           ENGINE
          │               │               │
          └───────────────┼───────────────┘
                          ↓
                  INTELLIGENCE ENGINE
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
    ESCALATION      HOTSPOT         RECOMMENDATION
    PREDICTOR       DETECTOR           ENGINE
          │               │               │
          └───────────────┼───────────────┘
                          ↓
                   CIVIC INSIGHTS
                  (Explainable, Evidence-backed)
```

### 3.1 Classifier
- Input: Raw text + optional image metadata
- Method: Keyword matching + rule-based routing → Gemini API (optional)
- Output: category, subcategory, department, severity, confidence_score

### 3.2 Duplicate Detector
- Input: New complaint (text + location)
- Method: Fuzzy string similarity + geographic proximity (< 500m radius)
- Output: similarity_score, duplicate_candidates[]

### 3.3 Issue Clusterer
- Input: All unresolved complaints
- Method: DBSCAN-style geographic + categorical grouping
- Output: clusters[], dominant_issue, complaint_count, growth_rate

### 3.4 Escalation Predictor
```
Risk Score = (
  velocity_score * 0.30 +
  severity_score * 0.25 +
  duration_score * 0.20 +
  proximity_score * 0.15 +  (schools, hospitals within 500m)
  historical_score * 0.10
) * 100
```

### 3.5 Recommendation Engine
- Generates human-readable civic insights
- Template: "[Category] — [Ward]. [N] reports. [±X%] [period]. [Escalation risk]%. Recommended: [Action]."
- Evidence factors listed as checkmarks

---

## 4. Data Architecture

### 4.1 Core Schema

```sql
-- Users
users (id, name, phone, email, role, language, ward_id, created_at)

-- Complaints  
complaints (
  id, user_id, description, category, subcategory,
  department_id, latitude, longitude, severity, priority_score,
  status, ai_confidence, language, created_at, updated_at
)

-- Evidence
evidence (id, complaint_id, type, url, metadata, ai_analysis, created_at)

-- Issue Clusters
issue_clusters (
  id, category, center_lat, center_lng, radius_meters,
  complaint_count, severity, growth_rate, risk_score,
  root_cause_hypothesis, status, created_at, updated_at
)

-- Departments
departments (id, name, code, head_officer_id, ward_coverage[])

-- Assignments
assignments (
  id, complaint_id, department_id, officer_id, worker_id,
  assigned_at, deadline, status, sla_hours
)

-- Resolutions
resolutions (
  id, complaint_id, worker_id, description,
  before_evidence_url, after_evidence_url,
  ai_verification_score, officer_approved, citizen_confirmed,
  citizen_feedback, created_at
)

-- Audit Log
audit_log (id, entity_type, entity_id, action, actor_id, actor_role, metadata, created_at)

-- Notifications
notifications (id, user_id, type, title, body, read_at, created_at)
```

---

## 5. API Architecture

### Base URL: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login |
| POST | /auth/register | Register citizen |
| GET | /complaints | List complaints (paginated, filtered) |
| POST | /complaints | Submit complaint |
| GET | /complaints/{id} | Complaint detail |
| PATCH | /complaints/{id}/status | Update status |
| POST | /complaints/{id}/assign | Assign to department/worker |
| POST | /complaints/{id}/resolve | Submit resolution |
| POST | /ai/classify | Classify complaint |
| GET | /ai/clusters | Get issue clusters |
| GET | /ai/hotspots | Geographic hotspots |
| GET | /ai/recommendations | Top AI recommendations |
| GET | /ai/risk/{cluster_id} | Escalation risk |
| GET | /analytics/overview | City-wide KPIs |
| GET | /analytics/trends | Time-series data |
| GET | /analytics/departments | Department stats |
| GET | /map/geodata | Complaint geodata for map |
| GET | /map/heatmap | Heatmap density |

---

## 6. Deployment Architecture (Production)

```
                    CloudFlare CDN
                         │
              ┌──────────┴──────────┐
              │                     │
         Vercel (Frontend)    Railway/Render (Backend)
         Next.js SSR/ISR       FastAPI + Uvicorn
              │                     │
              └──────────┬──────────┘
                         │
                  PostgreSQL (Supabase)
                  + PostGIS + pgvector
                         │
                  S3-compatible Storage
                  (Cloudflare R2)
```

---

## 7. Intelligence Loop Sequence

```
1. Citizen submits complaint (text + photo + location)
         ↓
2. API receives → stores raw complaint
         ↓
3. AI Classifier runs:
   - Identifies: Road Damage / High / Roads Dept / Ward 14
   - Confidence: 94%
         ↓
4. Duplicate Detector runs:
   - Finds 41 similar complaints in same area
   - Similarity: 91%
         ↓
5. Cluster Engine updates:
   - Cluster "Road Damage Ward 14" now has 42 complaints
   - Growth rate: +64% this week
         ↓
6. Risk Predictor runs:
   - Velocity score: high
   - 2 schools within 500m
   - Duration: 4 days
   - Risk score: 91%
         ↓
7. Recommendation Engine generates:
   - "Schedule road inspection within 24 hours"
   - Evidence: 42 complaints, +64% growth, 2 schools, 4 days
         ↓
8. Admin dashboard shows Civic Insight card
         ↓
9. Admin accepts recommendation → creates assignment
         ↓
10. Field worker notified → accepts task → uploads before photo
         ↓
11. Field worker completes work → uploads after photo
         ↓
12. AI verifies: visual change detected 92% confidence
         ↓
13. Officer approves resolution
         ↓
14. 42 citizens receive confirmation request
         ↓
15. Citizens confirm → cluster marked resolved
         ↓
16. Intelligence logged for historical patterns
```

---

## 8. Security Architecture

- **Authentication**: JWT (access: 15min, refresh: 7days)
- **Authorization**: RBAC middleware on all protected routes
- **Data isolation**: Citizens see only own complaints; Officers see own ward/dept
- **Media**: Presigned URLs (expire 1 hour)
- **Rate limiting**: 100 req/min unauthenticated, 1000 req/min authenticated
- **Audit**: Every state change logged to immutable audit_log table
- **PII**: Phone/email never returned in complaint list endpoints

---

## 9. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js 14 | SSR, App Router, TypeScript, ecosystem |
| Styling | Tailwind CSS | Design token consistency, Neubrutalism cards |
| Maps | MapLibre GL + OSM | Open source, no API key required for MVP |
| Backend | FastAPI | Python ecosystem for AI, async, auto-docs |
| Database (MVP) | SQLite | Zero-setup for SIH demo, production → PostgreSQL |
| AI (MVP) | Rule-based + Gemini optional | Reliable demo without GPU requirements |
| Voice Input | Web Speech API | Browser-native, no backend needed |
| Charts | Recharts | React-native, Tailwind-compatible |

---

## 10. Help & Glossary

**What is an SLA?**
SLA stands for **Service Level Agreement**. In CivicLens, it represents the guaranteed time limit within which a specific type of civic complaint must be resolved. It acts as a countdown timer for field workers and departments.

**What is the time limit for an SLA?**
Time limits vary based on the AI-assigned severity of the complaint:
* **Critical Severity:** 24 Hours (e.g., Burst water main, huge pothole on a highway)
* **High Severity:** 48 Hours (e.g., Dead streetlight in a dark alley)
* **Medium Severity:** 3 Days (e.g., Garbage not picked up)
* **Low Severity:** 14 Days (e.g., Faded road paint)

**What is an SLA Breach?**
An SLA Breach occurs when a complaint is not resolved within its designated time limit. When this happens, the system flags the issue in red, alerts the Supervisor or Officer, and negatively impacts the department's performance score on the analytics dashboard.

**What is an AI Cluster?**
When multiple citizens report similar issues in the same geographic area (e.g., 5 people report a pothole on the same street), the CivicLens AI Engine groups them into a single "Cluster". This prevents duplicate work and helps identify major hotspots.

<br/>

---
<div align="center">
  <b>© 2026 Team Syntax Error-404.</b> All rights reserved.<br/>
  <i>Developed for the Smart India Hackathon.</i>
</div>
