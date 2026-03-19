/**
 * ShowcaseChurn — SaaS subscription cancellation churn prevention showcase.
 * The engine detects hesitation during the cancel flow and fires a retention
 * offer before the user confirms cancellation.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import { timerAdapter } from '../adapters';
import PageHeader from '../components/PageHeader';
import ShowcaseDevice from '../components/ShowcaseDevice';
import ShowcaseConsole from '../components/ShowcaseConsole';
import ShowcaseTabs from '../components/ShowcaseTabs';
import ProofBar from '../components/ProofBar';
import { useSimGuard } from '../hooks/useSimGuard';
import { useToast } from '../components/Toast';

type Tab = 'demo' | 'how' | 'signals';

const TABS = [
  { key: 'demo' as Tab, label: 'Live Demo' },
  { key: 'how' as Tab, label: 'How It Works' },
  { key: 'signals' as Tab, label: 'Signal Map' },
];

const SIGNAL_ROWS = [
  {
    behavior: 'Back-and-forth between Settings and Cancel pages',
    signal: 'trajectory_anomaly',
    action: 'Retention offer slide-in',
  },
  {
    behavior: 'Long dwell on cancel confirmation screen',
    signal: 'dwell_time_anomaly',
    action: '3-month free extension offer',
  },
  {
    behavior: 'Hesitation before clicking Confirm Cancel',
    signal: 'hesitation_detected',
    action: 'Personal outreach prompt',
  },
  {
    behavior: 'Exit intent on the cancel flow',
    signal: 'exit_intent',
    action: 'One-click pause subscription',
  },
];

const BREADCRUMB_STATES = [
  '/account/settings',
  '/account/cancel',
  '/account/cancel/reason',
  '/account/settings',
  '/account/cancel',
  '/account/cancel/confirm',
];

export default function ShowcaseChurn() {
  const { track, on } = usePassiveIntent();
  const runGuarded = useSimGuard();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>('demo');
  const [detected, setDetected] = useState(false);
  const [signal, setSignal] = useState('—');
  const [churnScore, setChurnScore] = useState('—');
  const [simRunning, setSimRunning] = useState(false);
  const [currentPath, setCurrentPath] = useState('/account/settings');

  useEffect(() => {
    const unsubs = [
      on('trajectory_anomaly', (p) => {
        setSignal('trajectory_anomaly');
        setChurnScore(((p as { zScore?: number }).zScore ?? 2.9).toFixed(2));
      }),
      on('hesitation_detected', () => {
        setSignal('hesitation_detected');
        setChurnScore('3.5');
      }),
      on('dwell_time_anomaly', () => {
        setSignal('dwell_time_anomaly');
        if (churnScore === '—') setChurnScore('2.4');
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [on, churnScore]);

  const runSim = useCallback(async () => {
    await runGuarded(async () => {
      setSimRunning(true);
      setDetected(false);
      setSignal('—');
      setChurnScore('—');

      try {
        for (const state of BREADCRUMB_STATES) {
          track(state);
          setCurrentPath(state);
          if (state.includes('cancel')) {
            timerAdapter.fastForward(3500);
          } else {
            timerAdapter.fastForward(500);
          }
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
        }
        timerAdapter.fastForward(6000);

        setDetected(true);
        toast('Churn hesitation detected — retention offer triggered', 'warning');
      } finally {
        setSimRunning(false);
      }
    });
  }, [runGuarded, track, toast]);

  useEffect(() => {
    const t = setTimeout(() => runSim(), 800);
    return () => clearTimeout(t);
  }, [runSim]);

  const pathLabel = (p: string) => p.split('/').filter(Boolean).pop() ?? p;

  return (
    <div className="showcase-page">
      <PageHeader
        hook="usePassiveIntent() — on('trajectory_anomaly') · on('hesitation_detected')"
        title="SaaS Churn Prevention"
        description={
          <>
            Detects hesitation in the <strong>cancel subscription flow</strong> — the back-and-forth
            that precedes a reluctant cancellation — and fires a{' '}
            <strong>retention offer before the user confirms</strong>.
          </>
        }
      />

      <div className="showcase-hero">
        <ShowcaseDevice variant="browser" title="Account Settings">
          {/* Breadcrumb */}
          <div className="showcase-breadcrumb">
            {currentPath
              .split('/')
              .filter(Boolean)
              .map((seg, i, arr) => (
                <React.Fragment key={i}>
                  <span className={i === arr.length - 1 ? 'showcase-breadcrumb-active' : ''}>
                    {seg}
                  </span>
                  {i < arr.length - 1 && <span className="showcase-breadcrumb-sep">/</span>}
                </React.Fragment>
              ))}
          </div>

          {/* Page content based on current path */}
          <div className="showcase-field">
            <span className="showcase-field-label">Current plan</span>
            <span className="showcase-field-value">Pro · $149/mo · renews Mar 1</span>
          </div>
          <div
            className={`showcase-field${currentPath.includes('cancel') ? ' showcase-field-sensitive' : ''}`}
          >
            <span className="showcase-field-label">
              {currentPath.includes('confirm')
                ? 'Confirm cancellation'
                : currentPath.includes('reason')
                  ? 'Reason for leaving'
                  : currentPath.includes('cancel')
                    ? 'Cancel subscription'
                    : 'Subscription'}
            </span>
            <span
              className="showcase-field-value"
              style={{ color: currentPath.includes('cancel') ? 'var(--red)' : undefined }}
            >
              {currentPath.includes('confirm')
                ? 'Your plan ends Mar 1, 2026'
                : currentPath.includes('reason')
                  ? 'Too expensive / Found alternative'
                  : currentPath.includes('cancel')
                    ? 'This will end your access immediately.'
                    : 'Active'}
            </span>
          </div>
          <div className="showcase-wire-actions">
            <div className="showcase-wire-btn">Keep my plan</div>
            {currentPath.includes('cancel') && (
              <div className="showcase-wire-btn showcase-wire-btn-danger">
                {currentPath.includes('confirm') ? 'Confirm Cancel' : 'Continue'}
              </div>
            )}
          </div>

          {/* Cursor drift on cancel path */}
          {currentPath.includes('cancel') && (
            <div className="showcase-cursor showcase-cursor-drift" style={{ top: 100, left: 80 }} />
          )}

          {/* Retention offer */}
          {detected && (
            <div className="showcase-modal showcase-modal-churn">
              <span className="showcase-modal-kicker">Stay & save</span>
              <strong>Stay 3 more months free. We'll make it worth it.</strong>
              <span className="showcase-modal-note">
                One click to activate — no payment needed. Cancel any time after.
              </span>
            </div>
          )}
        </ShowcaseDevice>

        <ShowcaseConsole
          scoreHigh={{ label: 'Retention prob.', value: '76%', sub: 'User is hesitating' }}
          scoreLow={{
            label: 'Churn z-score',
            value: churnScore === '—' ? '—' : `${churnScore}σ`,
            sub: 'Path anomaly',
          }}
          meterVariant="yellow"
          entries={[
            { label: 'signal', value: signal },
            { label: 'path', value: pathLabel(currentPath) },
            { label: 'offer', value: detected ? 'retention_armed' : 'monitoring…' },
          ]}
        />
      </div>

      <div className="showcase-toolbar">
        <div className="showcase-toolbar-buttons">
          <button
            type="button"
            className="showcase-toolbar-btn"
            onClick={runSim}
            disabled={simRunning}
            title="Simulate the cancel flow back-and-forth that triggers churn detection"
          >
            {simRunning ? '⏳' : '⚡'} Run Simulation
          </button>
          <button
            type="button"
            className="showcase-toolbar-btn"
            onClick={() => {
              setDetected(false);
              setSignal('—');
              setChurnScore('—');
              setCurrentPath('/account/settings');
            }}
            title="Reset"
          >
            ↺ Reset
          </button>
        </div>
        {simRunning && (
          <span className="showcase-toolbar-status">Walking through cancel flow…</span>
        )}
        {detected && <span className="showcase-autoplay-badge">Churn hesitation detected</span>}
      </div>

      <ShowcaseTabs tabs={TABS} active={tab} onChange={setTab}>
        {tab === 'demo' && (
          <div className="showcase-how-grid">
            <div className="showcase-how-card">
              <span>Step 1</span>
              <strong>Trajectory Baseline</strong>
              <p>
                The engine knows normal settings navigation — cancel pages are rare, and repeated
                cancel visits are anomalous.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 2</span>
              <strong>Back-and-Forth Detection</strong>
              <p>
                Markov log-likelihood drops when the user oscillates between settings and cancel
                pages — flagged as trajectory anomaly.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 3</span>
              <strong>Hesitation Compound Score</strong>
              <p>
                Combined dwell + trajectory z-score exceeds 2.5σ — the engine classifies this as a
                reluctant cancellation.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 4</span>
              <strong>Precision Retention Offer</strong>
              <p>
                Only users mathematically proven to be on the fence receive the retention offer —
                not every user who visits settings.
              </p>
            </div>
          </div>
        )}
        {tab === 'how' && (
          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              The churn signal combines two engine outputs: a{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>
                trajectory_anomaly
              </code>{' '}
              from the Markov chain (low log-likelihood on the cancel path) and a{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>
                hesitation_detected
              </code>{' '}
              from combined dwell + trajectory z-score. When both fire within the same session, the
              retention intervention is armed. No server required.
            </p>
            <div className="card" style={{ padding: 14 }}>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--accent-h)',
                  display: 'block',
                  lineHeight: 1.8,
                }}
              >
                {`on('hesitation_detected', ({ state }) => {`}
                <br />
                {"  if (state.includes('cancel')) offerRetention();"}
                <br />
                {'});'}
              </code>
            </div>
          </div>
        )}
        {tab === 'signals' && (
          <table className="showcase-signal-table">
            <thead>
              <tr>
                <th>Behavior</th>
                <th>Signal</th>
                <th>Intervention</th>
              </tr>
            </thead>
            <tbody>
              {SIGNAL_ROWS.map((r) => (
                <tr key={r.signal}>
                  <td>{r.behavior}</td>
                  <td>
                    <code
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-h)',
                        fontSize: 11,
                      }}
                    >
                      {r.signal}
                    </code>
                  </td>
                  <td>{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ShowcaseTabs>

      <ProofBar />
    </div>
  );
}
