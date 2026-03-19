/**
 * Attention Return — comparison-shopper "Welcome Back" pattern.
 * Shows both browser-native (real tab switch) and simulated triggers.
 */
import React, { useState } from 'react';
import { usePassiveIntent, useAttentionReturn } from '@passiveintent/react';
import { timerAdapter, lifecycleAdapter } from '../adapters';
import CodeBlock from '../components/CodeBlock';

export default function AttentionReturn() {
  const { track } = usePassiveIntent();
  const { returned, hiddenDuration, dismiss } = useAttentionReturn();
  const [tracked, setTracked] = useState(false);

  function setupNative() {
    track('/pricing');
    setTracked(true);
  }

  function simulateHide() {
    track('/pricing');
    lifecycleAdapter.triggerPause();
    timerAdapter.fastForward(30_000); // 30 s virtual hide
    setTracked(true);
  }

  function simulateReturn() {
    lifecycleAdapter.triggerResume();
  }

  return (
    <>
      <div className="demo-header">
        <div className="hook-callout">⚛️ useAttentionReturn()</div>
        <h2 className="demo-title">Attention Return</h2>
        <p className="demo-description">
          Fires when the user returns to the tab after being hidden for ≥{' '}
          <strong>15 seconds</strong>. Works independently of <code>dwellTime.enabled</code>. Use it
          for a personalized "Welcome Back" discount modal — the user was almost certainly
          comparison-shopping.
        </p>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Browser-native (real tab switch)</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
            Track a state, switch to another tab for more than 15 seconds, then come back.
          </p>
          <button className="btn btn-primary" onClick={setupNative}>
            📍 Track /pricing then switch tabs
          </button>
          {tracked && (
            <div className="alert alert-info" style={{ marginTop: 10 }}>
              ✓ Tracked. Switch to another tab for &gt;15s, then return here.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Simulate (no tab switch needed)</div>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={simulateHide}>
              👻 Simulate Hide (30s)
            </button>
            <button className="btn btn-green" onClick={simulateReturn}>
              👋 Simulate Return
            </button>
          </div>
        </div>
      </div>

      {returned && (
        <div className="alert alert-success">
          <strong>attention_return</strong> fired! hidden for:{' '}
          <strong>{hiddenDuration.toLocaleString()} ms</strong>{' '}
          <button type="button" className="btn btn-secondary" onClick={dismiss}>
            Dismiss
          </button>
        </div>
      )}

      <CodeBlock
        label="useAttentionReturn() — Welcome Back offer"
        code={`<span class="kw">const</span> { <span class="prop">returned</span>, <span class="prop">hiddenDuration</span>, <span class="prop">dismiss</span> } = <span class="fn">useAttentionReturn</span>();

<span class="kw">if</span> (returned && hiddenDuration > <span class="num">30_000</span>) {
  <span class="kw">return</span> (
    &lt;<span class="fn">WelcomeBackOffer</span>
      message=<span class="str">"Found a better deal? We'll match it + free shipping."</span>
      onClose={dismiss}
    /&gt;
  );
}`}
      />
    </>
  );
}
