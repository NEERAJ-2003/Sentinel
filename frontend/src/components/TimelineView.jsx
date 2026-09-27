import React, { useState, useEffect } from 'react';
import {
  Clock, Terminal, FileCode2, FilePlus2, FileX2, GitCommit,
  ShieldAlert, ChevronDown, ChevronUp, Lock, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import CustomSelect from './CustomSelect';

const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
};

function getEventIcon(eventType, riskLevel) {
  if (riskLevel === 'HIGH') return <ShieldAlert size={15} color="var(--accent)" />;
  switch (eventType) {
    case 'file_create':  return <FilePlus2  size={15} color="var(--success)" />;
    case 'file_edit':    return <FileCode2  size={15} color="var(--muted)" />;
    case 'file_delete':  return <FileX2     size={15} color="var(--danger)" />;
    case 'command_run':  return <Terminal   size={15} color="var(--muted)" />;
    case 'commit':       return <GitCommit  size={15} color="var(--success)" />;
    default:             return <Clock      size={15} color="var(--muted)" />;
  }
}

export default function TimelineView({ runs, selectedRunId, onSelectRun, onNavigate }) {
  const [currentRunId, setCurrentRunId] = useState(selectedRunId || (runs[0]?.id || ''));
  const [runDetail, setRunDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => { if (selectedRunId) setCurrentRunId(selectedRunId); }, [selectedRunId]);
  useEffect(() => { if (currentRunId) loadRunDetail(currentRunId); }, [currentRunId]);

  async function loadRunDetail(id) {
    setLoading(true);
    try {
      const data = await api.getRunDetail(id);
      setRunDetail(data);
    } catch (err) {
      console.error('Failed to load run detail:', err);
    } finally {
      setLoading(false);
    }
  }

  const events  = runDetail?.events || [];
  const runInfo = runDetail?.run;

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Controls bar */}
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', padding: '16px 24px', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '100%', minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ maxWidth: '100%', minWidth: 0 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '4px' }}>
                Agent Run
              </label>
              <CustomSelect
                value={currentRunId}
                onChange={val => { setCurrentRunId(val); onSelectRun && onSelectRun(val); }}
                options={runs.map(r => ({ value: r.id, label: `${r.id} (${r.bob_task_id}) — ${r.event_count} events` }))}
              />
          </div>

          {runInfo && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', alignSelf: 'flex-end', marginBottom: '2px', flexWrap: 'wrap' }}>
              <span className={`badge ${runInfo.status === 'active' ? 'badge-high' : 'badge-verified'}`}>
                {runInfo.status}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                Started: {new Date(runInfo.started_at).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('verify')}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', flexShrink: 0 }}
        >
          <Lock size={14} />
          Audit Chain
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Timeline */}
      <div style={card}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
            Run Timeline — {currentRunId}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            Chronological audit of every tool call, file mutation, and shell command, each SHA-256 integrity-chained.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading timeline…</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
            No events recorded for this run yet.
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '28px' }}>

            {/* Vertical spine */}
            <div style={{
              position: 'absolute', top: '12px', bottom: '12px', left: '9px',
              width: '2px', background: 'var(--border)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {events.map((ev, idx) => {
                const isExpanded = expandedEventId === ev.id;
                const timeStr = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const isHigh  = ev.risk_level === 'HIGH';

                return (
                  <div
                    key={ev.id}
                    style={{
                      position: 'relative',
                      animation: `fade-in 0.18s ease-out ${Math.min(idx * 0.04, 0.3)}s both`,
                    }}
                  >
                    {/* Node bullet */}
                    <div style={{
                      position: 'absolute',
                      left: '-28px', top: '14px',
                      width: '18px', height: '18px',
                      borderRadius: '50%',
                      background: isHigh ? 'var(--accent-bg)' : 'var(--surface)',
                      border: `2px solid ${isHigh ? 'var(--accent)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 2,
                    }}>
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: isHigh ? 'var(--accent)' : 'var(--muted)',
                      }} />
                    </div>

                    {/* Event card */}
                    <div style={{
                      background: isHigh ? 'rgba(232,163,61,0.04)' : 'var(--bg)',
                      border: `1px solid ${isHigh ? 'rgba(232,163,61,0.3)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, maxWidth: '100%' }}>
                          <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.78rem', flexShrink: 0 }}>{timeStr}</span>

                          <div style={{
                            width: '26px', height: '26px', borderRadius: '6px',
                            background: 'rgba(16,16,16,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {getEventIcon(ev.event_type, ev.risk_level)}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', wordBreak: 'break-word' }}>
                              <span style={{ color: 'var(--accent)' }}>{ev.action}</span>
                              {' '}
                              <span className="mono">{ev.target}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                              #{ev.id} · {ev.event_type}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isHigh && <span className="badge badge-high">High Risk</span>}
                          {ev.risk_level === 'MEDIUM' && <span className="badge badge-medium">Medium</span>}
                          {ev.risk_level === 'LOW'    && <span className="badge badge-low">Low</span>}

                          {ev.approval && (
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 600,
                              padding: '2px 8px', borderRadius: '4px',
                              background: ev.approval.decision === 'APPROVED' ? 'var(--success-bg)' : 'var(--danger-bg)',
                              color: ev.approval.decision === 'APPROVED' ? 'var(--success)' : 'var(--danger)',
                              border: `1px solid ${ev.approval.decision === 'APPROVED' ? 'rgba(62,107,79,0.35)' : 'rgba(178,58,46,0.35)'}`,
                            }}>
                              {ev.approval.decision}
                            </span>
                          )}

                          <button
                            onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '2px' }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="expand-enter" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '10px' }}>
                            <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Previous Hash (H_{idx})</div>
                              <div className="mono" style={{ color: 'var(--muted)', wordBreak: 'break-all', fontSize: '0.72rem' }}>{ev.previous_hash}</div>
                            </div>
                            <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(232,163,61,0.25)' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '4px' }}>Event Hash (H_{idx + 1})</div>
                              <div className="mono" style={{ color: 'var(--ink)', wordBreak: 'break-all', fontSize: '0.72rem' }}>{ev.event_hash}</div>
                            </div>
                          </div>
                          {ev.metadata_json && (
                            <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Metadata Payload</div>
                              <pre className="mono" style={{ color: 'var(--ink)', overflowX: 'auto', fontSize: '0.72rem' }}>
                                {JSON.stringify(ev.metadata_json, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
