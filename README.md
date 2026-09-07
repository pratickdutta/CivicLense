# CivicLens 🔍
**AI-Powered Predictive Civic Intelligence Platform**

![CivicLens Banner](https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)

> CivicLens bridges the gap between citizens and local government. We turn raw community feedback into clear, actionable intelligence to build safer, smarter, and more responsive cities together.

Built for the **Smart India Hackathon 2026**, CivicLens operates as a predictive decision-support layer above traditional complaint management systems (like CPGRAMS). It is designed with a striking **Neubrutalism** aesthetic, focusing on accessibility, high contrast, and a human-centric approach.

---

## 📑 Table of Contents
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Key Features

* **Multi-Modal Complaint Ingestion:** Citizens can submit complaints via text, photos, video, or voice (auto-transcribed to text), with automatic GPS location detection.
* **AI-Powered Intelligence Engine:**
  * **Classification:** Automatically routes complaints to the correct department with assigned severity and priority scores.
  * **Duplicate Detection:** Fuzzy matching and geographic proximity grouping to prevent redundant work.
  * **Issue Clustering:** Groups localized complaints to identify geographic "Hotspots."
  * **Escalation Prediction:** Calculates risk scores based on complaint velocity, duration, and proximity to critical infrastructure (schools, hospitals).
* **Role-Based Portals:**
  * **Citizen Portal:** Track complaint status and verify resolutions.
  * **Admin/Officer Dashboard:** City-wide intelligence view, predictive analytics, and automated SLA tracking.
  * **Field Worker Portal:** Mobile-first task management and before/after evidence upload.

### ✨ Recent Updates (v1.1)
* **Neubrutalism UI Integration:** Fully updated styling with solid borders, sharp shadows, and high contrast.
* **Role-Based Dynamic Filtering:** Supervisor and Officer dashboards now dynamically filter map and analytics data to their respective ward/department.
* **Individual Complaints Drilldown:** Added a dedicated 'Complaints' tab to the AI Intelligence Engine.
* **UI/UX Fixes:** Corrected worker portal 'Accept Task' functionality and fixed citizen dashboard layout overlapping issues.

---

## 🏗 System Architecture

CivicLens uses a modern, decoupled architecture designed for scale and responsiveness:

* **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
* **Backend:** Python 3.11, FastAPI
* **Database:** PostgreSQL + PostGIS (for geospatial queries) + pgvector (for AI embeddings)
* **Maps:** OpenStreetMap + MapLibre GL
* **AI/ML:** Custom heuristics engine with optional LLM integration (Gemini API) for advanced classification.

For a deep dive into the architecture, view the [System Architecture Document](./docs/system_architecture.md).

---

## 📁 Project Structure

```text
CivicLens/
├── frontend/                 # Next.js 14 Web Application
│   ├── public/               # Static assets (logos, images)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (admin, citizen, worker)
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # Utilities, API clients, and auth logic
├── backend/                  # FastAPI Application (Pending full implementation)
├── docs/                     # Project Documentation (SRS, Architecture)
└── README.md                 # Project overview
```

---

## 🛠 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm, yarn, or pnpm
* Python 3.11+ (for backend development)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

*(Note: The backend integration is currently simulated via local mock data for UI/UX testing. Full API integration instructions will be added in upcoming releases.)*

---

## 📚 Documentation

Comprehensive project documentation is available in the `/docs` directory:

* [Software Requirements Specification (SRS)](./docs/SRS.md): Detailed breakdown of functional/non-functional requirements, user roles, and scope.
* [System Architecture](./docs/system_architecture.md): In-depth look at the component architecture, database schema, AI engine logic, and the complete intelligence loop sequence.

---

## 🤝 Contributing

This project is actively developed for the Smart India Hackathon. If you are part of the team, please ensure:
1. All UI components adhere to the established Neubrutalism design system (solid borders, sharp shadows, high contrast).
2. All new features are documented in the `docs/` directory.
3. Code passes `npm run lint` and `npm run build` before merging to `main`.

---

## 📄 License

This project is proprietary and developed specifically for the Smart India Hackathon. All rights reserved.
