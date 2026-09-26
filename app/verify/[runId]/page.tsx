import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { computeEventHash, GENESIS_HASH, EventData } from "@/lib/hash-chain";

export const dynamic = "force-dynamic";

interface VerifyResult {
  verified: boolean;
  event_count?: number;
  failed_event_id?: number;
  expected_hash?: string;
  actual_hash?: string;
}

async function verifyChain(runId: string): Promise<VerifyResult> {
  const run = await prisma.run.findUnique({ where: { bob_task_id: runId } });
  if (!run) return { verified: false };

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
      return {
        verified: false,
        failed_event_id: event.id,
        expected_hash: expected,
        actual_hash: event.event_hash,
      };
    }
    currentPreviousHash = event.event_hash;
  }

  return { verified: true, event_count: events.length };
}

export default async function VerifyPage({
  params,
}: {
  params: { runId: string };
}) {
  const run = await prisma.run.findUnique({
    where: { bob_task_id: params.runId },
  });
  if (!run) notFound();

  const events = await prisma.event.findMany({
    where: { run_id: params.runId },
    orderBy: { id: "asc" },
  });

  const result = await verifyChain(params.runId);

  const verifiedCount = result.verified
    ? events.length
    : result.failed_event_id
    ? events.findIndex((e) => e.id === result.failed_event_id)
    : 0;

  const pct = events.length > 0 ? Math.round((verifiedCount / events.length) * 100) : 100;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Chain Verification</h1>
          <div className="hash">{params.runId}</div>
        </div>
        <Link href={`/runs/${params.runId}`} style={{ color: "#58a6ff", fontSize: 13, textDecoration: "none" }}>
          ← Run Timeline
        </Link>
      </div>

      {result.verified ? (
        <div className="verify-pass">
          ✅ CHAIN VERIFIED — {result.event_count} events, all intact
        </div>
      ) : (
        <div className="verify-fail">
          ❌ VERIFICATION FAILED
          {result.failed_event_id && (
            <div className="detail">
              <div>Event #{result.failed_event_id} modified</div>
              <div style={{ marginTop: 6 }}>
                <div className="hash-line">Expected: {result.expected_hash}</div>
                <div className="hash-line">Received: {result.actual_hash}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#8b949e", fontSize: 12 }}>Events verified</span>
          <span style={{ fontSize: 12 }}>{verifiedCount} / {events.length} ({pct}%)</span>
        </div>
        <div className="progress-bg">
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: result.verified ? "#3fb950" : "#f85149",
            }}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Chain</th>
              <th>#</th>
              <th>Type</th>
              <th>Action</th>
              <th>Target</th>
              <th>Stored Hash</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => {
              const isFailed = event.id === result.failed_event_id;
              const isAfterFail =
                result.failed_event_id != null &&
                event.id > result.failed_event_id;
              return (
                <tr key={event.id} style={isFailed ? { background: "#2d1116" } : {}}>
                  <td>
                    {isAfterFail ? (
                      <span style={{ color: "#8b949e" }}>—</span>
                    ) : isFailed ? (
                      <span className="chain-dot chain-dot-fail" />
                    ) : (
                      <span className="chain-dot chain-dot-ok" />
                    )}
                  </td>
                  <td style={{ fontFamily: "monospace", color: "#8b949e" }}>{i + 1}</td>
                  <td>{event.event_type}</td>
                  <td>{event.action}</td>
                  <td className="hash">{event.target}</td>
                  <td className="hash">{event.event_hash.slice(0, 16)}…</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
