import React from 'react';
import { Play, ShieldAlert, CheckCircle2, XCircle, Clock, Terminal, FileCode2, Flame, ArrowRight, Database } from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────── */
const S = {
  /* page section */
  section: { display: 'flex', flexDirection: 'column', gap: '28px' },
  /* row between */
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  /* card */
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '22px',
  },
  /* label above stat */
  statLabel: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '10px' },
  /* big number */
  statNum: { fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' },
  /* sub text */
  sub: { fontSize: '0.75rem', color: 'var(--muted)' },
  /* icon box */
  iconBox: (bg) => ({
    width: '34px', height: '34px', borderRadius: '8px',
    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }),
};

function StatCard({ label, value, subtext, icon, accent, onClick, clickable }) {
  return (
    <div
      style={{ ...S.card, cursor: clickable ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={S.statLabel}>{label}</span>
        <div style={S.iconBox(`rgba(${accent},0.12)`)}>
          {icon}
        </div>
      </div>
      <div style={{ ...S.statNum, color: clickable && value > 0 ? 'var(--accent)' : 'var(--ink)' }}>{value}</div>
      <div style={S.sub}>{subtext}</div>
    </div>
  );
}

export default function DashboardView({ stats, runs, onSelectRun, onNavigate, onRunSimulation, isSimulating }) {
  const activeRuns      = stats?.active_runs      || 0;
  const totalEvents     = stats?.total_events     || 0;
  const riskyActions    = stats?.risky_actions    || 0;
  const pendingApprovals = stats?.pending_approvals || 0;
  const chainStatus     = stats?.chain_status     || 'VERIFIED';
  const recentEvents    = stats?.recent_events    || [];

  const verified = chainStatus === 'VERIFIED';

  return (
    <div className="view-enter" style={S.section}>

      {/* ── Page header ────────────────────────────────────── */}
      <div style={{ ...S.row, marginBottom: '4px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-verified">Active Governance Engine</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
            Agent Trust Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '600px' }}>
            Real-time cryptographic audit trail and human-in-the-loop policy enforcement for IBM Bob autonomous coding agents.
          </p>
        </div>

        {/* Chain status + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', borderRadius: '8px',
            background: verified ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `1px solid ${verified ? 'rgba(62,107,79,0.35)' : 'rgba(178,58,46,0.35)'}`,
          }}>
            {verified
              ? <CheckCircle2 size={16} color="var(--success)" />
              : <XCircle     size={16} color="var(--danger)" />}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: verified ? 'var(--success)' : 'var(--danger)' }}>
              {verified ? 'Chain Verified' : 'Tamper Detected'}
            </span>
          </div>

          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="btn btn-primary"
            style={{ padding: '9px 18px' }}
          >
            <Play size={15} />
            {isSimulating ? 'Injecting telemetry…' : 'Simulate Bob Activity'}
          </button>
        </div>
      </div>

      {/* ── 4 KPI cards ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

        <StatCard
          label="Active Runs"
          value={activeRuns}
          subtext={`${runs.length} total recorded agent sessions`}
          accent="16,16,16"
          icon={<Clock size={17} color="var(--ink)" />}
        />

        <StatCard
          label="Total Events"
          value={totalEvents}
          subtext="SHA-256 hashed & chained in Postgres"
          accent="16,16,16"
          icon={<Database size={17} color="var(--ink)" />}
        />

        <StatCard
          label="Risky Actions"
          value={riskyActions}
          subtext="Flagged by deterministic policy engine"
          accent="232,163,61"
          icon={<Flame size={17} color="var(--accent)" />}
        />

        <StatCard
          label="Pending Approvals"
          value={pendingApprovals}
          subtext={pendingApprovals > 0 ? 'Action required in Approval Queue →' : 'Zero tasks paused'}
          accent="232,163,61"
          icon={<ShieldAlert size={17} color="var(--accent)" />}
          clickable={pendingApprovals > 0}
          onClick={() => pendingApprovals > 0 && onNavigate('approvals')}
        />

      </div>

      {/* ── Bottom grid: runs + live stream ────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

        {/* Recent runs */}
        <div style={S.card}>
          <div style={{ ...S.row, marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                Monitored Agent Runs
              </h3>
              <p style={S.sub}>Audit sessions from IBM Bob tasks</p>
            </div>
            <button
              onClick={() => onNavigate('timeline')}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              View All
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
            {runs.length === 0
              ? <p style={S.sub}>No agent runs recorded yet.</p>
              : runs.slice(0, 4).map(r => (
                <div
                  key={r.id}
                  onClick={() => onSelectRun(r.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '8px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{r.id}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>({r.bob_task_id})</span>
                    </div>
                    <div style={S.sub}>{r.event_count} events · {r.high_risk_count} high-risk</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {r.chain_verified === false
                      ? <span className="badge badge-tampered">Tampered</span>
                      : r.chain_verified === true
                      ? <span className="badge badge-verified">Verified</span>
                      : <span className="badge badge-medium">Active</span>}
                    <ArrowRight size={14} color="var(--muted)" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Live telemetry */}
        <div style={S.card}>
          <div style={{ ...S.row, marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                Live Telemetry Stream
              </h3>
              <p style={S.sub}>Latest SHA-256 chained events</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot" style={{ background: 'var(--success)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Ingest</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
            {recentEvents.length === 0
              ? <p style={S.sub}>No recent events.</p>
              : recentEvents.slice(0, 4).map((ev, idx) => (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    animation: `fade-in 0.18s ease-out ${idx * 0.05}s both`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '6px',
                      background: 'rgba(16,16,16,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {ev.event_type.includes('file')
                        ? <FileCode2 size={14} color="var(--muted)" />
                        : <Terminal  size={14} color="var(--muted)" />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
                        <span style={{ color: 'var(--accent)' }}>{ev.action}</span>{' '}{ev.target}
                      </div>
                      <div className="mono" style={{ color: 'var(--muted)' }}>
                        {ev.event_hash.slice(0, 14)}…
                      </div>
                    </div>
                  </div>

                  <div>
                    {ev.risk_level === 'HIGH'   && <span className="badge badge-high">High</span>}
                    {ev.risk_level === 'MEDIUM' && <span className="badge badge-medium">Med</span>}
                    {ev.risk_level === 'LOW'    && <span className="badge badge-low">Low</span>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>

    </div>
  );
}
