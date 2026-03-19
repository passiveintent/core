/**
 * Idle Detection — user_idle + user_resumed with simulation buttons.
 */
import React, { useState } from 'react';
import { usePassiveIntent, useIdle } from '@passiveintent/react';
import { timerAdapter, lifecycleAdapter } from '../adapters';
import CodeBlock from '../components/CodeBlock';
import PageHeader from '../components/PageHeader';
import StatusAlert from '../components/StatusAlert';

export default function IdleDetection() {
  const { track } = usePassiveIntent();
  const { isIdle, idleMs } = useIdle();
  const [status, setStatus] = useState<string | null>(null);

  function simulateIdle() {
    track('/checkout/payment');
    timerAdapter.fastForward(3 * 60 * 1000); // 3 min — past 2-min threshold
    setStatus("Fast-forwarded 3 minutes. user_idle will fire if the engine's idle timer ticks.");
  }

  function simulateResume() {
    lifecycleAdapter.triggerInteraction();
    setStatus('Interaction triggered — user_resumed fires after an idle period.');
  }

  return (
    <>
      <PageHeader
        hook="⚛️ useIdle()"
        title="Idle Detection"
        description={
          <>
            <strong>user_idle</strong> fires after 2 minutes of no interaction (mouse, keyboard,
            scroll, touch). <strong>user_resumed</strong> fires on the next interaction, with total{' '}
            <code>idleMs</code>. The dwell-time baseline is adjusted to exclude the idle gap
            automatically — keeping your Welford accumulator clean.
          </>
        }
      />

      <div className="card">
        <div className="card-title">Simulate idle cycle</div>
        <div className="btn-row">
          <button className="btn btn-secondary" onClick={simulateIdle}>
            💤 Simulate Idle (3-min timeout)
          </button>
          <button className="btn btn-primary" onClick={simulateResume}>
            🖱 Simulate Interaction (resume)
          </button>
        </div>
        {status && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            {status}
          </div>
        )}
      </div>

      <div className="two-col">
        {isIdle && (
          <div className="card">
            <div className="card-title">Currently idle</div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}
            >
              isIdle: <span style={{ color: 'var(--accent-h)' }}>true</span>
            </div>
          </div>
        )}
        {!isIdle && idleMs > 0 && (
          <div className="card">
            <div className="card-title">Resumed after idle</div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}
            >
              idleMs: <span style={{ color: 'var(--green)' }}>{idleMs.toLocaleString()} ms</span>
            </div>
          </div>
        )}
      </div>

      <CodeBlock
        label="useIdle() — dim UI + refresh stale content"
        code={`<span class="kw">const</span> { <span class="prop">isIdle</span>, <span class="prop">idleMs</span> } = <span class="fn">useIdle</span>();

<span class="fn">useEffect</span>(() => {
  <span class="kw">if</span> (isIdle) {
    <span class="fn">setOverlay</span>(<span class="kw">true</span>); <span class="cmt">// dim the screen</span>
    VideoPlayer.<span class="fn">pause</span>();
  } <span class="kw">else</span> {
    <span class="fn">setOverlay</span>(<span class="kw">false</span>);
    <span class="kw">if</span> (idleMs > <span class="num">300_000</span>) <span class="fn">refetch</span>(); <span class="cmt">// data might be stale after 5+ min</span>
  }
}, [isIdle, idleMs]);`}
      />
    </>
  );
}
