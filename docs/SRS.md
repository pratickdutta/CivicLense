# Software Requirements Specification (SRS)
## CivicLens — AI-Powered Predictive Civic Intelligence Platform

**Version:** 1.0  
**Date:** August 2026  
**Target:** Smart India Hackathon 2026  
**Classification:** Internal / SIH Submission

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional and non-functional requirements for CivicLens, an AI-powered civic intelligence platform that transforms citizen complaints into actionable government intelligence.

### 1.2 Scope
CivicLens consists of:
- **Citizen Portal** — Multi-modal complaint submission and tracking
- **Admin/Officer Portal** — Intelligence dashboard, complaint management, analytics
- **Field Worker Portal** — Task management and evidence submission
- **AI Intelligence Engine** — Classification, clustering, prediction, recommendations
- **Backend API Platform** — RESTful API layer
- **Civic Map** — Geographic intelligence visualization

### 1.3 Definitions
| Term | Definition |
|------|-----------|
| Complaint | A citizen-submitted report of a civic problem |
| Issue Cluster | A group of related complaints identifying one underlying civic problem |
| Hotspot | A geographic area with high complaint density or escalation risk |
| SLA | Service Level Agreement — time limit for complaint resolution |
| Escalation | Automatic routing to higher authority when SLA breaches |
| Civic Insight | An AI-generated, evidence-backed recommendation for government action |

---

## 2. Overall Description

### 2.1 Product Perspective
CivicLens operates as a **predictive decision-support layer** above traditional complaint management. It is NOT a replacement for CPGRAMS but a complementary intelligence platform.

### 2.2 Product Functions (Summary)
1. Multi-modal complaint ingestion (text, image, video, voice, location)
2. AI-powered classification and severity assessment
3. Duplicate detection and complaint deduplication
4. Geographic issue clustering and hotspot identification
5. Escalation risk prediction
6. Evidence-backed AI recommendations
7. Department routing and SLA management
8. Field worker task management and evidence verification
9. Resolution verification (AI + officer + citizen confirmation)
10. City-wide analytics and reporting

### 2.3 User Classes
| Role | Description |
|------|-------------|
| Citizen | Reports complaints, tracks status, confirms resolution |
| Field Worker | Executes assigned tasks, uploads evidence |
| Department Officer | Reviews complaints, assigns work, approves resolutions |
| Department Supervisor | Monitors workload, tracks SLA, reviews clusters |
| Municipal Administrator | City-wide intelligence view, resource decisions |
| Super Admin | System configuration, department setup, SLA rules |

### 2.4 Operating Environment
- Web application (Progressive Web App)
- Mobile-responsive design
- Modern browsers (Chrome 100+, Firefox 100+, Safari 15+)
- Backend: Python 3.11+, FastAPI
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Database: PostgreSQL + PostGIS (SQLite for MVP)
- Maps: OpenStreetMap + MapLibre GL

---

## 3. Functional Requirements

### FR-01: User Authentication
- **FR-01.1** System shall support mobile number + OTP authentication
- **FR-01.2** System shall support email + password authentication
- **FR-01.3** System shall enforce role-based access control (RBAC)
- **FR-01.4** Roles: Citizen, Field Worker, Officer, Supervisor, Administrator, Super Admin
- **FR-01.5** JWT-based session management with refresh tokens

### FR-02: Complaint Submission
- **FR-02.1** Citizens shall submit complaints via text description
- **FR-02.2** Citizens shall attach photo evidence (max 10MB per image, up to 5 images)
- **FR-02.3** Citizens shall attach video evidence (max 50MB)
- **FR-02.4** Citizens shall submit voice descriptions (converted to text via STT)
- **FR-02.5** Location shall be captured via GPS auto-detect, map pin, or address search
- **FR-02.6** Complaint submission shall complete in under 60 seconds

### FR-03: AI Complaint Classification
- **FR-03.1** System shall classify complaint into: Category, Subcategory, Department
- **FR-03.2** System shall assign Severity: Low / Medium / High / Critical
- **FR-03.3** System shall assign Priority Score (0–100)
- **FR-03.4** System shall display AI confidence score
- **FR-03.5** Complaints with confidence < 60% shall be flagged for human review
- **FR-03.6** Officers shall be able to override AI classification

### FR-04: Priority Engine
Priority Score = f(Severity, Population Impact, Location Risk, Complaint Frequency, Duration, Escalation Probability)

| Score | Priority Level |
|-------|---------------|
| 0–30  | Low |
| 31–55 | Medium |
| 56–75 | High |
| 76–100 | Critical |

- **FR-04.1** Priority weights shall be configurable by administrators
- **FR-04.2** Priority shall recalculate on new related complaints

### FR-05: Duplicate Detection
- **FR-05.1** System shall detect semantically similar complaints within geographic proximity
- **FR-05.2** Similarity score shall be displayed (0–100%)
- **FR-05.3** Duplicate complaints remain individually traceable
- **FR-05.4** Duplicate complaints are linked to the master issue cluster

### FR-06: Issue Clustering
- **FR-06.1** System shall group complaints by: semantic similarity + geographic proximity + time + category
- **FR-06.2** Each cluster shall display: complaint count, dominant category, geographic bounds, growth rate, risk score
- **FR-06.3** System shall detect "emerging clusters" with rapid complaint growth
- **FR-06.4** Cluster growth rate shall be calculated over 7-day rolling window

### FR-07: Civic Intelligence Map
- **FR-07.1** Map shall display complaint density heatmap
- **FR-07.2** Map shall display issue clusters with severity color coding (Red/Orange/Yellow/Blue)
- **FR-07.3** Map shall display SLA breach indicators
- **FR-07.4** Map shall display department boundaries / ward boundaries
- **FR-07.5** Clicking a hotspot opens the intelligence panel
- **FR-07.6** Map shall support zoom levels from city to street level

### FR-08: Escalation Risk Prediction
- **FR-08.1** System shall calculate escalation risk score (0–100%) for each cluster
- **FR-08.2** Risk factors: complaint velocity, severity, duration, proximity to schools/hospitals, historical patterns
- **FR-08.3** System shall display: trend direction, risk score, predicted outcome, recommended action
- **FR-08.4** Risk > 70% triggers alert notification to officers/administrators

### FR-09: AI Recommendations
- **FR-09.1** System shall generate evidence-backed civic insights
- **FR-09.2** Every recommendation shall display: supporting evidence, risk score, recommended action, time urgency
- **FR-09.3** Recommendations shall be ranked by urgency
- **FR-09.4** Officers can mark recommendations as Accepted / Deferred / Dismissed

### FR-10: Department Routing
- **FR-10.1** System shall automatically route complaints to the correct department
- **FR-10.2** Officers can override department assignment
- **FR-10.3** System shall route to ward-level officer
- **FR-10.4** Routing audit trail shall be maintained

### FR-11: SLA Management
| Priority | SLA |
|----------|-----|
| Critical | 24 hours |
| High | 48 hours |
| Medium | 5 days |
| Low | 10 days |

- **FR-11.1** SLA timers start when complaint is classified
- **FR-11.2** System shall display SLA countdown for each complaint
- **FR-11.3** SLA configuration shall be editable by Super Admin

### FR-12: Escalation Workflow
If SLA expires: Field Officer → Supervisor → Department Head → Municipal Administrator
- **FR-12.1** Escalation notifications sent at each stage
- **FR-12.2** Escalation rules configurable per department

### FR-13: Field Worker Module
- **FR-13.1** Workers see assigned tasks with: issue, location, priority, description, deadline
- **FR-13.2** Worker actions: Accept, Start Work, Upload Evidence, Add Notes, Mark Complete
- **FR-13.3** Navigation link to Google Maps / Apple Maps for field location
- **FR-13.4** Worker can upload before/after photos

### FR-14: Resolution Verification
- **FR-14.1** AI compares before/after evidence images
- **FR-14.2** AI generates visual change confidence score
- **FR-14.3** AI verification does NOT autonomously approve resolutions
- **FR-14.4** Officer manually approves/rejects resolution
- **FR-14.5** Citizen receives confirmation request

### FR-15: Citizen Confirmation
- **FR-15.1** Citizen receives: "Has this issue been resolved?" notification
- **FR-15.2** Citizen can confirm resolution or dispute
- **FR-15.3** Dispute reasons: Issue persists / Partial resolution / Wrong issue resolved / Other
- **FR-15.4** Disputed resolutions are automatically reopened

### FR-16: Dashboards
**Citizen:** My complaints list, status badges, complaint timeline, tracking number
**Officer:** Daily KPIs (Total, Critical, Pending, SLA Breaches, Resolution Rate), complaint queue, assignment controls
**Administrator:** City intelligence (emerging issues, hotspots, SLA breaches, overloaded departments), civic map, AI recommendations

### FR-17: Analytics
- Complaint volume over time
- Issue distribution by category and ward
- Resolution rate trends
- SLA compliance rate
- Department performance comparison
- Average resolution time

### FR-18: Notifications
- In-app notifications for all roles
- Email notifications (configurable)
- SMS notifications (citizen-facing key events)

### FR-19: Audit Trail
Every action recorded: who, what, when, result. Immutable audit log per complaint.

### FR-20: Multilingual Support (MVP)
- English, Hindi, Bengali
- System normalizes input language for classification

---

## 4. Non-Functional Requirements

### NFR-01: Performance
- Page load time < 2 seconds (LCP)
- API response time < 500ms (95th percentile)
- Map render < 1 second for 10,000 markers
- Support 10,000 concurrent users (production target)

### NFR-02: Security
- HTTPS only
- JWT authentication with expiry
- RBAC enforced at API level
- Rate limiting on all public endpoints
- Signed URLs for media access
- No PII exposed to unauthorized roles
- Input sanitization / SQL injection prevention

### NFR-03: Reliability
- 99.5% uptime SLA (production)
- Graceful degradation if AI engine is slow
- Offline-capable complaint drafting (PWA)

### NFR-04: Scalability
- Horizontal scaling support
- Multi-municipality architecture (future)
- Stateless API design

### NFR-05: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Sufficient color contrast (4.5:1 minimum)
- Non-color-only status indicators
- Screen reader compatible labels

### NFR-06: Usability
- Citizen complaint submission: < 60 seconds
- Mobile-first responsive design
- **Neubrutalism Design System:** Implementation of high-contrast, bold borders, and solid colors to ensure clarity, accessibility, and a grounded, human-centric aesthetic (specifically avoiding generic AI-SaaS tropes).
- Progressive Web App (installable)

---

## 5. Data Requirements

### 5.1 Complaint Categories
Roads, Potholes, Drainage, Water Supply, Garbage/Sanitation, Streetlights, Public Infrastructure, Traffic, Noise, Other

### 5.2 Departments
Roads, Water Supply, Sanitation, Electricity, Traffic, Parks, Health, Education, Housing, Planning, Revenue, Emergency

### 5.3 Retention
- Active complaints: indefinite
- Resolved complaints: 5 years
- Audit logs: 10 years
- Media evidence: 5 years

---

## 6. External Interfaces

### 6.1 Maps
- OpenStreetMap tile server
- MapLibre GL JS for rendering
- Nominatim for geocoding

### 6.2 AI Services
- Gemini API (optional) for text classification
- Web Speech API for voice input (browser-native)
- Canvas API for image analysis simulation

### 6.3 Notifications
- SMTP for email
- Twilio / SMS gateway for SMS (future)

---

## 7. Constraints

1. No autonomous decisions — all AI recommendations require human approval
2. Citizen PII not exposed beyond citizen's own view
3. AI predictions are advisory, not authoritative
4. MVP built within SIH hackathon timeline
7. All demo data must be realistic synthetic data (no real citizen data)

---

## 8. Help & Glossary

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
