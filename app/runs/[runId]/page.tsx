import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function RiskBadge({ level }: { level: string }) {
  const cls =
    level === "HIGH" ? "badge badge-high" :
    level === "MEDIUM" ? "badge badge-medium" :
    "badge badge-low";
  return <span className={cls}>{level}</span>;
}

function ApprovalBadge({ status }: { status: string | null }) {
  if (!status) return null;
  if (status === "APPROVED") return <span className="badge badge-ok">APPROVED</span>;
  if (status === "DENIED")   return <span className="badge badge-fail">DENIED</span>;
  if (status === "PENDING")  return <span className="badge badge-pending">PENDING</span>;
  return null;
}

export default async function RunTimelinePage({
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
    include: { approval: true },
  });

  // Last verification for this run
  const lastVerify = await prisma.verificationResult.findFirst({
    where: { run_id: params.runId },
    orderBy: { verified_at: "desc" },
  });

  const failedId = lastVerify?.verified === false ? lastVerify.failed_event_id : null;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Run Timeline</h1>
          <div className="hash">{params.runId}</div>
        </div>
        <Link href={`/verify/${params.runId}`} className="btn btn-verify">
          Verify Chain
        </Link>
      </div>

      {lastVerify && (
        <div className={lastVerify.verified ? "verify-pass" : "verify-fail"} style={{ marginBottom: 24 }}>
          {lastVerify.verified
            ? `✅ Chain verified — ${events.length} events intact`
            : `❌ Chain broken at event #${lastVerify.failed_event_id}`}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Action</th>
              <th>Target</th>
              <th>Risk</th>
              <th>Approval</th>
              <th>Hash</th>
              <th>Chain</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => {
              const isFailed = event.id === failedId;
              const approval_status = event.approval
                ? event.approval.decision
                : event.risk_level === "HIGH"
                ? "PENDING"
                : null;

              return (
                <tr key={event.id} className="chain-row" style={isFailed ? { background: "#2d1116" } : {}}>
                  <td style={{ color: "#8b949e", fontFamily: "monospace" }}>{i + 1}</td>
                  <td>{event.event_type}</td>
                  <td>{event.action}</td>
                  <td className="hash">{event.target}</td>
                  <td><RiskBadge level={event.risk_level} /></td>
                  <td><ApprovalBadge status={approval_status} /></td>
                  <td className="hash">{event.event_hash.slice(0, 12)}…</td>
                  <td>
                    {isFailed ? (
                      <span className="chain-dot chain-dot-fail" title="Hash mismatch" />
                    ) : (
                      <span className="chain-dot chain-dot-ok" title="Hash valid" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {events.length === 0 && (
        <div className="empty">No events for this run yet.</div>
      )}
    </>
  );
}
