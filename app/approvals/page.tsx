import { prisma } from "@/lib/db";
import ApproveButton from "./ApproveButton";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  // Pending = HIGH risk events with no approval row yet
  const pending = await prisma.event.findMany({
    where: {
      risk_level: "HIGH",
      approval: null,
    },
    orderBy: { id: "asc" },
  });

  return (
    <>
      <h1>Approval Queue</h1>
      {pending.length === 0 ? (
        <div className="empty">No pending approvals.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event #</th>
                <th>Run</th>
                <th>Type</th>
                <th>Action</th>
                <th>Target</th>
                <th>Time</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((event) => (
                <tr key={event.id}>
                  <td style={{ fontFamily: "monospace", color: "#8b949e" }}>{event.id}</td>
                  <td className="hash">{event.run_id.slice(0, 20)}…</td>
                  <td>
                    <span className="badge badge-high">{event.event_type}</span>
                  </td>
                  <td className="approval-action">{event.action}</td>
                  <td className="hash">{event.target}</td>
                  <td style={{ color: "#8b949e", fontSize: 12 }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <ApproveButton eventId={event.id} runId={event.run_id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
