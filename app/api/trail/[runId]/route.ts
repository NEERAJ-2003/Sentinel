import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { runId: string } }
) {
  const { runId } = params;

  const run = await prisma.run.findUnique({
    where: { bob_task_id: runId },
  });

  if (!run) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  const events = await prisma.event.findMany({
    where: { run_id: runId },
    orderBy: { id: "asc" },
    include: { approval: true },
  });

  const trail = events.map((event) => ({
    ...event,
    approval_status: event.approval
      ? event.approval.decision
      : event.risk_level === "HIGH"
      ? "PENDING"
      : null,
  }));

  return NextResponse.json({ run, events: trail });
}
