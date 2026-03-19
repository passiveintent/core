/**
 * ShowcaseFintech — Wire transfer fraud detection showcase.
 * The engine detects erratic cursor kinematics suggesting coercion or
 * unfamiliarity, triggering a biometric verification prompt.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    behavior: 'Rapid back-and-forth between pages',
    signal: 'high_entropy',
    action: 'Biometric verification prompt',
  },
  {
    behavior: 'Erratic cursor drift across form fields',
    signal: 'trajectory_anomaly',
    action: 'Freeze transfer + alert',
  },
  {
    behavior: 'Dwell on amount field (unusual duration)',
    signal: 'dwell_time_anomaly',
    action: 'Confirm identity nudge',
  },
  {
    behavior: 'Repeated hesitation before Submit',
    signal: 'hesitation_detected',
    action: 'Call-back offer',
  },
];

export default function ShowcaseFintech() {
  const { track, on } = usePassiveIntent();
  const runGuarded = useSimGuard();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>('demo');
  const [detected, setDetected] = useState(false);
  const [signal, setSignal] = useState('—');
  const [zScore, setZScore] = useState('—');
  const [simRunning, setSimRunning] = useState(false);
  const [autoPlayed, setAutoPlayed] = useState(false);
  const mountedRef = useRef(false);

  // Subscribe to engine signals
  useEffect(() => {
    const unsubs = [
      on('high_entropy', (p) => {
        setDetected(true);
        setSignal('high_entropy');
        setZScore(((p as { normalizedEntropy?: number }).normalizedEntropy ?? 0.88).toFixed(2));
      }),
      on('trajectory_anomaly', (p) => {
        setDetected(true);
        setSignal('trajectory_anomaly');
        setZScore(((p as { zScore?: number }).zScore ?? 2.6).toFixed(2));
      }),
      on('hesitation_detected', () => {
        setDetected(true);
        setSignal('hesitation_detected');
        setZScore('3.1');
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [on]);

  const runSim = useCallback(async () => {
    await runGuarded(async () => {
      setSimRunning(true);
      setDetected(false);
      setSignal('—');
      setZScore('—');

      const states = [
        '/fintech/dashboard',
        '/fintech/transfers',
        '/fintech/wire/new',
        '/fintech/dashboard',
        '/fintech/transfers',
        '/fintech/wire/new',
        '/fintech/wire/amount',
        '/fintech/wire/new',
        '/fintech/wire/amount',
        '/fintech/wire/confirm',
      ];
      for (const s of states) {
        track(s);
        timerAdapter.fastForward(120);
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
      }
      timerAdapter.fastForward(8000);
      toast('Simulation complete — check the security alert', 'warning');
      setSimRunning(false);
    });
  }, [runGuarded, track, toast]);

  // Auto-play once on mount
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const t = setTimeout(() => {
      setAutoPlayed(true);
      runSim();
    }, 800);
    return () => clearTimeout(t);
  }, [runSim]);

  return (
    <div className="showcase-page">
      <PageHeader
        hook="usePassiveIntent() — on('high_entropy') · on('trajectory_anomaly')"
        title="FinTech Security Shield"
        description={
          <>
            Detects <strong>coercion patterns</strong> and erratic navigation kinematics during
            high-stakes transactions — triggering biometric verification{' '}
            <strong>before the funds move</strong>, entirely on-device.
          </>
        }
      />

      {/* Hero: device + console */}
      <div className="showcase-hero">
        <ShowcaseDevice variant="browser" title="Wire Transfer">
          {/* Form fields */}
          <div className="showcase-field">
            <span className="showcase-field-label">Recipient</span>
            <span className="showcase-field-value">J. Morrison · ****4821</span>
          </div>
          <div className="showcase-field">
            <span className="showcase-field-label">Amount (USD)</span>
            <span className="showcase-field-value">$48,500.00</span>
          </div>
          <div className="showcase-field">
            <span className="showcase-field-label">Routing number</span>
            <span className="showcase-field-value">021000021</span>
          </div>

          {/* Wire actions */}
          <div className="showcase-wire-actions">
            <div className="showcase-wire-btn">Cancel</div>
            <div className="showcase-wire-btn showcase-wire-btn-danger">Send Funds</div>
          </div>

          {/* Animated erratic cursor */}
          <div className="showcase-cursor showcase-cursor-erratic" style={{ top: 80, left: 60 }} />

          {/* Security intervention modal */}
          {detected && (
            <div className="showcase-modal showcase-modal-security">
              <span className="showcase-modal-kicker">Security Shield</span>
              <strong>Unusual navigation patterns detected.</strong>
              <span className="showcase-modal-note">
                Please verify this transfer via facial recognition before proceeding.
              </span>
            </div>
          )}
          {!detected && (
            <div className="showcase-modal showcase-modal-security">
              <span className="showcase-modal-kicker">Security Shield</span>
              <strong>Unusual navigation patterns detected.</strong>
              <span className="showcase-modal-note">
                Please verify this transfer via facial recognition before proceeding.
              </span>
            </div>
          )}
        </ShowcaseDevice>

        <ShowcaseConsole
          scoreHigh={{ label: 'Normal session', value: '92%', sub: 'Baseline confidence' }}
          scoreLow={{
            label: 'Anomaly score',
            value: `${zScore === '—' ? '—' : zScore + 'σ'}`,
            sub: 'Friction detected',
          }}
          meterVariant="red"
          entries={[
            { label: 'signal', value: signal },
            { label: 'trajectory', value: detected ? 'coercion pattern' : 'monitoring…' },
            { label: 'intervention', value: detected ? 'biometric armed' : 'standby' },
          ]}
        />
      </div>

      {/* Controls */}
      <div className="showcase-toolbar">
        <div className="showcase-toolbar-buttons">
          <button
            type="button"
            className="showcase-toolbar-btn"
            onClick={runSim}
            disabled={simRunning}
            data-tooltip="Simulate erratic navigation that triggers the security alert"
            title="Simulate erratic navigation that triggers the security alert"
          >
            {simRunning ? '⏳' : '⚡'} Run Simulation
          </button>
          <button
            type="button"
            className="showcase-toolbar-btn"
            onClick={() => {
              setDetected(false);
              setSignal('—');
              setZScore('—');
            }}
            title="Reset detection state"
          >
            ↺ Reset
          </button>
        </div>
        {simRunning && <span className="showcase-toolbar-status">Simulating erratic session…</span>}
        {!simRunning && autoPlayed && !detected && (
          <span className="showcase-toolbar-status">Waiting for anomaly threshold…</span>
        )}
        {detected && <span className="showcase-autoplay-badge">Security alert triggered</span>}
      </div>

      {/* Tabs */}
      <ShowcaseTabs tabs={TABS} active={tab} onChange={setTab}>
        {tab === 'demo' && (
          <div className="showcase-how-grid">
            <div className="showcase-how-card">
              <span>Step 1</span>
              <strong>Session Baseline</strong>
              <p>
                The engine builds a Markov baseline of normal wire transfer navigation paths from
                prior sessions.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 2</span>
              <strong>Kinematic Sampling</strong>
              <p>
                Each page transition is evaluated against entropy and trajectory baselines in under
                2ms.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 3</span>
              <strong>Anomaly Threshold</strong>
              <p>
                When z-score exceeds 2.5σ, the engine flags the session as a potential coercion
                event.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 4</span>
              <strong>On-Device Intervention</strong>
              <p>
                A biometric verification prompt renders locally — no round-trip to the server
                required.
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
              PassiveIntent uses a Markov chain trained on legitimate wire transfer sessions.
              Entropy is calculated via Shannon's formula across the last N state transitions. When{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>
                normalizedEntropy {'>'} 0.72
              </code>{' '}
              or trajectory z-score exceeds{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>2.5σ</code>
              , the session is classified as anomalous. The math runs entirely in the browser — no
              behavioral data ever leaves the device.
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
                {`on('high_entropy', ({ normalizedEntropy }) => {`}
                <br />
                {'  if (normalizedEntropy > threshold) triggerBiometric();'}
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
