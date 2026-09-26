import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Cpu, 
  Lock 
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  stats, 
  onRunSimulation, 
  isSimulating 
}) {
  const pendingCount = stats?.pending_approvals || 0;
  const isCompromised = stats?.chain_status === 'COMPROMISED';

  return (
    <header className="border-b border-white/10 bg-[#07090E]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(6,182,212,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6,182,212,0.3)'
          }}>
            <ShieldCheck size={24} color="#06B6D4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #FFFFFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SENTINEL
              </span>
              <span className="badge badge-verified" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                IBM Bob
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
              Cryptographic Trust & Governance Layer
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="btn"
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              background: currentTab === 'dashboard' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: currentTab === 'dashboard' ? '#22D3EE' : '#94A3B8',
              border: currentTab === 'dashboard' ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
            }}
          >
            <Activity size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('timeline')}
            className="btn"
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              background: currentTab === 'timeline' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: currentTab === 'timeline' ? '#22D3EE' : '#94A3B8',
              border: currentTab === 'timeline' ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
            }}
          >
            <Clock size={16} />
            <span>Run Timeline</span>
          </button>

          <button
            onClick={() => setCurrentTab('approvals')}
            className="btn"
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              background: currentTab === 'approvals' ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: currentTab === 'approvals' ? '#FBBF24' : '#94A3B8',
              border: currentTab === 'approvals' ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
              position: 'relative'
            }}
          >
            <AlertTriangle size={16} color={pendingCount > 0 ? '#F59E0B' : 'currentColor'} />
            <span>Approval Queue</span>
            {pendingCount > 0 && (
              <span style={{
                background: '#EF4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '1px 6px',
                borderRadius: '999px',
                marginLeft: '4px'
              }}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className="btn"
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              background: currentTab === 'verify' ? (isCompromised ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent',
              color: currentTab === 'verify' ? (isCompromised ? '#F87171' : '#34D399') : '#94A3B8',
              border: currentTab === 'verify' ? (isCompromised ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)') : '1px solid transparent',
            }}
          >
            <Lock size={16} />
            <span>Verify & Tamper Lab</span>
            {isCompromised && (
              <span className="badge badge-high" style={{ padding: '1px 6px', fontSize: '0.6rem' }}>FAIL</span>
            )}
          </button>
        </nav>

        {/* Status & Quick Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 10px #10B981'
            }} className="animate-pulse-slow"></span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#CBD5E1' }}>
              FASTAPI ENGINE
            </span>
          </div>

          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Play size={15} />
            <span>{isSimulating ? 'Simulating Bob...' : 'Simulate Bob Run'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
