import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Activity, Clock, AlertTriangle, Play, Lock } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, stats, onRunSimulation, isSimulating }) {
  const pendingCount = stats?.pending_approvals || 0;
  const isCompromised = stats?.chain_status === 'COMPROMISED';

  const NAV = [
    { id: 'dashboard',  label: 'Dashboard',         Icon: Activity },
    { id: 'timeline',   label: 'Run Timeline',       Icon: Clock },
    { id: 'approvals',  label: 'Approval Queue',     Icon: AlertTriangle, badge: pendingCount },
    { id: 'verify',     label: 'Verify Chain',        Icon: Lock, alert: isCompromised },
  ];

  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  // Update the indicator position whenever the active tab changes
  useEffect(() => {
    const activeBtn = buttonRefs.current[currentTab];
    const nav = navRef.current;
    if (!activeBtn || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
      ready: true,
    });
  }, [currentTab]);

  return (
    <header style={{
      background: 'var(--ink)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', gap: '16px' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <ShieldCheck size={22} color="var(--accent)" />
          <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--bg)', letterSpacing: '0.05em' }}>
            SENTINEL
          </span>
        </div>

        {/* Nav tabs */}
        <nav ref={navRef} style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>

          {/* Sliding active indicator */}
          {indicator.ready && (
            <span
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: indicator.left,
                width: indicator.width,
                height: '34px',
                background: 'var(--bg)',
                borderRadius: '6px',
                transition: 'left 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {NAV.map(({ id, label, Icon, badge, alert }) => {
            const active = currentTab === id;
            return (
              <button
                key={id}
                ref={el => { buttonRefs.current[id] = el; }}
                onClick={() => setCurrentTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-sans)',
                  background: 'transparent',
                  color: active ? 'var(--ink)' : 'rgba(242,242,240,0.7)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--bg)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(242,242,240,0.7)'; }}
              >
                <Icon size={15} />
                {label}
                {badge > 0 && (
                  <span style={{
                    background: 'var(--accent)',
                    color: 'var(--ink)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    lineHeight: 1.4,
                  }}>
                    {badge}
                  </span>
                )}
                {alert && (
                  <span style={{
                    background: 'var(--danger)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    lineHeight: 1.4,
                  }}>
                    FAIL
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right-side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.75rem', color: 'rgba(242,242,240,0.6)', fontWeight: 500 }}>
              LIVE
            </span>
          </div>

          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--ink)' }}
          >
            <Play size={14} />
            {isSimulating ? 'Running…' : 'Simulate Run'}
          </button>
        </div>

      </div>
    </header>
  );
}
