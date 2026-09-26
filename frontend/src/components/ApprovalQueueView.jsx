import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  AlertTriangle, 
  FileCode, 
  Clock, 
  UserCheck, 
  ShieldCheck,
  Terminal,
  CornerDownRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ApprovalQueueView({ 
  pendingApprovals, 
  onRefresh, 
  runs 
}) {
  const [submittingId, setSubmittingId] = useState(null);
  const [reviewerName, setReviewerName] = useState('Lead Engineer');
  const [reviewNote, setReviewNote] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  async function handleDecision(eventId, decision) {
    setSubmittingId(eventId);
    try {
      await api.submitApproval({
        eventId,
        decision,
        approvedBy: reviewerName || 'Security Operator',
        reason: reviewNote || `Human decision recorded: ${decision}`
      });
      setActionSuccessMessage(`Event #${eventId} successfully marked as ${decision}!`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      onRefresh && onRefresh();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSubmittingId(null);
      setReviewNote('');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={22} color="#F59E0B" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF' }}>
              Human-in-the-Loop Approval Queue
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Active control gate. Bob pauses sensitive execution until a verified human operator authorizes the action.
            </p>
          </div>
        </div>

        {actionSuccessMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px 18px',
            borderRadius: '8px',
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#34D399',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Operator Details Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} color="#06B6D4" />
          <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Reviewer Identity:</span>
        </div>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="e.g. Lead Engineer / Security Officer"
          style={{
            background: '#0B0F19',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            padding: '6px 14px',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            outline: 'none',
            minWidth: '220px'
          }}
        />
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
          All approval decisions are cryptographically recorded into the Postgres governance audit trail.
        </span>
      </div>

      {/* Pending Items List */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Pending High-Risk Operations</span>
          <span style={{
            background: pendingApprovals.length > 0 ? '#EF4444' : '#10B981',
            color: '#FFF',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            {pendingApprovals.length}
          </span>
        </h2>

        {pendingApprovals.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <ShieldCheck size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
              No Pending High-Risk Approvals
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '440px', margin: '0 auto' }}>
              All autonomous coding actions by Bob are within safe baseline parameters. Click "Simulate Bob Run" on top to generate a high-risk event to test this gate!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingApprovals.map((ev) => (
              <div 
                key={ev.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(19,25,38,0.9))'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px'
                    }}>
                      <AlertTriangle size={20} color="#EF4444" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-high">HIGH RISK ACTION</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Event #{ev.id}</span>
                        <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Run: {ev.run_id}</span>
                      </div>
                      
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                        Action: <span style={{ color: '#F87171' }}>{ev.action}</span> {ev.target}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CornerDownRight size={14} color="#F59E0B" />
                        <span>Reason: <strong style={{ color: '#FBBF24' }}>Destructive or sensitive operation detected by Policy Engine</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleDecision(ev.id, 'DENIED')}
                      disabled={submittingId === ev.id}
                      className="btn btn-deny"
                      style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    >
                      <X size={16} />
                      <span>DENY</span>
                    </button>

                    <button
                      onClick={() => handleDecision(ev.id, 'APPROVED')}
                      disabled={submittingId === ev.id}
                      className="btn btn-approve"
                      style={{ padding: '10px 22px', fontSize: '0.85rem' }}
                    >
                      <Check size={16} />
                      <span>APPROVE</span>
                    </button>
                  </div>

                </div>

                {/* Event Metadata Preview */}
                <div style={{
                  background: '#090D16',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: '#64748B'
                }}>
                  <div>
                    Timestamp: <span style={{ color: '#94A3B8' }}>{new Date(ev.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="font-mono">
                    SHA-256: <span style={{ color: '#06B6D4' }}>{ev.event_hash.slice(0, 24)}...</span>
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
