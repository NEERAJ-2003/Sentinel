import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Database, 
  Terminal, 
  UserCheck, 
  FileCode2, 
  Layers, 
  Sparkles,
  Play,
  Activity,
  Flame,
  Clock
} from 'lucide-react';

export default function OverviewView({ onNavigate, onRunSimulation, isSimulating }) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'problem' | 'schema' | 'demo'
  const tabsNavRef = useRef(null);
  const tabButtonRefs = useRef({});
  const [tabIndicator, setTabIndicator] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });
  const [isInitialTabLoad, setIsInitialTabLoad] = useState(true);

  const TABS = [
    { id: 'pipeline', label: '1. The 6-Stage Pipeline', icon: Layers },
    { id: 'problem',  label: '2. Problem & Solution',     icon: AlertTriangle },
    { id: 'schema',   label: '3. Database Model (4 Tables)', icon: Database },
    { id: 'demo',     label: '4. Live Demo Guide', icon: Sparkles }
  ];

  // Update sliding indicator whenever activeTab changes or window resizes
  useEffect(() => {
    function updateIndicator() {
      const activeBtn = tabButtonRefs.current[activeTab];
      const nav = tabsNavRef.current;
      if (!activeBtn || !nav) return;

      const navRect = nav.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      setTabIndicator({
        left: btnRect.left - navRect.left,
        top: btnRect.top - navRect.top,
        width: btnRect.width,
        height: btnRect.height,
        ready: true,
      });
    }

    updateIndicator();
    const timer = setTimeout(() => {
      updateIndicator();
      setIsInitialTabLoad(false);
    }, 60);

    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab]);

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* ── Hero Pitch Banner ─────────────────────────────────── */}
      <div className="comet-card-wrap comet-yellow" style={{ borderRadius: '16px' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(16, 16, 16, 0.04)',
          position: 'relative',
          zIndex: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '680px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-verified" style={{ padding: '3px 8px', fontSize: '0.68rem' }}>
                  Active Governance Engine
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '12px' }}>
                Sentinel — Cryptographic Trust & Governance for IBM Bob
              </h1>

              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                Autonomous coding agents have the power to create features, but also to execute destructive commands (<code style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>rm -rf</code>, <code style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>drop table</code>, sensitive file deletions). 
                <strong> Sentinel</strong> inserts an active control loop that evaluates risk, halts dangerous operations for human approval, and cryptographically seals every action with a <strong>SHA-256 hash chain</strong>.
              </p>

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.88rem', background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }}
                >
                  <Activity size={16} />
                  <span>Open Dashboard</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={onRunSimulation}
                  disabled={isSimulating}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <Play size={15} color="var(--accent)" />
                  <span>{isSimulating ? 'Injecting Telemetry…' : 'Simulate Bob Run'}</span>
                </button>

                <button
                  onClick={() => onNavigate('verify')}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <Lock size={15} color="var(--success)" />
                  <span>Tamper Verification Lab</span>
                </button>
              </div>

            </div>

            {/* Quick Paradigm Summary Badge */}
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              minWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                Core Value Shift
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                  Passive Observability:
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  Bob → Log → DB → View
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                  Active Governance:
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'monospace' }}>
                  Bob → Observe → Analyze → Control → Record → Verify
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--muted)' }}>
                Stack: Python FastAPI + PostgreSQL + React 18
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Official 30-Second Hackathon Pitch Quote ─────────── */}
      <div style={{
        background: 'var(--accent-bg)',
        border: '1px solid rgba(232, 163, 61, 0.35)',
        borderRadius: '12px',
        padding: '20px 26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} color="var(--accent)" />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.05em' }}>
            Why Sentinel is needed ?
          </span>
        </div>
        <blockquote style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic' }}>
          "Sentinel is an active trust and cryptographic governance layer for autonomous coding agents. It observes Bob's actions in real-time, evaluates risky operations before they run, keeps humans in control of sensitive actions, creates a tamper-evident SHA-256 audit history, and provides mathematical verification that the agent's log has never been altered."
        </blockquote>
      </div>

      {/* ── Interactive Architecture Tabs ─────────────────────── */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(16, 16, 16, 0.04)'
      }}>
        
        {/* Navigation Tabs Header — 4 evenly fitted sections with smooth sliding black box */}
        <div 
          ref={tabsNavRef}
          style={{
            position: 'relative',
            padding: '14px 18px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Layer 1: Static white card background for all 4 slots */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '10px',
            position: 'absolute',
            top: '14px',
            left: '18px',
            right: '18px',
            bottom: '14px',
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            {TABS.map(t => (
              <div 
                key={t.id} 
                style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px',
                  height: '100%',
                }} 
              />
            ))}
          </div>

          {/* Layer 2: The smooth sliding black box indicator */}
          {tabIndicator.ready && (
            <span
              style={{
                position: 'absolute',
                top: tabIndicator.top,
                left: tabIndicator.left,
                width: tabIndicator.width,
                height: tabIndicator.height,
                background: 'var(--ink)',
                borderRadius: '8px',
                transition: isInitialTabLoad ? 'none' : 'left 0.42s cubic-bezier(0.25, 1, 0.35, 1), top 0.42s cubic-bezier(0.25, 1, 0.35, 1), width 0.42s cubic-bezier(0.25, 1, 0.35, 1), height 0.42s cubic-bezier(0.25, 1, 0.35, 1)',
                boxShadow: '0 4px 14px rgba(16, 16, 16, 0.16)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}

          {/* Layer 3: Interactive tab buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '10px',
            position: 'relative',
            zIndex: 2,
          }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  ref={el => { tabButtonRefs.current[id] = el; }}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid transparent',
                    background: 'transparent',
                    color: active ? 'var(--bg)' : 'var(--muted)',
                    fontSize: '0.84rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.32s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = 'var(--ink)';
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  <Icon size={15} color={active ? 'var(--accent)' : 'currentColor'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body — locked to consistent size across all 4 sections */}
        <div style={{ padding: '28px', minHeight: '340px' }}>
          
          <div key={activeTab} className="tab-content-enter">
            {/* TAB 1: 6-Stage Pipeline */}
            {activeTab === 'pipeline' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px', minHeight: '284px' }}>
              
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>1</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Observe (Capture)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Intercepts telemetry from IBM Bob IDE including file mutations, shell commands, test executions, and git operations before they impact disk or remote repositories.
                </p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>2</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Analyze (Policy Engine)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Evaluates actions against deterministic transparent rules. Safe actions (<code style={{ color: 'var(--success)' }}>LOW</code>) proceed; destructive operations (<code style={{ color: 'var(--danger)' }}>HIGH</code> like <code style={{ fontSize: '0.75rem' }}>rm -rf</code>) are flagged.
                </p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>3</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Control (Human Gate)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Pauses Bob's autonomous execution. Sensitive actions wait in the <strong>Approval Queue</strong> until an authorized human reviews and explicitly clicks <strong>[ APPROVE ]</strong> or <strong>[ DENY ]</strong>.
                </p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>4</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Record (SHA-256 Chain)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Every approved or executed event is cryptographically sealed into PostgreSQL with SHA-256 hash chaining: <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--ink)' }}>H(n) = SHA256(H(n-1) + Payload)</span>.
                </p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>5</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Verify (Tamper Lab)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Recomputes the entire audit trail on demand. Any database modification or unauthorized edit immediately breaks the mathematical chain and flags the exact modified record.
                </p>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>6</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>Visualize (4 Screens)</strong>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Live executive dashboard KPIs, run timelines, approval queue management, and the interactive verification lab.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: Problem & Solution */}
          {activeTab === 'problem' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', minHeight: '284px' }}>
              <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(178,58,46,0.25)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <AlertTriangle size={20} color="var(--danger)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--danger)' }}>The Critical Problem</h3>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px', lineHeight: 1.5 }}>
                    <li><strong>Unmonitored Agent Power:</strong> Autonomous agents like IBM Bob have root shell access and can execute destructive commands (<code style={{ fontSize: '0.75rem' }}>rm -rf</code>, <code style={{ fontSize: '0.75rem' }}>git reset --hard</code>) without human sign-off.</li>
                    <li><strong>The Observability Trap:</strong> Passive logs (<code style={{ fontSize: '0.75rem' }}>Bob → DB → Dashboard</code>) only tell you what happened <em>after</em> damage is already done.</li>
                    <li><strong>Mutable Logs:</strong> Traditional database logs can be secretly edited or deleted with zero cryptographic evidence left behind.</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(62,107,79,0.25)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <CheckCircle2 size={20} color="var(--success)" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)' }}>Sentinel's Solution</h3>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '18px', lineHeight: 1.5 }}>
                    <li><strong>Pre-Execution Policy Gate:</strong> High-risk operations are paused in stasis until an authorized human operator explicitly clicks <strong style={{ color: 'var(--success)' }}>APPROVE</strong>.</li>
                    <li><strong>Cryptographic Immutability:</strong> Every event is mathematically chained with SHA-256 rooted at a 64-character Genesis hash.</li>
                    <li><strong>Instant Tamper Detection:</strong> Recomputing hashes flags any database alteration with an exact Expected vs Received hash mismatch.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Database Model */}
          {activeTab === 'schema' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', minHeight: '284px' }}>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>runs</span>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>Lifecycle</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.4 }}>Tracks agent task lifecycle & overall cryptographic verification status.</p>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--ink)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li><code>id</code> <span style={{ color: 'var(--muted)' }}>(String, PK)</span></li>
                    <li><code>bob_task_id</code> <span style={{ color: 'var(--muted)' }}>(Unique)</span></li>
                    <li><code>started_at</code> & <code>ended_at</code></li>
                    <li><code>status</code> <span style={{ color: 'var(--muted)' }}>(active/completed)</span></li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>events</span>
                    <span className="badge badge-verified" style={{ fontSize: '0.62rem' }}>Chained</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.4 }}>Sequentially linked hash chain records sealed with SHA-256 signatures.</p>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--ink)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li><code>id</code> <span style={{ color: 'var(--muted)' }}>(Integer, PK)</span></li>
                    <li><code>run_id</code> <span style={{ color: 'var(--muted)' }}>(FK → runs)</span></li>
                    <li><code>event_type</code> & <code>action</code></li>
                    <li><code>previous_hash</code> & <code>event_hash</code></li>
                    <li><code>risk_level</code> <span style={{ color: 'var(--muted)' }}>(LOW/MED/HIGH)</span></li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>approvals</span>
                    <span className="badge badge-medium" style={{ fontSize: '0.62rem' }}>Human Gate</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.4 }}>Human supervisor interventions and decisions for high-risk operations.</p>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--ink)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li><code>id</code> <span style={{ color: 'var(--muted)' }}>(Integer, PK)</span></li>
                    <li><code>event_id</code> <span style={{ color: 'var(--muted)' }}>(FK → events)</span></li>
                    <li><code>decision</code> <span style={{ color: 'var(--muted)' }}>(APPROVED/DENIED)</span></li>
                    <li><code>approved_by</code> & <code>reason</code></li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>verification_results</span>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>Audits</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.4 }}>On-demand cryptographic audit logs detecting chain tampering.</p>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--ink)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li><code>id</code> <span style={{ color: 'var(--muted)' }}>(Integer, PK)</span></li>
                    <li><code>run_id</code> <span style={{ color: 'var(--muted)' }}>(FK → runs)</span></li>
                    <li><code>verified</code> <span style={{ color: 'var(--muted)' }}>(Boolean)</span></li>
                    <li><code>failed_event_id</code> <span style={{ color: 'var(--muted)' }}>(Nullable)</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Live Demo Guide */}
          {activeTab === 'demo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '284px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Follow This 3-Step Live Presentation Script:
                </div>
                <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                  2-Minute Pitch Script
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', flex: 1 }}>
                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>1</span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Show Normal Green State</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                      Navigate to <strong>Dashboard</strong>. Show how safe actions automatically execute and the status badge displays <code style={{ color: 'var(--success)' }}>Latest Run: Verified</code>.
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>
                    Target: Dashboard View
                  </div>
                </div>

                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>2</span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Demonstrate Human Gate</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                      Navigate to <strong>Approval Queue</strong>. Show Bob blocked on deleting <code style={{ fontSize: '0.75rem' }}>config.json</code>. Click <strong>[ APPROVE ]</strong> to demonstrate human authority.
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                    Target: Approval Queue
                  </div>
                </div>

                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>3</span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Execute Tamper Test</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                      Navigate to <strong>Verify Chain</strong>. Click <strong>"Demo Tampering"</strong>. Show how Sentinel flags <code style={{ color: 'var(--danger)' }}>TAMPER DETECTED</code>, then click <strong>"Restore Chain"</strong>.
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)' }}>
                    Target: Tamper Lab
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>

    </div>
  );
}
