# The Project of Ishit and Mitali
## LOOP — Enterprise AI Customer-Feedback Intelligence Platform

**Authors:** Ishit Jain & Mitali ([github.com/Mitali1044](https://github.com/Mitali1044))  
**GitHub Repository:** [https://github.com/ishitjainnimsuniversity-ai/ZIDIO-DEVELOPMENT](https://github.com/ishitjainnimsuniversity-ai/ZIDIO-DEVELOPMENT)  
**Google Share Link:** [https://share.google/GRuod2lShPtdkGNX7](https://share.google/GRuod2lShPtdkGNX7)  
**Version:** 3.0.0 (Unified Enterprise Master Edition)  
**Architecture:** Next.js + React + Tailwind CSS + Prisma + SQLite / PostgreSQL + pgvector + Claude AI + Web Speech Audio API

---

## 🌟 Executive Overview
**The Project of Ishit and Mitali (LOOP)** is an enterprise customer-feedback intelligence and Voice-of-Customer (VOC) platform. The platform merges multi-channel feedback ingestion, real-time sentiment analysis, statistical anomaly surge detection ($\ge 100\%$ volume spikes), automated executive VOC report generation, and an interactive **Ask LOOP** AI Copilot with Web Speech voice synthesis and microphone input.

---

## 🚀 Key Features

### 1. Unified Authentication & Multi-Tenancy (RBAC)
- **Role-Based Access Control**:
  - **`ADMIN`**: Full platform control (Write, Ingest, Status Updates, CSV Bulk Ingest, VOC Reports, Anomaly Monitoring, Delete Records, Team Invitations).
  - **`ANALYST`**: Intelligence suite (Single Ingest, Theme Clustering, Sentiment Analysis, VOC Reports, Ask LOOP Copilot).
  - **`VIEWER`**: Executive read-only portal (Real-time Analytics, Time-Series Charts, Theme Drilldown, and Ask LOOP queries).
- **Authentication**: NextAuth v5 credentials provider with bcrypt password hashing, plus API header resolution.

### 2. Grounded Conversational AI Copilot ("Ask LOOP")
- **Semantic Vector Retrieval**: 1536-dimensional vector embeddings with cosine similarity matching.
- **Strict Citation Deduplication**: Eliminates repetitive quotes across answers.
- **Voice AI Enabled**:
  - **Text-to-Speech (TTS)**: Natural audio briefing with 4-bar equalizer visualization.
  - **Speech-to-Text (STT)**: Hands-free voice querying via microphone.
- **Dual-Domain Intelligence**: Customer sentiment synthesis and practical cybersecurity/technical concept answering.

### 3. Real-Time Telemetry & Anomaly Surge Detection
- Statistical surge detector identifying volume spikes $\ge 100\%$ against rolling 7-day baselines.
- Anomaly surge alerts displayed across dashboards and telemetry streams.

### 4. Automated Voice-of-Customer (VOC) Reports & PDF Export
- Generates executive summaries, sentiment trajectories, friction drivers, and tactical engineering recommendations.
- 1-Click Executive PDF Export (`window.print()` with styled report CSS).

### 5. Multi-Channel Feedback Inbox & Bulk CSV Ingestion
- Real-time triage inbox with quick filter chips (`All`, `Spikes`, `Payments`, `2FA`, `Crashes`, `Delighters`).
- Bulk CSV drag-and-drop / paste ingestion with row-by-row validation.

---

## 📁 Project Architecture & Structure

```
The_Project_of_Ishit_and_Mitali/
├── app/
│   ├── (app)/
│   │   ├── ask/page.tsx             # Ask LOOP AI Copilot (Voice STT/TTS & Evidence Cards)
│   │   ├── dashboard/page.tsx       # Analytics Dashboard, Anomaly Alert Banner & KPIs
│   │   ├── inbox/                   # Feedback triage stream & new feedback form
│   │   ├── reports/page.tsx         # Voice-of-Customer AI Generator & PDF Export
│   │   ├── settings/page.tsx        # Workspace team members & role management
│   │   ├── showcase/page.tsx        # Live Cyber Command Center & Telemetry Ticker
│   │   └── trends/page.tsx          # Theme clustering & sentiment breakdown
│   ├── (auth)/
│   │   ├── login/page.tsx           # User login with credentials
│   │   └── signup/page.tsx          # Workspace & user registration
│   ├── api/
│   │   ├── analytics/               # Dashboard, Spikes, Themes, and Trends APIs
│   │   ├── ask-loop/route.ts        # Grounded semantic question-answering
│   │   ├── auth/[...nextauth]/      # NextAuth v5 authentication handlers
│   │   ├── feedback/                # Feedback CRUD, status batching & delete
│   │   ├── ingest/                  # CSV bulk parsing & webhook simulation
│   │   ├── invitations/             # Team invitation management
│   │   └── reports/voc/             # Executive VOC narrative generator
│   ├── globals.css                  # Cyber styling, animations, and audio waveforms
│   └── page.tsx                     # Public landing page
├── components/
│   ├── layout/Sidebar.tsx           # Navigation sidebar
│   └── ui/                          # Tailwind UI components
├── lib/
│   ├── ai/                          # Ask LOOP, Classifier, Embeddings, Claude, VOC Generator
│   ├── validation/                  # Zod validation schemas
│   ├── memory-store.ts              # In-memory fallback engine
│   └── prisma.ts                    # Prisma database client singleton
├── prisma/
│   ├── schema.prisma                # Primary SQLite database schema
│   ├── schema.postgresql.prisma     # Production PostgreSQL + pgvector schema
│   └── seed.ts                      # 150+ realistic multi-channel seeded feedback items
├── test/                            # 7 Vitest Test Suites (32 Tests - 100% Pass)
├── docs/                            # Architecture diagrams & API reference
├── setup_and_run.bat                # ⚡ 1-Click Complete Setup & Run
├── start_app.bat                    # 🚀 1-Click Server Starter
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## ⚡ How to Run

### Method 1: 1-Click Windows Launcher (Fastest)
Double-click **`setup_and_run.bat`** in the project folder. It will:
1. Install all dependencies (`npm install`).
2. Sync the database (`prisma db push`).
3. Seed 150+ customer feedback items and demo users (`prisma/seed.ts`).
4. Launch the application on **[http://localhost:3000](http://localhost:3000)**.

### Method 2: Command Line
```bash
# 1. Install dependencies
npm install

# 2. Sync database schema
npx prisma db push

# 3. Seed database
npm run prisma:seed

# 4. Run test suites
npm run test

# 5. Start dev server
npm run dev
```

---

## 🔑 Demo Login Credentials
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@loop.dev` | `password123` | Full administrative control & delete |
| **Analyst** | `analyst@loop.dev` | `password123` | Analytics, Ingestion, Reports & Ask LOOP |
| **Viewer** | `viewer@loop.dev` | `password123` | Read-only analytics & Ask LOOP |

---

## 🤝 Project Authors & Collaborators
- **Ishit Jain**: Lead Platform & AI Engineer ([ishitjainnimsuniversity-ai](https://github.com/ishitjainnimsuniversity-ai))
- **Mitali**: Project Partner & Collaborator ([Mitali1044](https://github.com/Mitali1044))
- **Google Share:** [https://share.google/GRuod2lShPtdkGNX7](https://share.google/GRuod2lShPtdkGNX7)
