import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeEventHash, GENESIS_HASH, EventData } from "@/lib/hash-chain";

export async function GET(
  _req: NextRequest,
  { params }: { params: { runId: string } }
) {
  const { runId } = params;

  const run = await prisma.run.findUnique({ where: { bob_task_id: runId } });
  if (!run) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  const events = await prisma.event.findMany({
    where: { run_id: runId },
    orderBy: { id: "asc" },
  });

  let currentPreviousHash = GENESIS_HASH;

  for (const event of events) {
    const eventData: EventData = {
      run_id: event.run_id,
      event_type: event.event_type,
      action: event.action,
      target: event.target,
      metadata: event.metadata ?? null,
      timestamp: event.timestamp.toISOString(),
    };

    const expected = computeEventHash(currentPreviousHash, eventData);

    if (expected !== event.event_hash) {
      await prisma.verificationResult.create({
        data: { run_id: runId, verified: false, failed_event_id: event.id },
      });
      return NextResponse.json({
        verified: false,
        failed_event_id: event.id,
        expected_hash: expected,
        actual_hash: event.event_hash,
      });
    }

    currentPreviousHash = event.event_hash;
  }

  await prisma.verificationResult.create({
    data: { run_id: runId, verified: true },
  });

  return NextResponse.json({ verified: true, event_count: events.length });
}
