import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { classifyRisk } from "@/lib/risk-engine";
import { computeEventHash, GENESIS_HASH, EventData } from "@/lib/hash-chain";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { run_id, event_type, action, target, metadata } = body;

  if (!run_id || !event_type || !action || !target) {
    return NextResponse.json(
      { error: "Missing required fields: run_id, event_type, action, target" },
      { status: 400 }
    );
  }

  // Upsert the Run — capture the internal id (cuid) for FK use
  const run = await prisma.run.upsert({
    where: { bob_task_id: run_id },
    create: { bob_task_id: run_id },
    update: {},
  });

  // Find the last event in this run for chaining
  const lastEvent = await prisma.event.findFirst({
    where: { run_id: run.id },
    orderBy: { id: "desc" },
  });

  const previous_hash = lastEvent?.event_hash ?? GENESIS_HASH;
  const risk_level = classifyRisk(event_type, action, target);

  // Timestamp must be fixed before hashing so re-verification uses the same value
  const timestamp = new Date().toISOString();

  const eventData: EventData = {
    run_id,
    event_type,
    action,
    target,
    metadata: metadata ?? null,
    timestamp,
  };

  const event_hash = computeEventHash(previous_hash, eventData);

  const event = await prisma.event.create({
    data: {
      run_id: run.id,
      event_type,
      action,
      target,
      metadata: metadata ?? undefined,
      timestamp: new Date(timestamp),
      previous_hash,
      event_hash,
      risk_level,
    },
  });

  return NextResponse.json({
    event_id: event.id,
    risk_level,
    requires_approval: risk_level === "HIGH",
    event_hash,
  });
}
