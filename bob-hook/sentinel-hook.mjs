#!/usr/bin/env node
/**
 * Sentinel — Bob workflow simulator
 * Simulates a full Bob coding session through the Sentinel pipeline.
 *
 * Usage: npm run simulate
 * Requires: Next.js dev server running at SENTINEL_API_URL (default http://localhost:3000)
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env.local manually (no dotenv dependency needed for a simple simulator)
function loadEnv() {
  try {
    const envPath = join(dirname(fileURLToPath(import.meta.url)), "../.env.local");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] ??= val;
    }
  } catch {
    // No .env.local — use defaults
  }
}

loadEnv();

const BASE_URL = process.env.SENTINEL_API_URL ?? "http://localhost:3000";
const RUN_ID = `sim-${Date.now()}`;

async function log(eventType, action, target, metadata = null) {
  const res = await fetch(`${BASE_URL}/api/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ run_id: RUN_ID, event_type: eventType, action, target, metadata }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /api/log failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function waitForApproval(eventId) {
  console.log(`\n⏳  Waiting for human approval of event #${eventId}...`);
  console.log(`   Approve:  curl -X POST ${BASE_URL}/api/approve -H "Content-Type: application/json" -d '{"event_id":${eventId},"decision":"APPROVED","approved_by":"human"}'`);
  console.log(`   Deny:     curl -X POST ${BASE_URL}/api/approve -H "Content-Type: application/json" -d '{"event_id":${eventId},"decision":"DENIED","approved_by":"human"}'`);

  while (true) {
    await sleep(2000);
    const res = await fetch(`${BASE_URL}/api/approve/${eventId}`);
    const data = await res.json();
    if (data.decision !== null) {
      console.log(`\n✅  Decision received: ${data.decision}`);
      return data.decision;
    }
    process.stdout.write(".");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function badge(risk) {
  return risk === "HIGH" ? "🔴 HIGH" : risk === "MEDIUM" ? "🟡 MEDIUM" : "🟢 LOW";
}

async function run() {
  console.log("━".repeat(60));
  console.log(`🚀  Sentinel Simulator — Run ID: ${RUN_ID}`);
  console.log(`📡  API: ${BASE_URL}`);
  console.log("━".repeat(60));

  const steps = [
    { eventType: "file_edit",    action: "modified",        target: "app/page.tsx",     metadata: { lines: 42 } },
    { eventType: "command_run",  action: "npm test",        target: "test suite",       metadata: null },
    { eventType: "file_create",  action: "created",         target: "lib/utils.ts",     metadata: null },
    { eventType: "file_delete",  action: "deleted",         target: "config.json",      metadata: null },   // HIGH
    { eventType: "command_run",  action: "git commit -m 'feat: add utils'", target: "repo", metadata: null },
  ];

  for (const step of steps) {
    const result = await log(step.eventType, step.action, step.target, step.metadata);

    console.log(`\n▶  ${step.eventType.padEnd(14)} "${step.action}" → ${step.target}`);
    console.log(`   event_id:  ${result.event_id}`);
    console.log(`   risk:      ${badge(result.risk_level)}`);
    console.log(`   hash:      ${result.event_hash.slice(0, 16)}...`);

    if (result.requires_approval) {
      const decision = await waitForApproval(result.event_id);
      if (decision === "DENIED") {
        console.log("\n🚫  Action denied. Stopping workflow.");
        process.exit(1);
      }
    }
  }

  // Verify the full chain
  console.log("\n━".repeat(60));
  console.log("🔍  Verifying hash chain...");
  const verifyRes = await fetch(`${BASE_URL}/api/verify/${RUN_ID}`);
  const verify = await verifyRes.json();

  if (verify.verified) {
    console.log(`✅  CHAIN VERIFIED — ${verify.event_count} events, all intact.`);
  } else {
    console.log(`❌  CHAIN BROKEN at event #${verify.failed_event_id}`);
    console.log(`   Expected: ${verify.expected_hash}`);
    console.log(`   Actual:   ${verify.actual_hash}`);
  }

  console.log("━".repeat(60));
  console.log(`\n🏁  Simulation complete. Run ID: ${RUN_ID}`);
  console.log(`   Dashboard: ${BASE_URL}/runs/${RUN_ID}`);
  console.log(`   Verify:    ${BASE_URL}/verify/${RUN_ID}`);
}

run().catch((err) => {
  console.error("Simulator error:", err.message);
  process.exit(1);
});
