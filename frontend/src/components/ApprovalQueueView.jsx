import React, { useState } from 'react';
import { ShieldAlert, Check, X, AlertTriangle, Clock, UserCheck, ShieldCheck, CornerDownRight } from 'lucide-react';
import { api } from '../services/api';

const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
};

export default function ApprovalQueueView({ pendingApprovals, onRefresh, runs: _runs }) {
  const [submittingId, setSubmittingId]             = useState(null);
  const [reviewerName, setReviewerName]             = useState('Lead Engineer');
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  async function handleDecision(eventId, decision) {
    setSubmittingId(eventId);
    try {
      await api.submitApproval({
        eventId,
        decision,
        approvedBy: reviewerName || 'Security Operator',
        reason: `Human decision recorded: ${decision}`,
      });
      setActionSuccessMessage(`Event #${eventId} marked as ${decision}.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      onRefresh && onRefresh();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ ...card, borderColor: 'rgba(232,163,61,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '38px', height: '38px', flexShrink: 0,
            borderRadius: '8px',
            background: 'var(--accent-bg)',
            border: '1px solid rgba(232,163,61,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldAlert size={20} color="var(--accent)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
              Human-in-the-Loop Approval Queue
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Active control gate. Bob pauses sensitive execution until a verified human operator authorises the action.
            </p>
          </div>
        </div>

        {actionSuccessMessage && (
          <div style={{
            marginTop: '14px',
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'var(--success-bg)',
            border: '1px solid rgba(62,107,79,0.35)',
            color: 'var(--success)',
            fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <ShieldCheck size={16} />
            {actionSuccessMessage}
          </div>
        )}
      </div>

      {/* Reviewer identity bar */}
      <div style={{ ...card, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={16} color="var(--muted)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)' }}>Reviewer:</span>
        </div>
        <input
          type="text"
          value={reviewerName}
          onChange={e => setReviewerName(e.target.value)}
          placeholder="e.g. Lead Engineer / Security Officer"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '5px 12px',
            color: 'var(--ink)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            minWidth: '220px',
          }}
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          All decisions are recorded in the Postgres governance audit trail.
        </span>
      </div>

      {/* Pending items */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
            Pending High-Risk Operations
          </h2>
          <span style={{
            background: pendingApprovals.length > 0 ? 'var(--accent-bg)' : 'var(--success-bg)',
            color: pendingApprovals.length > 0 ? 'var(--accent)' : 'var(--success)',
            border: `1px solid ${pendingApprovals.length > 0 ? 'rgba(232,163,61,0.35)' : 'rgba(62,107,79,0.35)'}`,
            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px',
          }}>
            {pendingApprovals.length}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
            <ShieldCheck size={42} color="var(--success)" style={{ margin: '0 auto 14px', display: 'block' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
              No Pending Approvals
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
              All autonomous actions are within safe baseline parameters. Run a simulation to generate a high-risk event.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingApprovals.map((ev, idx) => (
              <div
                key={ev.id}
                style={{
                  ...card,
                  borderColor: 'rgba(232,163,61,0.35)',
                  background: 'rgba(232,163,61,0.03)',
                  animation: `fade-in 0.2s ease-out ${idx * 0.06}s both`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '34px', height: '34px', flexShrink: 0,
                      borderRadius: '8px',
                      background: 'var(--accent-bg)',
                      border: '1px solid rgba(232,163,61,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '2px',
                    }}>
                      <AlertTriangle size={18} color="var(--accent)" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                        <span className="badge badge-high">High Risk Action</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Event #{ev.id}</span>
                        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Run: {ev.run_id}</span>
                      </div>

                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '5px' }}>
                        Action: <span style={{ color: 'var(--danger)' }}>{ev.action}</span> {ev.target}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CornerDownRight size={13} color="var(--accent)" />
                        Reason: <strong style={{ color: 'var(--ink)' }}>Destructive or sensitive operation detected by Policy Engine</strong>
                      </div>
                    </div>
                  </div>

                  {/* Decision buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleDecision(ev.id, 'DENIED')}
                      disabled={submittingId === ev.id}
                      className="btn btn-deny"
                      style={{ padding: '9px 18px' }}
                    >
                      <X size={15} />
                      Deny
                    </button>
                    <button
                      onClick={() => handleDecision(ev.id, 'APPROVED')}
                      disabled={submittingId === ev.id}
                      className="btn btn-approve"
                      style={{ padding: '9px 20px' }}
                    >
                      <Check size={15} />
                      Approve
                    </button>
                  </div>
                </div>

                {/* Metadata footer */}
                <div style={{
                  background: 'var(--bg)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} />
                    {new Date(ev.timestamp).toLocaleString()}
                  </div>
                  <div className="mono" style={{ color: 'var(--muted)' }}>
                    SHA-256: {ev.event_hash.slice(0, 24)}…
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
