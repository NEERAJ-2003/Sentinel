import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import TimelineView from './components/TimelineView';
import ApprovalQueueView from './components/ApprovalQueueView';
import VerifyChainView from './components/VerifyChainView';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [runs, setRuns] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
    // Auto-refresh interval to reflect real-time Bob telemetry
    const interval = setInterval(() => {
      loadStatsAndPending();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [statsData, runsData, pendingData] = await Promise.all([
        api.getDashboardStats(),
        api.getRuns(),
        api.getPendingApprovals()
      ]);
      setStats(statsData);
      setRuns(runsData);
      setPendingApprovals(pendingData);
      if (runsData.length > 0 && !selectedRunId) {
        setSelectedRunId(runsData[0].id);
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadStatsAndPending() {
    try {
      const [statsData, runsData, pendingData] = await Promise.all([
        api.getDashboardStats(),
        api.getRuns(),
        api.getPendingApprovals()
      ]);
      setStats(statsData);
      setRuns(runsData);
      setPendingApprovals(pendingData);
    } catch (err) {
      console.warn("Silent background poll error:", err);
    }
  }

  async function handleRunSimulation() {
    setIsSimulating(true);
    try {
      const res = await api.triggerSimulation({ includePending: true });
      setSelectedRunId(res.run_id);
      await loadAllData();
      // If there's a pending approval, notify or switch view
      if (res.has_pending_approval) {
        setCurrentTab('approvals');
      }
    } catch (err) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  }

  function handleSelectRun(runId) {
    setSelectedRunId(runId);
    setCurrentTab('timeline');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 0 60px' }}>
        <div className="container">
          
          {loading && !stats ? (
            <div style={{ padding: '80px', textAlign: 'center', color: '#94A3B8' }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid rgba(6,182,212,0.3)',
                borderTopColor: '#06B6D4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ marginTop: '16px', fontSize: '0.9rem' }}>
                Connecting to Sentinel Trust Engine...
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  runs={runs}
                  onSelectRun={handleSelectRun}
                  onNavigate={setCurrentTab}
                  onRunSimulation={handleRunSimulation}
                  isSimulating={isSimulating}
                />
              )}

              {currentTab === 'timeline' && (
                <TimelineView
                  runs={runs}
                  selectedRunId={selectedRunId}
                  onSelectRun={setSelectedRunId}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'approvals' && (
                <ApprovalQueueView
                  pendingApprovals={pendingApprovals}
                  onRefresh={loadStatsAndPending}
                  runs={runs}
                />
              )}

              {currentTab === 'verify' && (
                <VerifyChainView
                  runs={runs}
                  selectedRunId={selectedRunId}
                  onSelectRun={setSelectedRunId}
                  onRefreshStats={loadStatsAndPending}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', background: '#05070B', fontSize: '0.75rem', color: '#64748B' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            Sentinel AI Governance Engine · Built for IBM Bob Autonomous Coding Agent Hackathon
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Backend: Python FastAPI</span>
            <span>Frontend: React 18</span>
            <span>DB: PostgreSQL (Docker Dev / Neon Prod)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
