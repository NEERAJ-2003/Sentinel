import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [runCount, eventCount, pendingApprovals, runs] = await Promise.all([
    prisma.run.count(),
    prisma.event.count(),
    prisma.event.count({
      where: {
        risk_level: "HIGH",
        approval: null,
      },
    }),
    prisma.run.findMany({
      orderBy: { started_at: "desc" },
      take: 10,
      include: { _count: { select: { events: true } } },
    }),
  ]);

  const riskyCount = await prisma.event.count({
    where: { risk_level: { in: ["HIGH", "MEDIUM"] } },
  });

  // Quick chain status: check latest verification result
  const latestVerification = await prisma.verificationResult.findFirst({
    orderBy: { verified_at: "desc" },
  });

  const chainStatus = latestVerification
    ? latestVerification.verified
      ? "VERIFIED"
      : "BROKEN"
    : "UNVERIFIED";

  return (
    <>
      <h1>Agent Trust Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Active Runs</div>
          <div className="value">{runCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Events</div>
          <div className="value">{eventCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Risky Actions</div>
          <div className="value">{riskyCount}</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending Approvals</div>
          <div className="value">{pendingApprovals}</div>
        </div>
        <div className="stat-card">
          <div className="label">Chain Status</div>
          <div className="value" style={{ fontSize: 16, marginTop: 8 }}>
            {chainStatus === "VERIFIED" && (
              <span className="chain-ok">● VERIFIED</span>
            )}
            {chainStatus === "BROKEN" && (
              <span className="chain-bad">✕ BROKEN</span>
            )}
            {chainStatus === "UNVERIFIED" && (
              <span style={{ color: "#8b949e" }}>— UNVERIFIED</span>
            )}
          </div>
        </div>
      </div>

      <h2>Recent Runs</h2>
      {runs.length === 0 ? (
        <div className="empty">No runs yet. Start the simulator to see data.</div>
      ) : (
        <div className="run-list">
          {runs.map((run) => (
            <Link key={run.id} href={`/runs/${run.bob_task_id}`} className="run-item">
              <div>
                <div className="run-id">{run.bob_task_id}</div>
                <div className="run-meta">
                  {run._count.events} event{run._count.events !== 1 ? "s" : ""} ·{" "}
                  {new Date(run.started_at).toLocaleString()}
                </div>
              </div>
              <div>
                <span className={`badge ${run.status === "active" ? "badge-low" : "badge-medium"}`}>
                  {run.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
