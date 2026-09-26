import { NextRequest, NextResponse } from "next/server";
import { classifyRisk } from "@/lib/risk-engine";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, action, target } = body;

  if (!event_type || !action || !target) {
    return NextResponse.json(
      { error: "Missing required fields: event_type, action, target" },
      { status: 400 }
    );
  }

  const risk_level = classifyRisk(event_type, action, target);
  return NextResponse.json({ risk_level });
}
