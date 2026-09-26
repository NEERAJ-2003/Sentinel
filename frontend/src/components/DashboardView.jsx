import React from 'react';
import { 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  FileCode2, 
  Flame, 
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  runs, 
  onSelectRun, 
  onNavigate, 
  onRunSimulation, 
  isSimulating 
}) {
  const activeRuns = stats?.active_runs || 0;
  const totalEvents = stats?.total_events || 0;
  const riskyActions = stats?.risky_actions || 0;
  const pendingApprovals = stats?.pending_approvals || 0;
  const chainStatus = stats?.chain_status || 'VERIFIED';
  const recentEvents = stats?.recent_events || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Hero Governance Banner */}
      <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(19, 25, 38, 0.95), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-verified">
                Active Governance Engine
              </span>
              <span style={{ color: '#64748B', fontSize: '0.8rem' }}>
                Pipeline: Bob → Observe → Analyze → Control → Record → Verify
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '6px' }}>
              Agent Trust Dashboard
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '640px' }}>
              Real-time cryptographic audit trail and human-in-the-loop policy enforcement for IBM Bob autonomous coding agents.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: chainStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: chainStatus === 'VERIFIED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {chainStatus === 'VERIFIED' ? (
                <>
                  <CheckCircle2 color="#10B981" size={24} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' }}>Overall Chain Status</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#34D399' }}>🟢 VERIFIED</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle color="#EF4444" size={24} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#FCA5A5', textTransform: 'uppercase', fontWeight: '600' }}>Tamper Detected</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F87171' }}>🔴 COMPROMISED</div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onRunSimulation}
              disabled={isSimulating}
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <Play size={16} />
              <span>{isSimulating ? 'Injecting Telemetry...' : 'Simulate Bob Activity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Metric 1: Active Runs */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Active Runs</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#06B6D4" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            {activeRuns}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            {runs.length} total recorded agent sessions
          </div>
        </div>

        {/* Metric 2: Total Events */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Total Events</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={18} color="#818CF8" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            {totalEvents}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            SHA-256 hashed & chained in Postgres
          </div>
        </div>

        {/* Metric 3: Risky Actions */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Risky Actions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="#EF4444" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#F87171', marginBottom: '4px' }}>
            {riskyActions}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Flagged by deterministic policy engine
          </div>
        </div>

        {/* Metric 4: Pending Approvals */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '22px', 
            cursor: pendingApprovals > 0 ? 'pointer' : 'default',
            borderColor: pendingApprovals > 0 ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle)'
          }}
          onClick={() => pendingApprovals > 0 && onNavigate('approvals')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Pending Approvals</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#F59E0B" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: pendingApprovals > 0 ? '#FBBF24' : '#FFFFFF', marginBottom: '4px' }}>
            {pendingApprovals}
          </div>
          <div style={{ fontSize: '0.78rem', color: pendingApprovals > 0 ? '#F59E0B' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pendingApprovals > 0 ? 'Action required in Approval Queue →' : 'Zero tasks paused'}
          </div>
        </div>

      </div>

      {/* Grid: Recent Runs & Live Event Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Recent Runs List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>Monitored Agent Runs</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Audit sessions from IBM Bob tasks</p>
            </div>
            <button 
              onClick={() => onNavigate('timeline')}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {runs.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.85rem', padding: '16px 0' }}>No agent runs recorded yet.</p>
            ) : (
              runs.slice(0, 5).map(r => (
                <div 
                  key={r.id}
                  onClick={() => onSelectRun(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="font-mono" style={{ fontWeight: '700', fontSize: '0.88rem', color: '#F1F5F9' }}>
                        {r.id}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        ({r.bob_task_id})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {r.event_count} events · {r.high_risk_count} high-risk actions
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {r.chain_verified === false ? (
                      <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>Tampered</span>
                    ) : r.chain_verified === true ? (
                      <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>Verified</span>
                    ) : (
                      <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>Active</span>
                    )}
                    <ArrowRight size={16} color="#64748B" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Cryptographic Event Stream */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>Live Telemetry Stream</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Latest SHA-256 chained events</p>
            </div>
            <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>
              Real-time Ingest
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentEvents.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.85rem', padding: '16px 0' }}>No recent events.</p>
            ) : (
              recentEvents.slice(0, 6).map(ev => (
                <div 
                  key={ev.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {ev.event_type.includes('file') ? (
                        <FileCode2 size={15} color="#94A3B8" />
                      ) : (
                        <Terminal size={15} color="#94A3B8" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#E2E8F0' }}>
                        <span style={{ color: '#06B6D4' }}>{ev.action}</span> {ev.target}
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>
                        hash: {ev.event_hash.slice(0, 14)}...
                      </div>
                    </div>
                  </div>

                  <div>
                    {ev.risk_level === 'HIGH' && (
                      <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>HIGH</span>
                    )}
                    {ev.risk_level === 'MEDIUM' && (
                      <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>MED</span>
                    )}
                    {ev.risk_level === 'LOW' && (
                      <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>LOW</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
