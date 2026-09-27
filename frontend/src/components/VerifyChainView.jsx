import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Check, AlertOctagon, Flame, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import CustomSelect from './CustomSelect';

const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
};

export default function VerifyChainView({ runs, selectedRunId, onSelectRun, onRefreshStats }) {
  const initialRunId = selectedRunId || (runs[0]?.id || '');
  const [currentRunId, setCurrentRunId] = useState(initialRunId);
  const [verificationData, setVerificationData] = useState(null);
  const [runDetail, setRunDetail] = useState(null);
  const [isVerifying, setIsVerifying]   = useState(false);
  const [verifiedDone, setVerifiedDone] = useState(false);
  const [isTampering, setIsTampering]   = useState(false);
  const [isRestoring, setIsRestoring]   = useState(false);
  const [notification, setNotification] = useState(null);
  const [barWidth, setBarWidth] = useState(0);
  const barRafRef   = useRef(null);

  useEffect(() => {
    if (selectedRunId) setCurrentRunId(selectedRunId);
  }, [selectedRunId]);

  useEffect(() => {
    if (currentRunId) {
      loadRunData(currentRunId);
    }
  }, [currentRunId]);

  async function loadRunData(runId) {
    try {
      const detailRes = await api.getRunDetail(runId);
      setRunDetail(detailRes);
      if (detailRes?.verification) {
        setVerificationData(detailRes.verification);
        setVerifiedDone(detailRes.verification.verified === true);
        setBarWidth(detailRes.verification.verified ? 100 : 35);
      } else {
        setVerificationData(null);
        setVerifiedDone(false);
        setBarWidth(0);
      }
    } catch (err) {
      console.error('Failed to load run details:', err);
    }
  }

  async function runVerification(runId) {
    setIsVerifying(true);
    try {
      const [verifRes, detailRes] = await Promise.all([
        api.verifyRun(runId),
        api.getRunDetail(runId),
      ]);
      setBarWidth(0);
      // Let the browser paint the 0% bar first, then animate to target
      barRafRef.current = requestAnimationFrame(() => {
        barRafRef.current = requestAnimationFrame(() => {
          setBarWidth(verifRes?.verified ? 100 : 35);
        });
      });
      setVerificationData(verifRes);
      setRunDetail(detailRes);
      setVerifiedDone(verifRes?.verified === true);
      if (onRefreshStats) setTimeout(onRefreshStats, 950);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  }

  // Clean up any pending rAF on unmount
  useEffect(() => () => { if (barRafRef.current) cancelAnimationFrame(barRafRef.current); }, []);

  async function handleDemoTamper() {
    if (!runDetail?.events?.length) { alert('No events available to tamper.'); return; }
    const target = runDetail.events.length >= 2 ? runDetail.events[1] : runDetail.events[0];
    setIsTampering(true);
    try {
      await api.injectTampering({ eventId: target.id, maliciousTarget: 'exfiltrate_credentials.sh' });
      setNotification({ type: 'danger', message: `Demo tamper injected: Event #${target.id} mutated in DB. Re-verifying chain…` });
      await runVerification(currentRunId);
    } catch (err) {
      alert(`Tamper error: ${err.message}`);
    } finally {
      setIsTampering(false);
    }
  }

  async function handleRestoreChain() {
    setIsRestoring(true);
    try {
      const res = await api.restoreTampering({ runId: currentRunId });
      setNotification({ type: 'success', message: `Restored: ${res.message} Re-verifying…` });
      await runVerification(currentRunId);
    } catch (err) {
      alert(`Restore error: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  }

  const events        = runDetail?.events     || [];
  const isVerified    = verificationData?.verified === true;
  const isFailed      = verificationData?.verified === false;
  const isPending     = !verificationData;
  const failedEventId = verificationData?.failed_event_id;

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ ...card, borderColor: isFailed ? 'rgba(178,58,46,0.35)' : isVerified ? 'rgba(62,107,79,0.3)' : 'rgba(232,163,61,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-verified">Cryptographic Verification</span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
              Hash Chain Verification & Tamper Lab
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '680px' }}>
              Every event logged by IBM Bob is linked with SHA-256:{' '}
              <span className="mono" style={{ color: 'var(--accent)' }}>H(n) = SHA256(H(n-1) + Payload)</span>.{' '}
              Any unauthorised alteration in the PostgreSQL database breaks the sequence and is instantly detected.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', overflow: 'hidden' }}>
            <button
              onClick={() => runVerification(currentRunId)}
              disabled={isVerifying}
              className="btn btn-secondary"
              title={verifiedDone ? "Chain is verified. Click to re-verify." : isVerifying ? "Verifying cryptographic chain..." : "Click to manually verify cryptographic hash chain."}
              style={{
                borderColor: (verifiedDone && !isVerifying) ? 'var(--success)' : undefined,
                transition: 'border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Icon slot — both icons share the same 14×14 cell via CSS grid stacking */}
              <span style={{
                display: 'grid', width: 14, height: 14, flexShrink: 0,
              }}>
                <span style={{
                  gridArea: '1/1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  opacity: (verifiedDone && !isVerifying) ? 0 : 1,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <RefreshCw size={14} className={isVerifying ? 'spin' : ''} />
                </span>
                <span style={{
                  gridArea: '1/1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--success)',
                  opacity: (verifiedDone && !isVerifying) ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <Check size={14} />
                </span>
              </span>

              {/* Text slot — all three labels share the same grid cell, crossfade */}
              <span style={{ display: 'grid' }}>
                <span style={{
                  gridArea: '1/1', whiteSpace: 'nowrap',
                  opacity: (!isVerifying && !verifiedDone) ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}>
                  Verify Chain
                </span>
                <span style={{
                  gridArea: '1/1', whiteSpace: 'nowrap',
                  opacity: isVerifying ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}>
                  Verifying…
                </span>
                <span style={{
                  gridArea: '1/1', whiteSpace: 'nowrap',
                  color: 'var(--success)',
                  opacity: (verifiedDone && !isVerifying) ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                }}>
                  Verified
                </span>
              </span>
            </button>

            <button
              onClick={handleDemoTamper}
              disabled={isTampering}
              className="btn btn-tamper"
            >
              <Flame size={14} />
              Demo Tamper
            </button>

            {/* Restore Chain — always rendered, slides in/out via wrapper width */}
            <span style={{
              display: 'inline-flex',
              maxWidth: isFailed ? '200px' : '0px',
              opacity: isFailed ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <button
                onClick={handleRestoreChain}
                disabled={isRestoring}
                className="btn btn-approve"
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                <RotateCcw size={14} />
                Restore Chain
              </button>
            </span>
          </div>
        </div>

        {/* Notification banner */}
        {notification && (
          <div style={{
            marginTop: '14px',
            padding: '10px 14px',
            borderRadius: '6px',
            background: notification.type === 'danger' ? 'var(--danger-bg)' : 'var(--success-bg)',
            border: `1px solid ${notification.type === 'danger' ? 'rgba(178,58,46,0.35)' : 'rgba(62,107,79,0.35)'}`,
            color: notification.type === 'danger' ? 'var(--danger)' : 'var(--success)',
            fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Selector + result row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>

        {/* Run selector */}
        <div style={card}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '6px' }}>
            Audited Run ID
          </label>
          <div style={{ marginBottom: '14px' }}>
            <CustomSelect
              value={currentRunId}
              onChange={val => { setCurrentRunId(val); onSelectRun && onSelectRun(val); }}
              options={runs.map(r => ({ value: r.id, label: `${r.id} (${r.bob_task_id})` }))}
              style={{ fontSize: '0.9rem', padding: '8px 12px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <span>Events: <strong style={{ color: 'var(--ink)' }}>{verificationData?.event_count || events.length}</strong></span>
            <span>Algorithm: <strong className="mono" style={{ color: 'var(--accent)' }}>SHA-256</strong></span>
          </div>
        </div>

        {/* Verification result */}
        <div style={{
          ...card,
          background: isFailed ? 'rgba(178,58,46,0.04)' : isVerified ? 'rgba(62,107,79,0.04)' : 'rgba(232,163,61,0.04)',
          borderColor: isFailed ? 'rgba(178,58,46,0.35)' : isVerified ? 'rgba(62,107,79,0.3)' : 'rgba(232,163,61,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              background: isFailed ? 'var(--danger-bg)' : isVerified ? 'var(--success-bg)' : 'var(--accent-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isFailed ? (
                <XCircle size={22} color="var(--danger)" />
              ) : isVerified ? (
                <CheckCircle2 size={22} color="var(--success)" />
              ) : (
                <Clock size={22} color="var(--accent)" />
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: isFailed ? 'var(--danger)' : isVerified ? 'var(--success)' : 'var(--accent)', marginBottom: '2px' }}>
                Verification Verdict
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>
                {isFailed
                  ? 'Verification Failed — Tamper Detected'
                  : isVerified
                  ? 'Chain Verified — All Events Valid'
                  : 'Pending Audit — Awaiting Manual Verification'}
              </div>
            </div>
          </div>

          {/* Integrity bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--muted)' }}>
              <span>Hash Chain Integrity</span>
              <span style={{ fontWeight: 700, color: isFailed ? 'var(--danger)' : isVerified ? 'var(--success)' : 'var(--accent)' }}>
                {isFailed ? 'Compromised' : isVerified ? '100% Secure' : 'Pending Audit'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${barWidth}%`,
                height: '100%',
                background: isFailed ? 'var(--danger)' : isVerified ? 'var(--success)' : 'var(--accent)',
                transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'width',
              }} />
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: isFailed ? 'var(--danger)' : isVerified ? 'var(--muted)' : 'var(--accent)' }}>
            {isFailed
              ? `Event #${failedEventId} modified in database without matching cryptographic hash.`
              : isVerified
              ? '✓ No modification detected · ✓ Event integrity valid'
              : 'Audit session loaded. Click "Verify Chain" above to cryptographically audit this run.'}
          </div>
        </div>
      </div>

      {/* Discrepancy breakdown */}
      {isFailed && verificationData && (
        <div style={{ ...card, borderColor: 'rgba(178,58,46,0.35)', background: 'rgba(178,58,46,0.03)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} />
            Cryptographic Discrepancy — Event #{failedEventId}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(62,107,79,0.3)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '4px' }}>Expected (Recomputed)</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--success)', wordBreak: 'break-all' }}>{verificationData.expected_hash}</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(178,58,46,0.35)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '4px' }}>Stored in Database</div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--danger)', wordBreak: 'break-all' }}>{verificationData.actual_hash}</div>
            </div>
          </div>
        </div>
      )}

      {/* Event chain blocks */}
      <div style={card}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
          Cryptographic Event Blocks
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '20px' }}>
          Visual block succession from genesis root hash to the current chain tip.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {events.map((ev, idx) => {
            const isCorrupted = isFailed && ev.id === failedEventId;

            return (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: isCorrupted ? 'rgba(178,58,46,0.05)' : 'var(--bg)',
                  border: `1px solid ${isCorrupted ? 'rgba(178,58,46,0.35)' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '6px', flexShrink: 0,
                    background: isCorrupted
                      ? 'var(--danger-bg)'
                      : isVerified
                      ? 'var(--success-bg)'
                      : 'rgba(16,16,16,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: isCorrupted
                      ? 'var(--danger)'
                      : isVerified
                      ? 'var(--success)'
                      : 'var(--muted)',
                  }}>
                    {isCorrupted ? '✕' : isVerified ? '✓' : idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                        Event {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        {ev.action} <span style={{ color: 'var(--accent)' }}>{ev.target}</span>
                      </span>
                    </div>
                    <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'flex', gap: '16px' }}>
                      <span>Prev: {ev.previous_hash.slice(0, 16)}…</span>
                      <span>Hash: {ev.event_hash.slice(0, 16)}…</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCorrupted ? (
                    <span className="badge badge-tampered">Mutation Detected</span>
                  ) : isVerified ? (
                    <span className="badge badge-verified">Cryptographically Valid</span>
                  ) : (
                    <span className="badge badge-medium">Chained Event</span>
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
