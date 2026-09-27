import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewView from './components/OverviewView';
import DashboardView from './components/DashboardView';
import TimelineView from './components/TimelineView';
import ApprovalQueueView from './components/ApprovalQueueView';
import VerifyChainView from './components/VerifyChainView';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
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

  function handleLogoClick() {
    setCurrentTab('overview');
  }

  return (
    <div style={{ minHeight: '100dvh', height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
        onOpenArchitecture={handleLogoClick}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 0 16px', overflowY: 'auto', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
        <div className="container">
          
          {loading && !stats ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '0.9rem' }}>
                Connecting to Sentinel Trust Engine…
              </div>
            </div>
          ) : (
            <div key={currentTab} className="view-enter">
              {currentTab === 'overview' && (
                <OverviewView
                  onNavigate={setCurrentTab}
                  onRunSimulation={handleRunSimulation}
                  isSimulating={isSimulating}
                />
              )}

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
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container app-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Sentinel</span>
            <span>AI Governance Engine</span>
            <span>·</span>
            <span>IBM Bob Hackathon 2.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>Created by</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>@hyperlane</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
