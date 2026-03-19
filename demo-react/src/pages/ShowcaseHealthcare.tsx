/**
 * ShowcaseHealthcare — Patient intake disclosure anxiety showcase.
 * The engine detects hesitation on sensitive form fields and surfaces
 * a privacy reassurance prompt before the patient abandons the form.
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
    behavior: 'Long dwell on sensitive intake field',
    signal: 'dwell_time_anomaly',
    action: 'Privacy reassurance modal',
  },
  {
    behavior: 'Hesitation before answering personal question',
    signal: 'hesitation_detected',
    action: 'Empathy nudge + skip option',
  },
  {
    behavior: 'Cursor drift away from form',
    signal: 'trajectory_anomaly',
    action: 'Save progress prompt',
  },
  {
    behavior: 'Exit intent on sensitive step',
    signal: 'exit_intent',
    action: 'HIPAA reminder + continue later',
  },
];

export default function ShowcaseHealthcare() {
  const { track, on } = usePassiveIntent();
  const runGuarded = useSimGuard();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>('demo');
  const [detected, setDetected] = useState(false);
  const [signal, setSignal] = useState('—');
  const [dwellZ, setDwellZ] = useState('—');
  const [simRunning, setSimRunning] = useState(false);
  const [step, setStep] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    const unsubs = [
      on('dwell_time_anomaly', (p) => {
        setDetected(true);
        setSignal('dwell_time_anomaly');
        setDwellZ(((p as { zScore?: number }).zScore ?? 2.8).toFixed(2));
      }),
      on('hesitation_detected', () => {
        setDetected(true);
        setSignal('hesitation_detected');
        setDwellZ('3.4');
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [on]);

  const runSim = useCallback(async () => {
    await runGuarded(async () => {
      setSimRunning(true);
      setDetected(false);
      setSignal('—');
      setDwellZ('—');

      const steps = [
        { state: '/intake/step-1-name', step: 1 },
        { state: '/intake/step-2-dob', step: 2 },
        { state: '/intake/step-3-sensitive', step: 3 },
      ];

      for (const s of steps) {
        track(s.state);
        setStep(s.step);
        if (s.step === 3) {
          // Simulate long dwell on sensitive field
          timerAdapter.fastForward(6000);
        } else {
          timerAdapter.fastForward(400);
        }
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
      }

      // Trigger hesitation via back-and-forth on sensitive step
      track('/intake/step-2-dob');
      timerAdapter.fastForward(300);
      track('/intake/step-3-sensitive');
      timerAdapter.fastForward(5000);

      toast('Disclosure anxiety detected — privacy prompt shown', 'info');
      setSimRunning(false);
    });
  }, [runGuarded, track, toast]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const t = setTimeout(() => runSim(), 800);
    return () => clearTimeout(t);
  }, [runSim]);

  const stepDone = (n: number) => step > n;
  const stepActive = (n: number) => step === n;

  return (
    <div className="showcase-page">
      <PageHeader
        hook="usePassiveIntent() — on('dwell_time_anomaly') · on('hesitation_detected')"
        title="Healthcare Intake Flow"
        description={
          <>
            Detects <strong>disclosure anxiety</strong> when patients hesitate on sensitive
            questions — surfacing a privacy reassurance prompt{' '}
            <strong>before they abandon the form</strong>, keeping the math on their device.
          </>
        }
      />

      <div className="showcase-hero">
        <ShowcaseDevice variant="phone" title="Patient Intake">
          {/* Step progress bar */}
          <div className="showcase-step-bar">
            <div
              className={`showcase-step-dot${stepDone(1) ? ' done' : stepActive(1) ? ' active' : ''}`}
            />
            <div
              className={`showcase-step-dot${stepDone(2) ? ' done' : stepActive(2) ? ' active' : ''}`}
            />
            <div
              className={`showcase-step-dot${stepDone(3) ? ' done' : stepActive(3) ? ' active' : ''}`}
            />
            <div className="showcase-step-dot" />
            <div className="showcase-step-dot" />
          </div>

          <div className="showcase-field">
            <span className="showcase-field-label">Full name</span>
            <span className="showcase-field-value">A. Carter</span>
          </div>
          <div className="showcase-field">
            <span className="showcase-field-label">Date of birth</span>
            <span className="showcase-field-value">Sep 14, 1990</span>
          </div>
          <div className={`showcase-field${step >= 3 ? ' showcase-field-sensitive' : ''}`}>
            <span className="showcase-field-label">Mental health history</span>
            <span
              className="showcase-field-value"
              style={{ color: step >= 3 ? 'var(--yellow)' : 'var(--text-muted)' }}
            >
              {step >= 3 ? 'Select an option…' : '—'}
            </span>
          </div>

          {/* Cursor pauses on sensitive field */}
          {step >= 3 && (
            <div className="showcase-cursor showcase-cursor-pause" style={{ top: 148, left: 40 }} />
          )}

          {/* Privacy reassurance modal */}
          {detected && (
            <div className="showcase-modal showcase-modal-health">
              <span className="showcase-modal-kicker">🔒 Privacy protected</span>
              <strong>Your privacy is our priority.</strong>
              <span className="showcase-modal-note">
                This information is legally protected and only visible to your care team.
              </span>
            </div>
          )}
          {!detected && step < 3 && (
            <div className="showcase-modal showcase-modal-health">
              <span className="showcase-modal-kicker">🔒 Privacy protected</span>
              <strong>Your privacy is our priority.</strong>
              <span className="showcase-modal-note">
                This information is legally protected and only visible to your care team.
              </span>
            </div>
          )}
        </ShowcaseDevice>

        <ShowcaseConsole
          scoreHigh={{ label: 'Normal dwell', value: '1.2s', sub: 'Baseline avg' }}
          scoreLow={{
            label: 'Dwell z-score',
            value: dwellZ === '—' ? '—' : `${dwellZ}σ`,
            sub: 'Disclosure anxiety',
          }}
          meterVariant="green"
          entries={[
            { label: 'signal', value: signal },
            { label: 'field', value: step >= 3 ? 'mental_health_history' : 'standard_field' },
            { label: 'intervention', value: detected ? 'privacy_reassurance' : 'monitoring…' },
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
            title="Walk through patient intake and trigger disclosure anxiety detection"
          >
            {simRunning ? '⏳' : '⚡'} Run Simulation
          </button>
          <button
            type="button"
            className="showcase-toolbar-btn"
            disabled={simRunning}
            onClick={() => {
              setDetected(false);
              setSignal('—');
              setDwellZ('—');
              setStep(0);
            }}
            title="Reset"
          >
            ↺ Reset
          </button>
        </div>
        {simRunning && (
          <span className="showcase-toolbar-status">Walking through intake steps…</span>
        )}
        {detected && <span className="showcase-autoplay-badge">Disclosure anxiety detected</span>}
      </div>

      <ShowcaseTabs tabs={TABS} active={tab} onChange={setTab}>
        {tab === 'demo' && (
          <div className="showcase-how-grid">
            <div className="showcase-how-card">
              <span>Step 1</span>
              <strong>Baseline from Safe Fields</strong>
              <p>
                Engine builds normal dwell-time averages from non-sensitive form fields in the
                session.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 2</span>
              <strong>Welford Variance Spike</strong>
              <p>
                When a patient lingers 5–10× longer than the baseline, Welford online variance
                detects the anomaly.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 3</span>
              <strong>Context-Aware Trigger</strong>
              <p>
                The engine checks trajectory — sensitive-field path → hesitation → back-navigation =
                disclosure anxiety pattern.
              </p>
            </div>
            <div className="showcase-how-card">
              <span>Step 4</span>
              <strong>Empathy Response</strong>
              <p>
                A HIPAA-safe privacy reminder renders locally. No patient data is sent to
                PassiveIntent servers.
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
              The dwell-time module uses Welford's online algorithm to compute a running mean and
              variance without storing the full history. When the z-score of time spent on a field
              exceeds{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>2.0σ</code>{' '}
              and the trajectory matches the sensitive-field pattern, the{' '}
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-h)' }}>
                hesitation_detected
              </code>{' '}
              event fires. Zero behavioral export.
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
                {`on('dwell_time_anomaly', ({ zScore }) => {`}
                <br />
                {'  if (zScore > 2.0) showPrivacyAssurance();'}
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
