import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_id, decision, approved_by, reason } = body;

  if (!event_id || !decision || !approved_by) {
    return NextResponse.json(
      { error: "Missing required fields: event_id, decision, approved_by" },
      { status: 400 }
    );
  }

  if (decision !== "APPROVED" && decision !== "DENIED") {
    return NextResponse.json(
      { error: "decision must be APPROVED or DENIED" },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({ where: { id: Number(event_id) } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const existing = await prisma.approval.findUnique({
    where: { event_id: Number(event_id) },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Event already has a decision" },
      { status: 409 }
    );
  }

  const approval = await prisma.approval.create({
    data: {
      event_id: Number(event_id),
      decision,
      approved_by,
      reason: reason ?? null,
    },
  });

  return NextResponse.json(approval);
}
