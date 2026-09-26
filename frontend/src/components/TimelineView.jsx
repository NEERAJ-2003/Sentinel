import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Terminal, 
  FileCode2, 
  FilePlus2, 
  FileX2, 
  GitCommit, 
  CheckCircle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function TimelineView({ runs, selectedRunId, onSelectRun, onNavigate }) {
  const [currentRunId, setCurrentRunId] = useState(selectedRunId || (runs[0]?.id || 'run-001'));
  const [runDetail, setRunDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    if (selectedRunId) {
      setCurrentRunId(selectedRunId);
    }
  }, [selectedRunId]);

  useEffect(() => {
    if (!currentRunId) return;
    loadRunDetail(currentRunId);
  }, [currentRunId]);

  async function loadRunDetail(id) {
    setLoading(true);
    try {
      const data = await api.getRunDetail(id);
      setRunDetail(data);
    } catch (err) {
      console.error("Failed to load run detail:", err);
    } finally {
      setLoading(false);
    }
  }

  function getEventIcon(eventType, riskLevel) {
    if (riskLevel === 'HIGH') return <ShieldAlert size={16} color="#EF4444" />;
    switch (eventType) {
      case 'file_create': return <FilePlus2 size={16} color="#06B6D4" />;
      case 'file_edit': return <FileCode2 size={16} color="#38BDF8" />;
      case 'file_delete': return <FileX2 size={16} color="#EF4444" />;
      case 'command_run': return <Terminal size={16} color="#A78BFA" />;
      case 'commit': return <GitCommit size={16} color="#34D399" />;
      default: return <Clock size={16} color="#94A3B8" />;
    }
  }

  const events = runDetail?.events || [];
  const runInfo = runDetail?.run;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Controls & Run Selector */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Select Agent Run
            </label>
            <select
              value={currentRunId}
              onChange={(e) => {
                setCurrentRunId(e.target.value);
                onSelectRun && onSelectRun(e.target.value);
              }}
              style={{
                background: '#0B0F19',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {runs.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.bob_task_id}) — {r.event_count} events
                </option>
              ))}
            </select>
          </div>

          {runInfo && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
              <span className={`badge ${runInfo.status === 'active' ? 'badge-medium' : 'badge-low'}`}>
                {runInfo.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Started: {new Date(runInfo.started_at).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('verify')}
          className="btn btn-secondary"
          style={{ padding: '9px 16px', fontSize: '0.85rem' }}
        >
          <Lock size={15} color="#06B6D4" />
          <span>Audit Cryptographic Chain</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
            Run Timeline — {currentRunId}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Chronological audit of every tool call, file mutation, and shell command recorded with SHA-256 integrity.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            Loading timeline events...
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            No events recorded for this run yet.
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical spine line */}
            <div style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '9px',
              width: '2px',
              background: 'linear-gradient(to bottom, #06B6D4, rgba(99,102,241,0.3))'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {events.map((ev, idx) => {
                const isExpanded = expandedEventId === ev.id;
                const timeString = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <div key={ev.id} style={{ position: 'relative' }}>
                    {/* Timeline Node Bullet */}
                    <div style={{
                      position: 'absolute',
                      left: '-28px',
                      top: '16px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: ev.risk_level === 'HIGH' ? '#EF4444' : '#0B0F19',
                      border: ev.risk_level === 'HIGH' ? '2px solid #FCA5A5' : '2px solid #06B6D4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: ev.risk_level === 'HIGH' ? '0 0 10px rgba(239,68,68,0.6)' : '0 0 8px rgba(6,182,212,0.4)',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#FFFFFF'
                      }} />
                    </div>

                    {/* Event Card */}
                    <div 
                      style={{
                        background: ev.risk_level === 'HIGH' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                        border: ev.risk_level === 'HIGH' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className="font-mono" style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>
                            {timeString}
                          </span>

                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getEventIcon(ev.event_type, ev.risk_level)}
                          </div>

                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#F8FAFC' }}>
                              <span style={{ color: '#06B6D4', marginRight: '6px' }}>{ev.action}</span>
                              <span className="font-mono" style={{ color: '#E2E8F0' }}>{ev.target}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                              Event #{ev.id} · Type: <span style={{ color: '#CBD5E1' }}>{ev.event_type}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {ev.risk_level === 'HIGH' && (
                            <span className="badge badge-high">High Risk</span>
                          )}
                          {ev.risk_level === 'MEDIUM' && (
                            <span className="badge badge-medium">Medium</span>
                          )}
                          {ev.risk_level === 'LOW' && (
                            <span className="badge badge-low">Low</span>
                          )}

                          {ev.approval && (
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: ev.approval.decision === 'APPROVED' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                              color: ev.approval.decision === 'APPROVED' ? '#34D399' : '#F87171',
                              border: ev.approval.decision === 'APPROVED' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
                            }}>
                              ✓ {ev.approval.decision}
                            </span>
                          )}

                          <button
                            onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>

                      </div>

                      {/* Expandable Cryptographic Details */}
                      {isExpanded && (
                        <div style={{
                          marginTop: '14px',
                          paddingTop: '14px',
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                            <div style={{ background: '#090D16', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Previous Hash (H_{idx})</div>
                              <div className="font-mono" style={{ fontSize: '0.72rem', color: '#94A3B8', wordBreak: 'break-all' }}>
                                {ev.previous_hash}
                              </div>
                            </div>

                            <div style={{ background: '#090D16', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.2)' }}>
                              <div style={{ fontSize: '0.7rem', color: '#06B6D4', fontWeight: '600', textTransform: 'uppercase' }}>Event Hash (H_{idx+1})</div>
                              <div className="font-mono" style={{ fontSize: '0.72rem', color: '#22D3EE', wordBreak: 'break-all' }}>
                                {ev.event_hash}
                              </div>
                            </div>
                          </div>

                          {ev.metadata_json && (
                            <div style={{ background: '#090D16', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Metadata Payload</div>
                              <pre className="font-mono" style={{ fontSize: '0.72rem', color: '#CBD5E1', overflowX: 'auto' }}>
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
