import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Sparkles,
  Lock,
  Terminal,
  FileCode2,
  UserCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function ArchitectureShowcase({ isExpanded, onToggle, showcaseRef }) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'problem' | 'flowchart' | 'schema' | 'pitch'

  return (
    <div 
      ref={showcaseRef}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(16, 16, 16, 0.04)',
        transition: 'all 0.25s ease',
        marginBottom: '20px'
      }}
    >
      {/* Header Banner — Always Visible */}
      <div 
        onClick={onToggle}
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(232,163,61,0.06), rgba(16,16,16,0.02))',
          borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={20} color="var(--accent)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)' }}>
                System Architecture & Hackathon Pitch Guide
              </span>
              <span className="badge badge-verified" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                IBM Bob Trust Layer
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                (Click to {isExpanded ? 'collapse' : 'expand overview'})
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>
              How Sentinel observes, analyzes, controls, records (SHA-256), and verifies autonomous AI coding sessions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--ink)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            {isExpanded ? 'Hide Architecture' : 'View Architecture'}
          </span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div style={{ padding: '20px 24px', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* Sub Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '6px',
            paddingBottom: '16px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'pipeline', label: '1. The 6-Stage Pipeline', icon: Layers },
              { id: 'problem', label: '2. Problem & Solution', icon: AlertTriangle },
              { id: 'flowchart', label: '3. Architecture Diagram', icon: Cpu },
              { id: 'schema', label: '4. Database Model (4 Tables)', icon: Database },
              { id: 'pitch', label: '5. Hackathon Pitch Script', icon: Sparkles }
            ].map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: active ? '1px solid var(--ink)' : '1px solid var(--border)',
                    background: active ? 'var(--ink)' : 'var(--bg)',
                    color: active ? 'var(--bg)' : 'var(--muted)',
                    fontSize: '0.78rem',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={13} color={active ? 'var(--accent)' : 'currentColor'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: 6-Stage Pipeline */}
          {activeTab === 'pipeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)' }}>
                    Core Pipeline Workflow
                  </span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)' }}>
                    Bob → Observe → Analyze → Control → Record → Verify
                  </div>
                </div>
                <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                  Zero-Trust Governance
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--ink)' }}>1</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Observe (Capture)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Intercepts telemetry from IBM Bob IDE including file edits, shell commands, test executions, and git commits.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--ink)' }}>2</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Analyze (Policy Engine)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Evaluates actions with transparent rules. Routine tasks (<span style={{ color: 'var(--success)' }}>LOW</span>) proceed; destructive tasks (<span style={{ color: 'var(--danger)' }}>HIGH</span> like <code style={{ fontSize: '0.7rem' }}>rm -rf</code>, <code style={{ fontSize: '0.7rem' }}>file_delete</code>) are flagged.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--danger)' }}>3</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Control (Human Gate)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Pauses Bob's autonomous execution. Sensitive actions wait in the <strong>Approval Queue</strong> until an authorized human clicks <strong>[ APPROVE ]</strong> or <strong>[ DENY ]</strong>.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--ink)' }}>4</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Record (SHA-256 Chain)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Every event is cryptographically sealed into PostgreSQL with sequential hash chaining: <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>H(n) = SHA256(H(n-1) + Payload)</span>.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--success)' }}>5</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Verify (Tamper Lab)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Recomputes the entire audit trail on demand. Any database modification or unauthorized mutation breaks the chain and flags the exact record.
                  </p>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--ink)' }}>6</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Visualize (4 Screens)</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Live executive dashboard KPIs, run timelines, approval queue management, and the interactive verification lab.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Problem & Solution */}
          {activeTab === 'problem' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(178,58,46,0.25)', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <AlertTriangle size={18} color="var(--danger)" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)' }}>The Critical Problem</h4>
                </div>
                <ul style={{ fontSize: '0.82rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
                  <li><strong>Autonomous Execution:</strong> Coding agents have root shell access and can delete files, drop tables, or leak credentials without human confirmation.</li>
                  <li><strong>The Observability Trap:</strong> Passive logs (<code style={{ fontSize: '0.75rem' }}>Bob → DB → Dashboard</code>) only tell you what happened <em>after</em> damage is done.</li>
                  <li><strong>Mutable Logs:</strong> Traditional database logs can be edited or deleted by attackers or rogue scripts with zero detection.</li>
                </ul>
              </div>

              <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(62,107,79,0.25)', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--success)' }}>Sentinel's Solution</h4>
                </div>
                <ul style={{ fontSize: '0.82rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
                  <li><strong>Pre-Execution Policy Gate:</strong> High-risk operations are held in stasis until a verified human operator explicitly approves.</li>
                  <li><strong>Cryptographic Immutability:</strong> Every event is mathematically chained with SHA-256 rooted at a 64-character Genesis hash.</li>
                  <li><strong>Instant Tamper Detection:</strong> Recomputing hashes flags any database alteration with an exact Expected vs Received hash mismatch.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Architecture Diagram */}
          {activeTab === 'flowchart' && (
            <div style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              borderRadius: '8px',
              padding: '16px 20px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              lineHeight: 1.4,
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
          )}

          {/* TAB 4: Database Model */}
          {activeTab === 'schema' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>runs</span>
                  <span className="badge badge-low" style={{ fontSize: '0.58rem' }}>Lifecycle</span>
                </div>
                <ul style={{ fontSize: '0.74rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li><code>id</code> (String, PK)</li>
                  <li><code>bob_task_id</code> (String, Unique)</li>
                  <li><code>started_at</code> & <code>ended_at</code></li>
                  <li><code>status</code> (active / completed)</li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>events</span>
                  <span className="badge badge-verified" style={{ fontSize: '0.58rem' }}>Chained</span>
                </div>
                <ul style={{ fontSize: '0.74rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li><code>id</code> (Integer, PK)</li>
                  <li><code>run_id</code> (FK → runs.id)</li>
                  <li><code>event_type</code> & <code>action</code></li>
                  <li><code>previous_hash</code> & <code>event_hash</code></li>
                  <li><code>risk_level</code> (LOW/MED/HIGH)</li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>approvals</span>
                  <span className="badge badge-medium" style={{ fontSize: '0.58rem' }}>Human Gate</span>
                </div>
                <ul style={{ fontSize: '0.74rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li><code>id</code> (Integer, PK)</li>
                  <li><code>event_id</code> (FK → events.id)</li>
                  <li><code>decision</code> (APPROVED / DENIED)</li>
                  <li><code>approved_by</code> & <code>reason</code></li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>verification_results</span>
                  <span className="badge badge-low" style={{ fontSize: '0.58rem' }}>Audits</span>
                </div>
                <ul style={{ fontSize: '0.74rem', color: 'var(--muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li><code>id</code> (Integer, PK)</li>
                  <li><code>run_id</code> (FK → runs.id)</li>
                  <li><code>verified</code> (Boolean)</li>
                  <li><code>failed_event_id</code> (Nullable)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: Pitch Guide */}
          {activeTab === 'pitch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'var(--accent-bg)',
                border: '1px solid rgba(232, 163, 61, 0.35)',
                borderRadius: '8px',
                padding: '14px 18px'
              }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)' }}>
                  Official 30-Second Elevator Pitch
                </span>
                <blockquote style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', marginTop: '4px', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "Sentinel is an active trust and cryptographic governance layer for autonomous coding agents. It observes Bob's actions in real-time, evaluates risky operations before they run, keeps humans in control of sensitive operations, creates a tamper-evident SHA-256 audit history, and provides mathematical verification that the agent's log has never been altered."
                </blockquote>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '3px' }}>1. Show Normal Verified State</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Click <strong>"Simulate Bob Activity"</strong>. Safe actions run automatically; top banner confirms <code style={{ color: 'var(--success)' }}>Latest Run: Verified</code>.</div>
                </div>

                <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '3px' }}>2. Show the Approval Gate</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Go to <strong>Approval Queue</strong>. Show Bob blocked on deleting <code style={{ fontSize: '0.7rem' }}>config.json</code>. Click <strong>[ APPROVE ]</strong>.</div>
                </div>

                <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '3px' }}>3. Execute Signature Tamper Test</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Go to <strong>Verify Chain</strong>. Click <strong>"Demo Tampering"</strong> to secretly mutate a record in PostgreSQL. The system turns red <code style={{ color: 'var(--danger)' }}>TAMPER DETECTED</code>, then click <strong>"Restore Chain"</strong> to bring it back to green!</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
