# Sentinel

A trust and governance layer for autonomous coding agents — built to audit
**IBM Bob**. It observes Bob's actions, evaluates how risky each one is,
keeps a human in control of anything sensitive, and produces a
cryptographically tamper-evident record of what Bob actually did.

**Architecture:** Bob → Observe → Analyze → Control → Record → Verify

Dev database runs in **Docker**; production uses **Neon** — same
Prisma schema, only `DATABASE_URL` changes.

---

## Backend status

This stage covers **Phases 1–6**: repo, database, `/api/log`, hash chain,
risk engine, `/api/approve`. The Next.js dashboard (Phase 7) is next, built
only once this backend is verified working end-to-end.

## 1. Repository structure

```
Sentinel/
├── bob_sessions/            # required hackathon evidence — Bob screenshots
├── app/
│   └── api/
│       ├── log/route.ts             POST — record a Bob action
│       ├── risk/route.ts            POST — test the risk engine standalone
│       ├── approve/route.ts         POST — record a human decision
│       ├── approve/[eventId]/route.ts  GET — poll for that decision
│       ├── trail/[runId]/route.ts   GET  — full run history
│       └── verify/[runId]/route.ts  GET  — recompute + check the hash chain
├── lib/
│   ├── db.ts            Prisma client
│   ├── hash-chain.ts    SHA-256 chain logic
│   ├── risk-engine.ts   rule-based LOW/MEDIUM/HIGH classifier
│   └── logger.ts        ties the above together for /api/log
├── bob-hook/
│   └── sentinel-hook.mjs   Bob integration point (+ standalone simulator)
├── prisma/
│   └── schema.prisma
├── docker-compose.yml   local Postgres for dev
├── README.md
├── package.json
└── .env.example
```

## 2. Database design

Four tables (see `prisma/schema.prisma` for exact fields):

- **runs** — one row per Bob session/task (`id`, `bob_task_id`, `started_at`, `ended_at`, `status`)
- **events** — one row per action Bob took, hash-chained (`event_type`, `action`, `target`, `metadata`, `previous_hash`, `event_hash`, `risk_level`)
- **approvals** — human decisions on HIGH-risk events (`event_id`, `decision`, `approved_by`, `reason`)
- **verification_results** — a record of each chain-integrity check (`run_id`, `verified`, `failed_event_id`, `verified_at`)

An event's approval status isn't stored on the event itself — it's derived:
HIGH risk + no matching row in `approvals` yet = **pending**.

## 3. Local development (Docker)

```bash
npm install
cp .env.example .env.local          # already points at the Docker DB by default

npm run docker:up                   # starts Postgres in Docker
npm run prisma:migrate              # creates the 4 tables
npm run dev                         # starts Next.js on :3000
```

Optional: `npm run prisma:studio` opens a GUI on the database if you want to
eyeball rows directly (and is also how you'll do the live tampering demo).

## 4. Test the backend without Bob yet

```bash
npm run simulate
```

This runs one full traced workflow: edit a file → run tests → attempt to
delete a secrets file (**HIGH risk — pauses**) → wait for you to approve it
via `POST /api/approve` → commit → verify the chain. Approve it manually
while it's waiting:

```bash
curl -X POST http://localhost:3000/api/approve \
  -H "Content-Type: application/json" \
  -d '{"event_id": 3, "decision": "APPROVED", "approved_by": "you"}'
```

(Use the event id the simulator prints.)

## 5. Wiring it to real IBM Bob

Port the `log()` / `waitForApproval()` logic from
`bob-hook/sentinel-hook.mjs` into whatever hook mechanism Bob exposes for
custom modes/Skills that run on each tool call — same payload shape:

```json
POST /api/log
{
  "run_id": "run-001",
  "event_type": "file_edit",
  "target": "app.py",
  "action": "modified"
}
```

For a HIGH-risk response (`requires_approval: true`), poll
`GET /api/approve/{event_id}` until `decision` is `"APPROVED"` or `"DENIED"`
before letting Bob proceed. If Bob has no accessible hook, fall back to an
external watcher that tails file changes / git log and forwards them the
same way.

## 6. Risk rules (Phase 5 — `lib/risk-engine.ts`)

| Action | Risk |
|---|---|
| file read / create / edit | LOW → auto-executes |
| `npm install` / dependency install | MEDIUM |
| file deletion, `rm -rf`, force push, `.env`/secrets, database drop | HIGH → requires approval |

Rule-based and deliberately simple for the prototype — swap in a smarter
classifier later without touching any caller.

## 7. Deploying (Neon + Vercel)

1. Create a free database at https://neon.tech, copy its connection string.
2. In Vercel's project settings, set `DATABASE_URL` to that string.
3. `vercel --prod`. The `build` script runs `prisma generate` automatically;
   run `npx prisma migrate deploy` once against the Neon URL to create the
   tables in production.

## 8. Demo script (for judges)

1. `npm run simulate` — watch events post live via terminal output (dashboard
   comes in Phase 7).
2. It hits the `delete_file` step — **HIGH risk, paused**.
3. Approve it via curl/Prisma Studio — the run continues and commits.
4. `curl http://localhost:3000/api/verify/<run_id>` — chain valid.
5. Open Prisma Studio, hand-edit one event's `action` field, re-run verify —
   it now reports exactly which event was tampered with. This is the
   strongest live moment: show it breaking, on purpose, in front of judges.

Don't forget: commit real Bob session screenshots into `bob_sessions/` before
submitting — that's required evidence, not optional polish.
