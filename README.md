# Sentinel — AI Agent Trust & Cryptographic Governance

> **Autonomous AI Agent Governance & Tamper-Evident Audit Layer for IBM Bob**  
> *Observe → Analyze → Control → Record → Verify*

[![FastAPI](https://img.shields.io/badge/Backend-Python_FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB?style=flat&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/Integrity-SHA--256_Hash_Chain-success?style=flat)](https://en.wikipedia.org/wiki/SHA-2)

---

##  Project Pitch

Autonomous coding agents like **IBM Bob** have the capability to create features, execute system shell commands, drop databases, and push code directly to production repositories. While powerful, autonomous execution without safeguards poses severe security and compliance liabilities.

**Sentinel** is an active cryptographic trust and governance layer built specifically for **IBM Bob**. Rather than simply logging actions after the fact, Sentinel inserts an active policy control loop:
1. **Observe:** Intercepts Bob's actions (file changes, tool calls, shell executions, commits).
2. **Analyze:** Evaluates policy risk via a deterministic, transparent rule engine.
3. **Control:** Allows safe actions (`LOW`/`MEDIUM`) to execute automatically, but pauses execution on destructive or sensitive operations (`HIGH`) until a verified human operator signs off.
4. **Record:** Persists every event into PostgreSQL linked by a mathematical **SHA-256 cryptographic hash chain**.
5. **Verify:** Provides an interactive tamper-detection engine that recomputes the entire chain on-demand and instantly flags database tampering down to the exact modified record.

---

##  System Architecture

```
                 +-----------------------------------+
                 |            IBM BOB IDE            |
                 |        (Autonomous Coding)        |
                 +-----------------+-----------------+
                                   | Bob Skill / Mode Hook
                                   v
                 +-----------------+-----------------+
                 |        Agent Trace Client         |
                 |  - file edits       - commands    |
                 |  - commits          - tool calls  |
                 +-----------------+-----------------+
                                   | HTTPS
                                   v
                 +-----------------+-----------------+
                 |      Python FastAPI Gateway       |
                 |  /api/log           /api/risk     |
                 |  /api/approve       /api/verify   |
                 |  /api/tamper        /api/stats    |
                 +-----------------+-----------------+
                                   |
                                   v
                 +-----------------+-----------------+
                 |       Risk / Policy Engine        |
                 |  - Rule-based policy evaluation   |
                 +--------+--------------------+-----+
                          | LOW                | HIGH
                          v                    v
                          |            +-------+-------+
                          |            | Human Approval|
                          |            | Queue (Gate)  |
                          |            +-------+-------+
                          |                    | (Approved)
                          +----------+---------+
                                     |
                                     v
                 +-------------------+---------------+
                 |          Event Recorder           |
                 |  - Hash Chain: H(n) = SHA256(...) |
                 +-------------------+---------------+
                                     |
                                     v
                 +-------------------+---------------+
                 |           PostgreSQL              |
                 | (Docker Local / Neon Cloud Prod)  |
                 | - runs        - events            |
                 | - approvals   - verifications     |
                 +-------------------+---------------+
                                     |
                                     v
                 +-------------------+---------------+
                 |       React 18 Dashboard UI       |
                 |  1. Executive Trust Dashboard     |
                 |  2. Real-time Run Timeline        |
                 |  3. Human Approval Control Queue  |
                 |  4. Hash Chain & Tamper Demo Lab  |
                 +-----------------------------------+
```

---

##  Relational Database Schema (4 Tables)

1. **`runs`**: Tracks autonomous agent task lifecycles (`id`, `bob_task_id`, `started_at`, `ended_at`, `status`).
2. **`events`**: Immutable audit logs with sequential cryptographic hash chaining (`id`, `run_id`, `event_type`, `action`, `target`, `metadata_json`, `timestamp`, `previous_hash`, `event_hash`, `risk_level`).
3. **`approvals`**: Human decisions on high-risk actions (`id`, `event_id`, `decision: APPROVED|DENIED`, `approved_by`, `reason`, `timestamp`).
4. **`verification_results`**: History of cryptographic audit runs (`id`, `run_id`, `verified: true|false`, `failed_event_id`, `verified_at`).

---

##  Running the Project (Quickstart)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Docker & Docker Compose** (for local PostgreSQL)

---

### Step 1: Start PostgreSQL (Docker)
In the project root directory, launch the PostgreSQL 16 container:
```bash
docker compose up -d
```
> PostgreSQL will start on port `5433` (container user/password: `sentinel`/`sentinel`, database: `sentinel`).

---

### Step 2: Start the Python Backend (FastAPI)
1. Activate virtual environment (or create one):
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```
   *(or `python -m venv venv` then `pip install -r backend/requirements.txt`)*

2. Start the FastAPI server:
   ```bash
   python backend/run.py
   ```
   - **Backend API:** `http://localhost:8000`
   - **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`

> **Note:** The backend automatically verifies database tables and populates initial demo runs on first startup!

---

### Step 3: Start the React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Open your browser at: **`http://localhost:5173`**

---

### Step 4: Run the IBM Bob Simulation
You can trigger Bob sessions in **two ways**:
1. **From the React Dashboard:** Click the **`Simulate Bob Run`** button in the top navigation bar.
2. **From the CLI (Terminal):**
   ```bash
   python backend/simulate_bob.py
   ```
   Watch Bob perform real coding steps, hit the **HIGH-RISK CONTROL GATE** (e.g. `deleted config.json`), wait for your approval in the React Dashboard, and complete the cryptographic chain!

---

##  The 4 Next-Level Dashboard Screens

### 1. Screen 1 — Executive Trust Dashboard (`/dashboard`)
- **Real-time KPI Tiles:** Active Runs, Total Cryptographic Events, Risky Actions Detected, Pending Approvals.
- **Overall Chain Integrity Badge:** Instant cryptographic health indicator (`🟢 VERIFIED` or `🔴 TAMPER DETECTED`).
- **Live Ingestion Feed:** Streaming event monitor with risk badges.

### 2. Screen 2 — Run Timeline (`/timeline`)
- Select any agent run to inspect its chronological execution story.
- Detailed step-by-step audit: event types, action, target file paths, execution timestamps.
- Expandable drawers displaying the canonical JSON payload and truncated SHA-256 parent/child hashes.

### 3. Screen 3 — Human-in-the-Loop Approval Queue (`/approvals`)
- **Active Control Gate:** Holds sensitive agent actions in stasis until an operator decides.
- Displays policy warning reason, target file/command, and agent task context.
- One-click **`[ APPROVE ]`** and **`[ DENY ]`** buttons with instant API dispatch.

### 4. Screen 4 — Cryptographic Verification & Tamper Lab (`/verify`)
*(The signature presentation feature!)*
- **Visual Block Succession:** See Genesis hash link to Block 1, Block 2, Block 3...
- **"Demo Tampering" Button:** Injects a malicious modification directly into the PostgreSQL database (e.g. altering `config.json` to `exfiltrate_credentials.sh`) **without** updating the hash.
- **"Verify Chain" Button:** Re-audits the chain in real-time. Immediately flags:
  ```
  ❌ VERIFICATION FAILED
  Tamper Detected at Event #X!
  Expected Hash: 8f73a...
  Received Hash: 19ab2...
  ```
- **"Restore Chain" Button:** Restores authentic data with 1-click for clean demo repeatability.

---

##  Deploying with Neon PostgreSQL

To transition from local Docker Postgres to serverless cloud Neon PostgreSQL:
1. Create a free project at [neon.tech](https://neon.tech).
2. Copy your connection string:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"
   ```
3. Set `DATABASE_URL` in your `.env` or deployment platform (Vercel, Render, Railway, AWS).
4. The Python backend automatically detects Neon SSL and provisions all tables on boot.

---

##  Repository Directory Structure

```
Sentinel/
├── backend/                     # Python FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── hash_chain.py    # SHA-256 canonical hashing & chain verification
│   │   │   └── risk_engine.py   # Deterministic transparent policy evaluator
│   │   ├── routers/
│   │   │   ├── log.py           # POST /api/log
│   │   │   ├── risk.py          # POST /api/risk
│   │   │   ├── approve.py       # GET/POST /api/approve
│   │   │   ├── trail.py         # GET /api/runs, /api/events, /api/stats
│   │   │   ├── verify.py        # GET/POST /api/verify
│   │   │   ├── tamper.py        # POST /api/tamper & /api/tamper/restore (Demo Lab)
│   │   │   └── simulate.py      # POST /api/simulate
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # SQLAlchemy PostgreSQL connection
│   │   ├── models.py            # Relational models (runs, events, approvals, verifications)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── seed.py              # Initial realistic demo data
│   │   └── main.py              # FastAPI app & CORS configuration
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Backend entry point
│   └── simulate_bob.py          # CLI simulator for Bob workflows
│
├── frontend/                    # Next-Level React Dashboard (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Multi-screen navigation & brand header
│   │   │   ├── DashboardView.jsx# Screen 1: Executive Trust Dashboard
│   │   │   ├── TimelineView.jsx # Screen 2: Real-time Run Timeline
│   │   │   ├── ApprovalQueueView.jsx # Screen 3: Human Approval Queue
│   │   │   └── VerifyChainView.jsx   # Screen 4: Hash Chain & Tamper Lab
│   │   ├── services/
│   │   │   └── api.js           # API client service
│   │   ├── App.jsx              # Tab router & state manager
│   │   ├── index.css            # Custom cyber-governance design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js           # Proxy configuration to port 8000
│
├── bob-hook/                    # Integration hooks & session simulator
│   ├── simulate_bob.py          # Python Bob simulation hook
│   └── sentinel-hook.mjs        # Node.js simulation hook
│
├── bob_sessions/                # Required hackathon submission evidence
│   └── .gitkeep
│
├── docker-compose.yml           # PostgreSQL 16 container definition (port 5433)
├── .env.example                 # Example environment variables
└── README.md                    # Project documentation
```

---

##  Security & Cryptographic Invariants

- **Deterministic Canonicalization:** Payloads are serialized with strictly sorted keys, ensuring identical SHA-256 hashes across different programming languages and client platforms.
- **Genesis Binding:** Every run's chain originates from a fixed 64-character hex root:
  $$\text{GENESIS\_HASH} = 0^{64}$$
- **Sequential Linkage:**
  $$\text{Hash}_n = \text{SHA256}(\text{Hash}_{n-1} + \text{canonical}(E_n))$$
- **Separation of Concerns:** Human approval decisions are stored in a dedicated `approvals` relational table rather than mutable fields on the event itself, preserving historical immutability.
