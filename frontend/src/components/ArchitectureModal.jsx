import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Database, 
  Terminal, 
  Cpu, 
  UserCheck, 
  FileCode2, 
  Layers, 
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose, onNavigateTab }) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'problem' | 'flowchart' | 'schema' | 'pitch'

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(16, 16, 16, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '20px',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '90vh',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(16, 16, 16, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,16,16,0.15)'
            }}>
              <ShieldCheck size={24} color="var(--accent)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Sentinel System Architecture & Pitch Overview
                </h2>
                <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>
                  IBM Bob Governance
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>
                Full system specification, real-time control gates, and cryptographic trust mechanics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--ink)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 28px',
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'pipeline', label: '1. The 6-Stage Pipeline', icon: Layers },
            { id: 'problem', label: '2. Problem & Solution', icon: AlertTriangle },
            { id: 'flowchart', label: '3. Full Architecture Diagram', icon: Cpu },
            { id: 'schema', label: '4. Database Relational Model', icon: Database },
            { id: 'pitch', label: '5. Hackathon Winning Pitch', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: active ? '1px solid var(--ink)' : '1px solid transparent',
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--muted)',
                  fontSize: '0.82rem',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={active ? 'var(--accent)' : 'currentColor'} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '28px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

          {/* TAB 1: 6-Stage Pipeline */}
          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)' }}>
                    Core Architectural Paradigm Shift
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>
                    Bob → Observe → Analyze → Control → Record → Verify
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Active Governance instead of passive after-the-fact logging.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--ink)' }}>1</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Observe (Capture)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Intercepts telemetry from IBM Bob IDE including file mutations, shell commands, test executions, and git operations before they impact disk or remote repositories.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--ink)' }}>2</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Analyze (Policy Engine)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Evaluates actions against deterministic transparent rules. Safe actions (<code style={{ color: 'var(--success)' }}>LOW</code>) proceed automatically; destructive operations (<code style={{ color: 'var(--danger)' }}>HIGH</code> like <code style={{ fontSize: '0.75rem' }}>rm -rf</code> or <code style={{ fontSize: '0.75rem' }}>file_delete</code>) are flagged.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--danger)' }}>3</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Control (Human Gate)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Pauses Bob's autonomous execution. Sensitive actions wait in the <strong>Approval Queue</strong> until an authorized human reviews and explicitly clicks <strong>[ APPROVE ]</strong> or <strong>[ DENY ]</strong>.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--ink)' }}>4</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Record (SHA-256 Chain)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Every approved or executed event is cryptographically sealed into PostgreSQL with SHA-256 hash chaining: <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--ink)' }}>H(n) = SHA256(H(n-1) + Payload)</span>.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--success)' }}>5</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Verify (Tamper Lab)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Recomputes the entire audit trail on demand. Any database modification, record deletion, or unauthorized edit immediately breaks the mathematical chain and flags the exact modified record.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--ink)' }}>6</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>Visualize (4 Screens)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Clean, responsive interface with Dashboard KPIs, Step-by-Step Run Timeline, Human Approval Control Queue, and the Interactive Cryptographic Verification Lab.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Problem & Solution */}
          {activeTab === 'problem' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(178,58,46,0.25)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <AlertTriangle size={20} color="var(--danger)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--danger)' }}>The Critical Problem</h3>
                </div>
                <ul style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px' }}>
                  <li>
                    <strong>Root-Level Agent Autonomy:</strong> Autonomous coding agents like IBM Bob have root-level power: modifying sensitive code, deleting directories, dropping tables, and pushing to git.
                  </li>
                  <li>
                    <strong>The Observability Trap:</strong> Most systems only log actions <em>after</em> they happen (<code style={{ fontSize: '0.78rem' }}>Bob → Logger → DB → Dashboard</code>). If an agent drops a database or deletes credentials, passive logging is too late.
                  </li>
                  <li>
                    <strong>Mutable Audit Trails:</strong> Standard database records can be altered, pruned, or covered up by insider threats or compromised processes with zero evidence left behind.
                  </li>
                </ul>
              </div>

              <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(62,107,79,0.25)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <CheckCircle2 size={20} color="var(--success)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)' }}>Sentinel's Solution</h3>
                </div>
                <ul style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px' }}>
                  <li>
                    <strong>Pre-Execution Policy Gate:</strong> High-risk operations are intercepted and held in stasis. Bob cannot continue until an authorized operator inspects the reason and explicitly signs off.
                  </li>
                  <li>
                    <strong>Cryptographic Immutability:</strong> Every event is linked via a mathematical SHA-256 hash chain rooted at a 64-character Genesis hash.
                  </li>
                  <li>
                    <strong>Instant Tamper Detection:</strong> Anyone attempting to tamper with records in PostgreSQL is caught immediately with an exact diff between <code style={{ fontSize: '0.78rem' }}>Expected Hash</code> and <code style={{ fontSize: '0.78rem' }}>Received Hash</code>.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Full Architecture Flowchart */}
          {activeTab === 'flowchart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                This is the exact end-to-end architecture pipeline connecting IBM Bob to the cryptographic database and dashboard:
              </p>
              
              <div style={{
                background: 'var(--ink)',
                color: 'var(--bg)',
                borderRadius: '12px',
                padding: '24px',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                overflowX: 'auto',
                border: '1px solid var(--border)'
              }}>
                <pre style={{ margin: 0 }}>
{`+-------------------------------------------------------------+
|                      IBM BOB IDE                            |
|                 (Autonomous Coding Agent)                   |
+------------------------------+------------------------------+
                               | Bob Skill / Telemetry Hook
                               v
+------------------------------+------------------------------+
|                    Agent Trace Client                       |
|   Captures: file changes, bash commands, commits, tool calls|
+------------------------------+------------------------------+
                               | HTTPS
                               v
+------------------------------+------------------------------+
|                 Python FastAPI API Gateway                  |
|   /api/log      /api/risk      /api/approve   /api/verify   |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                    Risk & Policy Engine                     |
|            Deterministic Rule Classification                |
+--------------+-------------------------------+--------------+
               | LOW                           | HIGH
               v                               v
               |               +---------------+--------------+
               |               | Human Approval Queue (Gate)  |
               |               |       APPROVE / DENY         |
               |               +---------------+--------------+
               |                               | (Approved)
               +---------------+---------------+
                               |
                               v
+------------------------------+------------------------------+
|                       Event Recorder                        |
|   SHA-256 Hash Chaining: H(n) = SHA256(H(n-1) + Canonical)  |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                   PostgreSQL Database                       |
|   (Docker dev: port 5433 / Neon serverless in production)   |
|   Tables: runs, events, approvals, verification_results     |
+------------------------------+------------------------------+
                               |
                               v
+------------------------------+------------------------------+
|                    React 18 Dashboard                       |
|   Screen 1: Dashboard KPIs        Screen 2: Run Timeline    |
|   Screen 3: Approval Queue        Screen 4: Verify & Tamper |
+-------------------------------------------------------------+`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Database Relational Model */}
          {activeTab === 'schema' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                Instead of an unstructured flat log, Sentinel maintains 4 clean relational PostgreSQL tables:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>runs</span>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>Lifecycle</span>
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><code>id</code> (String, PK)</li>
                    <li><code>bob_task_id</code> (String, Unique)</li>
                    <li><code>started_at</code> (DateTime)</li>
                    <li><code>ended_at</code> (DateTime, nullable)</li>
                    <li><code>status</code> (active / completed)</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>events</span>
                    <span className="badge badge-verified" style={{ fontSize: '0.62rem' }}>Chained</span>
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><code>id</code> (Integer, PK)</li>
                    <li><code>run_id</code> (FK → runs.id)</li>
                    <li><code>event_type</code> & <code>action</code></li>
                    <li><code>target</code> & <code>metadata_json</code></li>
                    <li><code>previous_hash</code> (SHA-256)</li>
                    <li><code>event_hash</code> (SHA-256)</li>
                    <li><code>risk_level</code> (LOW/MED/HIGH)</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>approvals</span>
                    <span className="badge badge-medium" style={{ fontSize: '0.62rem' }}>Human Gate</span>
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><code>id</code> (Integer, PK)</li>
                    <li><code>event_id</code> (FK → events.id)</li>
                    <li><code>decision</code> (APPROVED / DENIED)</li>
                    <li><code>approved_by</code> (String)</li>
                    <li><code>reason</code> (String)</li>
                    <li><code>timestamp</code> (DateTime)</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>verification_results</span>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>Audits</span>
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><code>id</code> (Integer, PK)</li>
                    <li><code>run_id</code> (FK → runs.id)</li>
                    <li><code>verified</code> (Boolean)</li>
                    <li><code>failed_event_id</code> (Nullable)</li>
                    <li><code>verified_at</code> (DateTime)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Hackathon Winning Pitch */}
          {activeTab === 'pitch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'var(--accent-bg)',
                border: '1px solid rgba(232, 163, 61, 0.35)',
                borderRadius: '12px',
                padding: '20px 24px'
              }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)' }}>
                  Your Official 30-Second Elevator Pitch
                </span>
                <blockquote style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)', marginTop: '8px', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "Sentinel is an active trust and cryptographic governance layer for autonomous coding agents. It observes Bob's actions in real-time, evaluates risky operations before they run, keeps humans in control of sensitive operations, creates a tamper-evident SHA-256 audit history, and provides mathematical verification that the agent's log has never been altered."
                </blockquote>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Live 3-Step Demonstration Guide for the Judges:
                </h4>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>Simulate Bob & Show Normal Green State</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Click <strong>"Simulate Bob Activity"</strong>. Show how safe actions run automatically and the top badge confirms <code style={{ color: 'var(--success)' }}>Latest Run: Verified</code>.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>Show the Approval Control Gate</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Navigate to the <strong>Approval Queue</strong>. Show Bob blocked on deleting <code style={{ fontSize: '0.75rem' }}>config.json</code>. Click <strong>[ APPROVE ]</strong> to demonstrate human-in-the-loop governance.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>The Wow Factor: Execute the Signature Tamper Demo</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Navigate to <strong>Verify Chain</strong>. Click <strong>"Demo Tampering"</strong> to secretly mutate a record in PostgreSQL. The system flashes red <code style={{ color: 'var(--danger)' }}>TAMPER DETECTED</code>, displaying the exact Expected vs Received hash mismatch. Then click <strong>"Restore Chain"</strong> to bring it back to green!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Tip: Click the <strong>SENTINEL</strong> logo in the top-left at any time to re-open this overview.
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                onClose();
                onNavigateTab && onNavigateTab('verify');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              <Lock size={14} color="var(--accent)" />
              <span>Explore Tamper Lab</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 18px', background: 'var(--ink)', color: 'var(--bg)' }}
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
