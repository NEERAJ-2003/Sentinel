# Sentinel — Build Plan

## Top-Level Overview

**Goal:** Build "Sentinel" — a cryptographic trust and governance layer that audits IBM Bob's coding actions in real time.

**Pipeline:** Bob → Observe → Analyze → Control → Record → Verify

Every action Bob takes passes through this pipeline:
1. **Observe** — capture `event_type`, `action`, `target`, `metadata`
2. **Analyze** — classify risk as LOW / MEDIUM / HIGH via transparent rules
3. **Control** — LOW/MEDIUM run immediately; HIGH blocks until a human approves
4. **Record** — persist as a SHA-256 hash-chained event (tamper-evident)
5. **Verify** — recompute the full chain on demand; report intact or broken

**Stack:** Next.js 14 (App Router, TypeScript), Prisma ORM, PostgreSQL (Docker dev / Neon production), deployed on Vercel. No paid services.

**Phases:** 7 sequential phases, each verified before moving to the next.

---

## Sub-Task 1 — Repository & Project Bootstrap (Phase 1)

**Intent:** Create a working Next.js + TypeScript project with all dependencies installed, environment config templated, and a Docker Compose file for local Postgres.

**Expected Outcomes:**
- `package.json` exists with scripts: `dev`, `build`, `simulate`, `docker:up`, `docker:down`, `prisma:migrate`, `prisma:studio`
- `next.config.ts` (or `.js`) present
- `tsconfig.json` configured for App Router
- `.env.example` has both Docker and Neon `DATABASE_URL` variants plus `SENTINEL_API_URL`
- `.gitignore` already present; `.env.local` is excluded
- `docker-compose.yml` spins up a Postgres 16 container named `sentinel_db` on port 5432
- `bob_sessions/` directory created with a `.gitkeep`
- `npm install` completes successfully

**Todo List:**
1. Create `package.json` with `next`, `react`, `react-dom`, `@prisma/client`, `typescript`, `@types/node`, `@types/react`, `prisma` as dependencies; add all scripts
2. Create `tsconfig.json` for Next.js App Router (strict mode)
3. Create `next.config.ts`
4. Create `docker-compose.yml` with Postgres 16 service, named volume, healthcheck
5. Create `.env.example` with commented Docker and Neon `DATABASE_URL` entries
6. Create `bob_sessions/.gitkeep`
7. Run `npm install` and confirm it succeeds

**Relevant Context:**
- `.gitignore` already excludes `node_modules/`, `.next/`, `.env.local`, `.vercel`, `*.log`
- README specifies exact scripts: `simulate`, `docker:up`, `prisma:migrate`, `prisma:studio`

**Status:** [ ] pending

---

## Sub-Task 2 — Prisma Schema & Database Migration (Phase 2)

**Intent:** Define the four database models, run the initial migration against local Docker Postgres, and verify a manually inserted test event is stored correctly.

**Expected Outcomes:**
- `prisma/schema.prisma` has four models: `Run`, `Event`, `Approval`, `VerificationResult`
- Migration runs successfully: `npx prisma migrate dev --name init`
- `lib/db.ts` exports a singleton Prisma client
- One test event can be inserted via `npx prisma studio` or a seed script and confirmed visible

**Todo List:**
1. Create `prisma/schema.prisma` with `postgresql` provider, `env("DATABASE_URL")` url
2. Define `Run` model: `id` (String, cuid, @id), `bob_task_id` (String, unique), `started_at` (DateTime, default now), `ended_at` (DateTime?), `status` (String, default "active"), relation to `Event[]` and `VerificationResult[]`
3. Define `Event` model: `id` (Int, autoincrement, @id), `run_id` (String), `event_type` (String), `action` (String), `target` (String), `metadata` (Json?), `timestamp` (DateTime, default now), `previous_hash` (String), `event_hash` (String), `risk_level` (String), relations to `Run`, `Approval[]`
4. Define `Approval` model: `id` (Int, autoincrement, @id), `event_id` (Int, unique), `decision` (String), `approved_by` (String), `reason` (String?), `timestamp` (DateTime, default now), relation to `Event`
5. Define `VerificationResult` model: `id` (Int, autoincrement, @id), `run_id` (String), `verified` (Boolean), `failed_event_id` (Int?), `verified_at` (DateTime, default now), relation to `Run`
6. Create `lib/db.ts` — Prisma client singleton (dev pattern: use global to avoid hot-reload proliferation)
7. Start Docker Postgres: `docker compose up -d`
8. Copy `.env.example` to `.env.local` and point it at Docker DB
9. Run `npx prisma migrate dev --name init`
10. Insert one test `Run` and `Event` via Prisma Studio or a small seed script; confirm rows appear

**Relevant Context:**
- README clarifies: approval status is *derived* (HIGH + no matching `Approval` row = pending), not stored on the event itself
- The hash chain requires `previous_hash` and `event_hash` on each `Event`

**Status:** [ ] pending

---

## Sub-Task 3 — Hash Chain Library (Phase 4 prerequisite)

**Intent:** Build `lib/hash-chain.ts` — the pure cryptographic functions that compute `event_hash` and chain events together. Keeping this isolated makes it testable and ensures the `/api/log` and `/api/verify` routes share exactly the same logic.

**Expected Outcomes:**
- `lib/hash-chain.ts` exports:
  - `computeEventHash(previousHash: string, eventData: EventData): string` — SHA-256(previousHash + canonical JSON of eventData)
  - `GENESIS_HASH` constant (`"0".repeat(64)`) used as `previous_hash` for the first event in a run
- The function is deterministic: same inputs always produce the same hash
- No external crypto library needed — use Node's built-in `crypto` module

**Todo List:**
1. Create `lib/hash-chain.ts`
2. Define `EventData` interface: `{ event_type, action, target, metadata, timestamp, run_id }`
3. Implement `GENESIS_HASH = "0".repeat(64)`
4. Implement `computeEventHash`: use `crypto.createHash("sha256")`, update with `previousHash + JSON.stringify(eventData)` (sorted keys for canonical form), return hex digest
5. Export both

**Relevant Context:**
- Canonical JSON (sorted keys) is critical — insertion order differences would break chain verification
- README: "SHA256(previous_event_hash + this_event_data)"

**Status:** [ ] pending

---

## Sub-Task 4 — Risk Engine (Phase 5 prerequisite)

**Intent:** Build `lib/risk-engine.ts` — a transparent, rule-based classifier that assigns LOW / MEDIUM / HIGH to every Bob action. Keeping this separate from the API route makes rules auditable and swappable.

**Expected Outcomes:**
- `lib/risk-engine.ts` exports `classifyRisk(event_type: string, action: string, target: string): "LOW" | "MEDIUM" | "HIGH"`
- Rules exactly match the spec:
  - LOW: `event_type` is `file_read`, `file_create`, `file_edit`
  - HIGH: `file_delete`, `command_run` where action matches `rm -rf`, `git push --force`, `git reset --hard`, `drop database`, target matches `.env` or secrets patterns, `event_type` is `production_change`
  - MEDIUM: everything else (npm install, unrecognized)

**Todo List:**
1. Create `lib/risk-engine.ts`
2. Define `RiskLevel` type: `"LOW" | "MEDIUM" | "HIGH"`
3. Implement HIGH rules as an ordered list of checks (check HIGH first, then LOW, default MEDIUM)
4. HIGH triggers: `event_type === "file_delete"`, action contains `rm -rf`, action contains `git push --force`, action contains `git reset --hard`, action contains `drop` (case-insensitive, for DB drops), target matches `\.env` or `secret` or `credential` patterns
5. LOW triggers: `event_type` in `["file_read", "file_create", "file_edit"]`
6. Export `classifyRisk`

**Relevant Context:**
- README risk table: file_read/create/edit → LOW; npm install / unrecognized → MEDIUM; delete, rm -rf, force push, hard reset, .env/secrets, DB drop, production changes → HIGH

**Status:** [ ] pending

---

## Sub-Task 5 — POST /api/log (Phase 3 + wiring)

**Intent:** Build the central ingestion endpoint that ties together the Prisma client, hash-chain library, and risk engine. This is the endpoint Bob (or the simulator) calls for every action.

**Expected Outcomes:**
- `app/api/log/route.ts` accepts `POST` with body `{ run_id, event_type, action, target, metadata? }`
- Upserts the `Run` (creates if new, leaves alone if exists)
- Fetches the run's last event to get `previous_hash` (falls back to `GENESIS_HASH` if none)
- Classifies risk via `classifyRisk()`
- Computes `event_hash` via `computeEventHash()`
- Inserts the new `Event`
- Returns `{ event_id, risk_level, requires_approval: boolean, event_hash }`
- `requires_approval` is `true` when `risk_level === "HIGH"`
- Returns HTTP 400 for missing required fields

**Todo List:**
1. Create `app/api/log/route.ts`
2. Parse and validate request body; return 400 if `run_id`, `event_type`, `action`, or `target` missing
3. Upsert `Run`: `prisma.run.upsert({ where: { bob_task_id: run_id }, create: {...}, update: {} })`
4. Find last event for this run: `prisma.event.findFirst({ where: { run_id }, orderBy: { id: "desc" } })`
5. Compute `previous_hash` (last event's `event_hash` or `GENESIS_HASH`)
6. Call `classifyRisk()` to get `risk_level`
7. Build `EventData` object (including ISO timestamp string)
8. Call `computeEventHash(previous_hash, eventData)` to get `event_hash`
9. Insert `Event` via `prisma.event.create()`
10. Return JSON response with `event_id`, `risk_level`, `requires_approval`, `event_hash`
11. Test with `curl -X POST http://localhost:3000/api/log -H "Content-Type: application/json" -d '{"run_id":"run-001","event_type":"file_edit","action":"modified","target":"app.py"}'`; confirm row in DB

**Relevant Context:**
- `lib/db.ts` singleton must be used (not `new PrismaClient()` inline)
- Timestamp in `EventData` must be the same value stored in the DB row for hash verification to work later

**Status:** [ ] pending

---

## Sub-Task 6 — GET /api/verify/[runId] (Phase 4)

**Intent:** Build the chain-verification endpoint. It recomputes every event hash from scratch and compares against stored values — the key tamper-detection mechanism.

**Expected Outcomes:**
- `app/api/verify/[runId]/route.ts` accepts `GET`
- Fetches all events for the run ordered by `id` ascending
- Recomputes each `event_hash` from `previous_hash` + event data
- If all match: returns `{ verified: true, event_count: N }` and stores a passing `VerificationResult`
- If any mismatch: returns `{ verified: false, failed_event_id: N, expected_hash, actual_hash }` and stores a failing `VerificationResult`
- Returns 404 if run not found

**Todo List:**
1. Create `app/api/verify/[runId]/route.ts`
2. Fetch run to confirm it exists; return 404 if not
3. Fetch all events for run ordered by `id` ASC
4. Walk events: track `currentPreviousHash` starting at `GENESIS_HASH`; for each event, rebuild `EventData` from stored fields, call `computeEventHash(currentPreviousHash, eventData)`, compare to `event.event_hash`
5. On mismatch: store `VerificationResult { verified: false, failed_event_id }`, return failure response
6. On full pass: store `VerificationResult { verified: true }`, return success response
7. Test: POST two events, call verify, confirm pass; manually edit an event in Prisma Studio, re-verify, confirm failure with correct `failed_event_id`

**Relevant Context:**
- `EventData` reconstructed for verification must use exactly the same fields and serialization as at insertion time (Sub-Task 5 step 7)
- The timestamp stored in the DB must be used (not `new Date()`) during re-verification

**Status:** [ ] pending

---

## Sub-Task 7 — POST /api/approve + GET /api/approve/[eventId] (Phase 6)

**Intent:** Build the human-approval endpoints. `POST` records a decision; `GET` lets a blocked action poll until a human responds.

**Expected Outcomes:**
- `POST /api/approve` accepts `{ event_id, decision: "APPROVED" | "DENIED", approved_by, reason? }` and inserts into `approvals` table; returns 400 if event doesn't exist or already has a decision
- `GET /api/approve/[eventId]` returns `{ decision: "APPROVED"|"DENIED"|null, approval }` — null if still pending
- Both endpoints return appropriate HTTP status codes

**Todo List:**
1. Create `app/api/approve/route.ts` for POST
2. Validate body: `event_id`, `decision`, `approved_by` required; `decision` must be `APPROVED` or `DENIED`
3. Confirm event exists; return 404 if not
4. Check for existing approval; return 409 if already decided
5. Insert `Approval` row; return 200 with the created approval
6. Create `app/api/approve/[eventId]/route.ts` for GET
7. Query `approvals` table for most recent decision on this event; return `{ decision: null }` if none, or `{ decision, approval }` if found

**Relevant Context:**
- Approval status is derived: HIGH risk + no `Approval` row = pending. The GET endpoint makes this explicit.

**Status:** [ ] pending

---

## Sub-Task 8 — GET /api/trail/[runId] & POST /api/risk (supporting endpoints)

**Intent:** Build the remaining supporting endpoints referenced in the README. `trail` returns full run history; `risk` lets callers test the risk engine standalone.

**Expected Outcomes:**
- `GET /api/trail/[runId]` returns the run with all events (ordered by id), each event augmented with its approval status
- `POST /api/risk` accepts `{ event_type, action, target }` and returns `{ risk_level }` — useful for testing rules without inserting events

**Todo List:**
1. Create `app/api/trail/[runId]/route.ts`; fetch run + events ordered by id; join approvals; return structured JSON
2. Create `app/api/risk/route.ts`; call `classifyRisk()` and return result

**Status:** [ ] pending

---

## Sub-Task 9 — Bob Hook / Simulator (Phase 6 end-to-end)

**Intent:** Build `bob-hook/sentinel-hook.mjs` — a standalone Node script that simulates a complete Bob workflow and drives the full Sentinel pipeline end-to-end. This is the verification that Phases 1–6 are working before touching the UI.

**Expected Outcomes:**
- `npm run simulate` runs the script successfully
- Workflow: file_edit → command_run (npm test) → file_delete (HIGH — pauses) → polls for approval → approved → git_commit → chain verification
- Script prints each step with its `event_id`, `risk_level`, and `event_hash`
- The HIGH-risk `file_delete` step prints the `event_id` and waits for human approval (polls `GET /api/approve/{event_id}` every 2 seconds)
- After approval, continues and calls `GET /api/verify/{run_id}` — prints chain result
- On chain pass, prints success summary

**Todo List:**
1. Create `bob-hook/sentinel-hook.mjs` (ESM, no TypeScript compilation needed)
2. Implement `log(runId, eventType, action, target, metadata?)` function that POSTs to `/api/log` and returns the response
3. Implement `waitForApproval(eventId)` that polls `GET /api/approve/{eventId}` every 2s; returns decision when non-null
4. Build the workflow: POST 5–6 events in sequence; when `requires_approval: true`, call `waitForApproval()`
5. After all events, call `GET /api/verify/{runId}` and print result
6. Add `"simulate": "node bob-hook/sentinel-hook.mjs"` script to `package.json`
7. Run `npm run simulate`, observe the pause on the HIGH-risk event, approve via curl, confirm the run completes and chain verifies

**Relevant Context:**
- `SENTINEL_API_URL` from `.env.example` / `.env.local` (default `http://localhost:3000`)
- Simulator must print the exact `event_id` of the HIGH-risk event so the human can approve it

**Status:** [ ] pending

---

## Sub-Task 10 — Next.js Dashboard (Phase 7)

**Intent:** Build exactly four UI screens using Next.js App Router pages (React Server Components + minimal client islands for interactive buttons). No auth, no animations, no polish beyond what's listed.

**Expected Outcomes:**

**Screen 1 — Dashboard (`/`)**
- Active runs count, total events count, risky actions (HIGH+MEDIUM) count, pending approvals count, overall chain status

**Screen 2 — Run Timeline (`/runs/[runId]`)**
- Chronological list of all events in one run; each row shows event type, action, target, risk badge, hash (truncated), and a checkmark/cross for chain integrity; chain link visually connects event N to event N+1

**Screen 3 — Approval Queue (`/approvals`)**
- Table of all pending HIGH-risk events; each row has Approve and Deny buttons (POST to `/api/approve`); refreshes after decision

**Screen 4 — Verification (`/verify/[runId]`)**
- Calls `GET /api/verify/{runId}` on load; shows pass/fail banner; percentage of events verified; if failed, highlights the specific event with expected vs actual hash

**Todo List:**
1. Create `app/page.tsx` (Dashboard) — fetch stats from DB directly (Server Component), render 4 stat cards and a runs list
2. Create `app/runs/[runId]/page.tsx` (Run Timeline) — fetch events + approvals, render hash chain visualization event-by-event
3. Create `app/approvals/page.tsx` (Approval Queue) — fetch pending HIGH events, render table with approve/deny client component
4. Create `app/approvals/ApproveButton.tsx` — `"use client"` component that POSTs to `/api/approve`
5. Create `app/verify/[runId]/page.tsx` (Verification) — call verify endpoint, render chain status
6. Create `app/layout.tsx` with minimal nav linking all four screens
7. Add Tailwind CSS (or plain CSS modules) for minimal readable styling
8. Test the tampering demo: run simulate, open Prisma Studio, edit one event's `action` field, navigate to `/verify/{runId}` — confirm it shows failure with specific event and hash mismatch

**Relevant Context:**
- Hash chain must be visibly demonstrated event-by-event (checkmarks per event, not just a final pass/fail banner)
- The tampering demo is the strongest live moment — make the failed event and the hash diff clearly visible

**Status:** [ ] pending

---

## Sub-Task 11 — Bob Sessions Evidence Directory

**Intent:** Ensure the `bob_sessions/` directory exists and is committed, and document how to capture Bob session screenshots for submission evidence.

**Expected Outcomes:**
- `bob_sessions/` directory exists in the repo with a `.gitkeep` (or initial screenshot)
- README notes are already present; no additional documentation needed

**Todo List:**
1. Confirm `bob_sessions/.gitkeep` is committed
2. After each phase completion, save a screenshot or terminal capture to `bob_sessions/phase-N-complete.png` (or `.txt`)

**Status:** [ ] pending

---

## Implementation Order

```
Sub-Task 1  → project scaffold
Sub-Task 2  → schema + migration
Sub-Task 3  → hash-chain lib
Sub-Task 4  → risk engine
Sub-Task 5  → POST /api/log  (uses 2, 3, 4)
Sub-Task 6  → GET /api/verify  (uses 3)
Sub-Task 7  → /api/approve  (uses 2)
Sub-Task 8  → /api/trail + /api/risk  (uses 2, 4)
Sub-Task 9  → simulator end-to-end  (uses 5, 6, 7)
Sub-Task 10 → dashboard  (uses all API routes)
Sub-Task 11 → sessions evidence  (ongoing)
```
