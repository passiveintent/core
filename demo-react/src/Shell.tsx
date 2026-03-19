import React, { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useLogContext, type LogEntry } from './LogContext';
import IntentMeter from './components/IntentMeter';
import type { DemoKey } from './App';

interface NavItem {
  key: DemoKey;
  label: string;
}

const NAV: Array<{ section: string; items: NavItem[]; showcase?: boolean }> = [
  {
    section: 'Start Here',
    items: [
      { key: 'overview', label: '📊 Overview & Telemetry' },
      { key: 'basic-tracking', label: '📍 Basic Tracking' },
    ],
  },
  {
    section: 'Showcases',
    showcase: true,
    items: [
      { key: 'showcase-ecommerce', label: '🛒 E-Commerce Rescue' },
      { key: 'showcase-fintech', label: '🔐 FinTech Security' },
      { key: 'showcase-healthcare', label: '🏥 Healthcare Intake' },
      { key: 'showcase-churn', label: '📉 SaaS Churn Prevention' },
    ],
  },
  {
    section: 'Behavioral Signals',
    items: [
      { key: 'high-entropy', label: '⚡ High Entropy' },
      { key: 'dwell-time', label: '⏱ Dwell Time Anomaly' },
      { key: 'trajectory', label: '🛤 Trajectory Anomaly' },
      { key: 'hesitation', label: '🤔 Hesitation Detection' },
    ],
  },
  {
    section: 'Lifecycle Events',
    items: [
      { key: 'attention-return', label: '👁 Attention Return' },
      { key: 'idle-detection', label: '💤 Idle Detection' },
      { key: 'exit-intent', label: '🚪 Exit Intent' },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { key: 'bloom-filter', label: '🌸 Bloom Filter' },
      { key: 'markov-graph', label: '🕸 Markov Predictions' },
      { key: 'bot-detection', label: '🤖 Bot Detection' },
      { key: 'cross-tab', label: '📡 Cross-Tab Sync' },
    ],
  },
  {
    section: 'Business Logic',
    items: [
      { key: 'conversion', label: '💰 Conversion Tracking' },
      { key: 'counters', label: '🔢 Session Counters' },
      { key: 'propensity-score', label: '📐 Propensity Score' },
    ],
  },
  {
    section: 'Calibration',
    items: [{ key: 'byob', label: '🎯 Bring Your Own Baseline' }],
  },
];

const QUICK_JUMPS: Array<{ key: DemoKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'showcase-ecommerce', label: 'E-Commerce' },
  { key: 'showcase-fintech', label: 'FinTech' },
  { key: 'basic-tracking', label: 'Tracking' },
  { key: 'high-entropy', label: 'Entropy' },
  { key: 'dwell-time', label: 'Dwell Time' },
  { key: 'exit-intent', label: 'Exit Intent' },
  { key: 'bot-detection', label: 'Bot Detection' },
  { key: 'propensity-score', label: 'Propensity' },
  { key: 'byob', label: 'BYOB' },
];

interface Props {
  active: DemoKey;
  onNavigate: (key: DemoKey) => void;
  onReset: () => void;
  children: ReactNode;
}

export default function Shell({ active, onNavigate, onReset, children }: Props) {
  const { logEntries, clearLog } = useLogContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  const flatNav = useMemo(() => NAV.flatMap((group) => group.items), []);

  const activeLabel = useMemo(
    () => flatNav.find((item) => item.key === active)?.label ?? active,
    [active, flatNav],
  );

  const currentIndex = useMemo(
    () => flatNav.findIndex((item) => item.key === active),
    [active, flatNav],
  );
  const prevPage = currentIndex > 0 ? flatNav[currentIndex - 1] : null;
  const nextPage = currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null;

  const handleNavigate = useCallback(
    (key: DemoKey) => {
      if (!hasNavigated) setHasNavigated(true);
      onNavigate(key);
    },
    [hasNavigated, onNavigate],
  );

  return (
    <div id="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚛️</span>
          <div>
            <span className="header-kicker">Core library guided lab</span>
            <h1 className="header-title">PassiveIntent</h1>
            <span className="header-sub">React demo with feature-parity shell</span>
          </div>
        </div>
        <div className="header-right">
          <span className="badge badge-green">v1.1.0</span>
          <span className="badge badge-blue">React 18</span>
          <span className="badge badge-purple">@passiveintent/react</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            title="Destroy the current IntentManager and start a completely fresh session — clears all learned transitions, bot state, trajectory, and gauges."
          >
            Reset Session
          </button>
          <a
            href="https://github.com/passiveintent/core"
            target="_blank"
            rel="noopener noreferrer"
            className="gh-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <div className={`layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <nav className={`sidebar${sidebarOpen ? '' : ' sidebar--hidden'}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
            title="Collapse sidebar"
          >
            ◀
          </button>
          <div className="sidebar-inner">
            {NAV.map(({ section, items, showcase }) => (
              <React.Fragment key={section}>
                <div className={`nav-section-label${showcase ? ' nav-section-showcase' : ''}`}>
                  {section}
                </div>
                {items.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`nav-item${active === key ? ' active' : ''}`}
                    onClick={() => handleNavigate(key)}
                  >
                    {label}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {!sidebarOpen && (
          <button
            className="sidebar-expand"
            onClick={() => setSidebarOpen(true)}
            title="Expand sidebar"
          >
            ▶
          </button>
        )}

        <main className="content">
          <div className="content-shell">
            {!hasNavigated ? (
              <section className="lab-intro">
                <div className="lab-intro-copy">
                  <p className="section-eyebrow">Guided lab</p>
                  <h2 className="shell-title">
                    Explore the shipping core library through the scenarios that matter most.
                  </h2>
                  <p className="shell-copy">
                    The React experience keeps the full feature surface, but improves first-run flow
                    with clearer entry points, more breathable spacing, and the same shell, scenario
                    map, and quick-entry flow as the Vanilla demo.
                  </p>
                  <div className="quick-jump-bar">
                    {QUICK_JUMPS.map((jump) => (
                      <button
                        key={jump.key}
                        type="button"
                        className={`quick-jump${active === jump.key ? ' active' : ''}`}
                        onClick={() => handleNavigate(jump.key)}
                      >
                        {jump.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lab-intro-aside">
                  <div className="shell-stat-grid">
                    <article className="shell-stat">
                      <span className="shell-stat-label">Coverage</span>
                      <strong>Full lab</strong>
                      <p>Telemetry, anomalies, lifecycle, business logic, and calibration.</p>
                    </article>
                    <article className="shell-stat">
                      <span className="shell-stat-label">Best entry points</span>
                      <strong>Overview, Exit</strong>
                      <p>
                        Start with the quick jumps, then use the sidebar for full scenario coverage.
                      </p>
                    </article>
                    <article className="shell-stat">
                      <span className="shell-stat-label">Shell parity</span>
                      <strong>Vanilla + React</strong>
                      <p>Both demos share the same layout, spacing, and guided-lab structure.</p>
                    </article>
                  </div>
                </div>
              </section>
            ) : (
              <div className="lab-intro-collapsed">
                <div className="quick-jump-bar">
                  {QUICK_JUMPS.map((jump) => (
                    <button
                      key={jump.key}
                      type="button"
                      className={`quick-jump${active === jump.key ? ' active' : ''}`}
                      onClick={() => handleNavigate(jump.key)}
                    >
                      {jump.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="page-heading-row">
              <span className="page-module-label">Current module</span>
              <strong className="page-module-value">{activeLabel}</strong>
            </div>

            <section className="page-surface">{children}</section>

            <div className="page-nav-footer">
              {prevPage && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleNavigate(prevPage.key)}
                >
                  ← {prevPage.label}
                </button>
              )}
              <span style={{ flex: 1 }} />
              {nextPage && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleNavigate(nextPage.key)}
                >
                  Next: {nextPage.label} →
                </button>
              )}
            </div>
          </div>
        </main>

        <aside className="utility-rail">
          <IntentMeter />

          <section className={`event-log${logOpen ? '' : ' event-log--collapsed'}`}>
            <div className="event-log-header">
              <div>
                <span className="event-log-kicker">Background telemetry</span>
                <div className="event-log-title-row">
                  <span>Live Event Log</span>
                  <span className="event-log-count">{logEntries.length}</span>
                </div>
              </div>
              <div className="event-log-actions">
                <button className="btn btn-ghost btn-sm" onClick={clearLog}>
                  Clear
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setLogOpen((open) => !open)}
                  aria-expanded={logOpen}
                  title={logOpen ? 'Collapse log' : 'Expand log'}
                >
                  {logOpen ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {logOpen && (
              <div className="event-log-entries">
                {logEntries.length === 0 ? (
                  <div className="log-empty">
                    Click any simulation button or product card — events appear here in real-time.
                  </div>
                ) : (
                  logEntries.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function safeSerialize(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return '<unserializable payload>';
  }
}

function LogEntryRow({ entry }: { entry: LogEntry }) {
  const cssClass = `log-${entry.eventName.replace(/_/g, '-')}`;
  return (
    <div className={`log-entry ${cssClass} log-default`}>
      <span className="evt-time">{entry.time}</span>
      <span className="evt-name">{entry.eventName.replace(/_/g, ' ')}</span>
      <span className="evt-data">{safeSerialize(entry.data)}</span>
    </div>
  );
}
