import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const eventId = Number(params.eventId);

  const approval = await prisma.approval.findUnique({
    where: { event_id: eventId },
  });

  if (!approval) {
    return NextResponse.json({ decision: null });
  }

  return NextResponse.json({ decision: approval.decision, approval });
}
