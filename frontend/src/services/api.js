// Sentinel API Client Service
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000');

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    let errMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      errMessage = parsed.detail || parsed.message || errMessage;
    } catch {
      if (errorText) errMessage = errorText;
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export const api = {
  // ── Executive Stats ──
  async getDashboardStats() {
    const res = await fetch(`${BASE_URL}/api/stats`);
    return handleResponse(res);
  },

  // ── Runs & Audit Trail ──
  async getRuns() {
    const res = await fetch(`${BASE_URL}/api/runs`);
    return handleResponse(res);
  },

  async getRunDetail(runId) {
    const res = await fetch(`${BASE_URL}/api/runs/${encodeURIComponent(runId)}`);
    return handleResponse(res);
  },

  async getRecentEvents(limit = 30) {
    const res = await fetch(`${BASE_URL}/api/events?limit=${limit}`);
    return handleResponse(res);
  },

  // ── Approvals (Human-in-the-Loop) ──
  async getPendingApprovals() {
    const res = await fetch(`${BASE_URL}/api/approve/pending`);
    return handleResponse(res);
  },

  async submitApproval({ eventId, decision, approvedBy, reason }) {
    const res = await fetch(`${BASE_URL}/api/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: Number(eventId),
        decision,
        approved_by: approvedBy || 'Security Operator (Human)',
        reason: reason || `Manual decision: ${decision}`
      })
    });
    return handleResponse(res);
  },

  // ── Cryptographic Verification ──
  async verifyRun(runId) {
    const res = await fetch(`${BASE_URL}/api/verify/${encodeURIComponent(runId)}`);
    return handleResponse(res);
  },

  async verifyAllRuns() {
    const res = await fetch(`${BASE_URL}/api/verify`);
    return handleResponse(res);
  },

  // ── Signature Hackathon Demo: Tamper Lab ──
  async injectTampering({ eventId, maliciousTarget }) {
    const res = await fetch(`${BASE_URL}/api/tamper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: Number(eventId),
        malicious_target: maliciousTarget || 'exfiltrate_secrets.sh',
        malicious_action: 'unauthorized_patch'
      })
    });
    return handleResponse(res);
  },

  async restoreTampering({ eventId, runId }) {
    const res = await fetch(`${BASE_URL}/api/tamper/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId ? Number(eventId) : null,
        run_id: runId || null
      })
    });
    return handleResponse(res);
  },

  // ── Bob Simulation Runner ──
  async triggerSimulation({ includePending = true } = {}) {
    const res = await fetch(`${BASE_URL}/api/simulate?include_pending_approval=${includePending}`, {
      method: 'POST'
    });
    return handleResponse(res);
  }
};
