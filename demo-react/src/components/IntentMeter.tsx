/**
 * IntentMeter — A persistent vertical gauge bar that visualises live intent
 * signals (rage, anxiety, hesitation, bot likelihood, idle, exit intent) in
 * real-time.  Designed for non-technical stakeholders to "feel" the library.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntent } from '../IntentContext';
import type {
  HighEntropyPayload,
  DwellTimeAnomalyPayload,
  HesitationDetectedPayload,
  TrajectoryAnomalyPayload,
  ExitIntentPayload,
} from '@passiveintent/core';

interface Gauge {
  label: string;
  emoji: string;
  value: number; // 0–100
  color: string;
}

const DECAY_INTERVAL = 200; // ms between decay ticks
const DECAY_AMOUNT = 0.5; // % to subtract per tick
const CLAMP = (v: number) => Math.max(0, Math.min(100, v));

export default function IntentMeter() {
  const { on, getTelemetry } = useIntent();

  const [rage, setRage] = useState(0);
  const [anxiety, setAnxiety] = useState(0);
  const [hesitation, setHesitation] = useState(0);
  const [botPct, setBotPct] = useState(0);
  const [idle, setIdle] = useState(0);
  const [exitIntent, setExitIntent] = useState(0);
  const [visible, setVisible] = useState(true);

  // Decay all meters slowly toward 0
  useEffect(() => {
    const id = setInterval(() => {
      setRage((v) => CLAMP(v - DECAY_AMOUNT));
      setAnxiety((v) => CLAMP(v - DECAY_AMOUNT));
      setHesitation((v) => CLAMP(v - DECAY_AMOUNT));
      setExitIntent((v) => CLAMP(v - DECAY_AMOUNT));
      // idle + bot don't decay — they are binary / telemetry-driven
    }, DECAY_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Bot status from telemetry (polled)
  useEffect(() => {
    const id = setInterval(() => {
      const t = getTelemetry();
      setBotPct(t.botStatus === 'suspected_bot' ? 100 : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [getTelemetry]);

  // Subscribe to events
  useEffect(() => {
    const unsubs = [
      on('high_entropy', (p) => {
        const payload = p as HighEntropyPayload;
        setRage(CLAMP(payload.normalizedEntropy * 100));
      }),
      on('dwell_time_anomaly', (p) => {
        const payload = p as DwellTimeAnomalyPayload;
        setHesitation(CLAMP(Math.min(payload.zScore * 25, 100)));
      }),
      on('hesitation_detected', (p) => {
        const payload = p as HesitationDetectedPayload;
        const combined = (Math.abs(payload.dwellZScore) + Math.abs(payload.trajectoryZScore)) / 2;
        setHesitation(CLAMP(combined * 25));
      }),
      on('trajectory_anomaly', (p) => {
        const payload = p as TrajectoryAnomalyPayload;
        setAnxiety(CLAMP(Math.abs(payload.zScore) * 25));
      }),
      on('exit_intent', (_p) => {
        setExitIntent(100);
      }),
      on('user_idle', () => setIdle(100)),
      on('user_resumed', () => setIdle(0)),
    ];
    return () => unsubs.forEach((u) => u());
  }, [on]);

  const gauges: Gauge[] = [
    { label: 'Rage', emoji: '😤', value: rage, color: 'var(--red)' },
    { label: 'Anxiety', emoji: '😰', value: anxiety, color: 'var(--yellow)' },
    { label: 'Hesitation', emoji: '🤔', value: hesitation, color: 'var(--purple)' },
    { label: 'Bot', emoji: '🤖', value: botPct, color: 'var(--red)' },
    { label: 'Idle', emoji: '💤', value: idle, color: 'var(--text-muted)' },
    { label: 'Exit', emoji: '🚪', value: exitIntent, color: 'var(--blue)' },
  ];

  return (
    <div className={`intent-meter${visible ? '' : ' intent-meter--collapsed'}`}>
      <button
        className="intent-meter-toggle"
        onClick={() => setVisible((v) => !v)}
        title={visible ? 'Hide meter' : 'Show meter'}
      >
        {visible ? '◀' : '▶'}
      </button>
      {visible && (
        <div className="intent-meter-body">
          <div className="intent-meter-title">Intent Meter</div>
          {gauges.map((g) => (
            <div key={g.label} className="gauge-row">
              <span className="gauge-emoji">{g.emoji}</span>
              <div className="gauge-track">
                <div
                  className="gauge-fill"
                  style={{
                    height: `${g.value}%`,
                    background: g.color,
                    boxShadow: g.value > 50 ? `0 0 8px ${g.color}` : 'none',
                  }}
                />
              </div>
              <span className="gauge-label">{g.label}</span>
              <span className="gauge-value">{Math.round(g.value)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
