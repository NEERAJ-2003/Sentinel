"use client";

import { useState } from "react";

interface Props {
  eventId: number;
  runId: string;
}

export default function ApproveButton({ eventId, runId }: Props) {
  const [loading, setLoading] = useState<"approve" | "deny" | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(decision: "APPROVED" | "DENIED") {
    setLoading(decision === "APPROVED" ? "approve" : "deny");
    setError(null);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          decision,
          approved_by: "human-dashboard",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Unknown error");
      } else {
        setDone(decision);
        // Refresh the page to reflect updated approval state
        window.location.reload();
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return (
      <span className={`badge ${done === "APPROVED" ? "badge-ok" : "badge-fail"}`}>
        {done}
      </span>
    );
  }

  return (
    <span>
      <button
        className="btn btn-deny"
        disabled={!!loading}
        onClick={() => submit("DENIED")}
      >
        {loading === "deny" ? "…" : "Deny"}
      </button>
      <button
        className="btn btn-approve"
        disabled={!!loading}
        onClick={() => submit("APPROVED")}
      >
        {loading === "approve" ? "…" : "Approve"}
      </button>
      {error && <span style={{ color: "#f85149", fontSize: 11, marginLeft: 8 }}>{error}</span>}
    </span>
  );
}
