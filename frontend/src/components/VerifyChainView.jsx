import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldX, 
  RefreshCw, 
  AlertOctagon, 
  Lock, 
  Unlock, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  FileCode,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function VerifyChainView({ runs, selectedRunId, onSelectRun, onRefreshStats }) {
  const [currentRunId, setCurrentRunId] = useState(selectedRunId || (runs[0]?.id || 'run-001'));
  const [verificationData, setVerificationData] = useState(null);
  const [runDetail, setRunDetail] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTampering, setIsTampering] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (selectedRunId) {
      setCurrentRunId(selectedRunId);
    }
  }, [selectedRunId]);

  useEffect(() => {
    if (currentRunId) {
      runVerification(currentRunId);
    }
  }, [currentRunId]);

  async function runVerification(runId) {
    setIsVerifying(true);
    try {
      const [verifRes, detailRes] = await Promise.all([
        api.verifyRun(runId),
        api.getRunDetail(runId)
      ]);
      setVerificationData(verifRes);
      setRunDetail(detailRes);
      onRefreshStats && onRefreshStats();
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleDemoTamper() {
    if (!runDetail?.events || runDetail.events.length === 0) {
      alert("No events available in this run to tamper.");
      return;
    }
    // Pick event #2 or the first available event to tamper
    const targetEvent = runDetail.events.length >= 2 ? runDetail.events[1] : runDetail.events[0];
    
    setIsTampering(true);
    try {
      const res = await api.injectTampering({
        eventId: targetEvent.id,
        maliciousTarget: "exfiltrate_credentials.sh"
      });
      setNotification({
        type: 'danger',
        message: `🚨 DEMO TAMPER INJECTED: Event #${targetEvent.id} target secretly mutated in PostgreSQL to 'exfiltrate_credentials.sh'! Re-verifying chain...`
      });
      // Re-run verification to immediately showcase cryptographic failure!
      await runVerification(currentRunId);
    } catch (err) {
      alert(`Tamper injection error: ${err.message}`);
    } finally {
      setIsTampering(false);
    }
  }

  async function handleRestoreChain() {
    setIsRestoring(true);
    try {
      const res = await api.restoreTampering({ runId: currentRunId });
      setNotification({
        type: 'success',
        message: `✨ RESTORED: ${res.message} Re-verifying cryptographic chain...`
      });
      await runVerification(currentRunId);
    } catch (err) {
      alert(`Restore error: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  }

  const events = runDetail?.events || [];
  const isVerified = verificationData?.verified === true;
  const isFailed = verificationData?.verified === false;
  const failedEventId = verificationData?.failed_event_id;
  const auditList = verificationData?.events_audit || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header & Hackathon Signature Callout */}
      <div className="glass-panel" style={{ padding: '28px', border: isFailed ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-verified" style={{ background: 'rgba(6,182,212,0.15)' }}>
                Signature Hackathon Feature
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Mathematical Proof of Tamper Resistance
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Cryptographic Hash Chain Verification & Tamper Lab
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '700px' }}>
              Every event logged by IBM Bob is linked with SHA-256: <span className="font-mono" style={{ color: '#06B6D4' }}>H(n) = SHA256(H(n-1) + Payload)</span>.
              Any unauthorized alteration in the PostgreSQL database breaks the sequence and is instantly detected.
            </p>
          </div>

          {/* Interactive Presentation Demo Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => runVerification(currentRunId)}
              disabled={isVerifying}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={16} className={isVerifying ? 'animate-spin' : ''} />
              <span>{isVerifying ? 'Verifying...' : 'Verify Chain'}</span>
            </button>

            <button
              onClick={handleDemoTamper}
              disabled={isTampering}
              className="btn btn-tamper"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Flame size={16} color="#F87171" />
              <span>Demo Tampering (Mutate DB)</span>
            </button>

            {isFailed && (
              <button
                onClick={handleRestoreChain}
                disabled={isRestoring}
                className="btn btn-approve"
                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={16} />
                <span>Restore Chain</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Notification Banner */}
        {notification && (
          <div style={{
            marginTop: '20px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: notification.type === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            border: notification.type === 'danger' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(16,185,129,0.4)',
            color: notification.type === 'danger' ? '#FCA5A5' : '#6EE7B7',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Selector & Big Integrity Status Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Run Selector */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <label style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Audited Run ID
          </label>
          <select
            value={currentRunId}
            onChange={(e) => {
              setCurrentRunId(e.target.value);
              onSelectRun && onSelectRun(e.target.value);
            }}
            style={{
              width: '100%',
              background: '#0B0F19',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            {runs.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} ({r.bob_task_id})
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94A3B8' }}>
            <span>Total Events: <strong style={{ color: '#FFFFFF' }}>{verificationData?.event_count || events.length}</strong></span>
            <span>Algorithm: <strong className="font-mono" style={{ color: '#06B6D4' }}>SHA-256</strong></span>
          </div>
        </div>

        {/* Verification Result Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            background: isFailed ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: isFailed ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            {isVerified ? (
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 color="#10B981" size={26} />
              </div>
            ) : (
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle color="#EF4444" size={26} />
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: isVerified ? '#34D399' : '#F87171' }}>
                Verification Audit Verdict
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                {isVerified ? '🔒 CHAIN VERIFIED — ALL EVENTS VALID' : '❌ VERIFICATION FAILED — TAMPER DETECTED'}
              </div>
            </div>
          </div>

          {/* Hash Chain Progress Bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Hash Chain Integrity</span>
              <span style={{ fontWeight: '700', color: isVerified ? '#10B981' : '#EF4444' }}>
                {isVerified ? '100% SECURE' : 'COMPROMISED'}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: isVerified ? '100%' : '35%',
                height: '100%',
                background: isVerified ? 'linear-gradient(90deg, #10B981, #06B6D4)' : '#EF4444',
                transition: 'all 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: isVerified ? '#94A3B8' : '#FCA5A5' }}>
            {isVerified ? (
              <span>✓ Event integrity verified · ✓ No modification detected</span>
            ) : (
              <span>⚠️ Event #{failedEventId} modified in database without matching cryptographic hash!</span>
            )}
          </div>
        </div>

      </div>

      {/* Discrepancy Breakdown if Failed */}
      {isFailed && verificationData && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.4)', background: '#0F121C' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#F87171', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={18} />
            <span>Cryptographic Discrepancy Analysis (Event #{failedEventId})</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#07090E', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: '700', textTransform: 'uppercase' }}>Expected Recomputed Hash</div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#34D399', wordBreak: 'break-all', marginTop: '4px' }}>
                {verificationData.expected_hash}
              </div>
            </div>

            <div style={{ background: '#07090E', padding: '14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)' }}>
              <div style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: '700', textTransform: 'uppercase' }}>Database Received Hash</div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#F87171', wordBreak: 'break-all', marginTop: '4px' }}>
                {verificationData.actual_hash}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Chain Nodes (Genesis -> Event 1 -> Event 2 ...) */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
          Cryptographic Event Blocks & Links
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '24px' }}>
          Visual block succession showing genesis root hash linking sequentially to the current tip.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {events.map((ev, idx) => {
            const isCorrupted = isFailed && ev.id === failedEventId;

            return (
              <div 
                key={ev.id}
                className={`hash-node ${isCorrupted ? 'corrupted' : ''}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isCorrupted ? 'rgba(239,68,68,0.2)' : 'rgba(6,182,212,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    color: isCorrupted ? '#EF4444' : '#06B6D4'
                  }}>
                    {isCorrupted ? '✕' : '✓'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#FFFFFF' }}>
                        Event {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        {ev.action} <span style={{ color: '#06B6D4' }}>{ev.target}</span>
                      </span>
                    </div>

                    <div className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B', display: 'flex', gap: '16px', marginTop: '4px' }}>
                      <span>Prev: {ev.previous_hash.slice(0, 16)}...</span>
                      <span>Hash: {ev.event_hash.slice(0, 16)}...</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isCorrupted ? (
                    <span className="badge badge-high">MUTATION DETECTED</span>
                  ) : (
                    <span className="badge badge-low">CRYPTOGRAPHICALLY VALID</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
