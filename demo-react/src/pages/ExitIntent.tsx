/**
 * Exit Intent — smart exit-intent with likelyNext Markov prediction.
 */
import React from 'react';
import { usePassiveIntent, useExitIntent } from '@passiveintent/react';
import { lifecycleAdapter } from '../adapters';
import CodeBlock from '../components/CodeBlock';
import PageHeader from '../components/PageHeader';

export default function ExitIntent() {
  const { track } = usePassiveIntent();
  const { triggered, state, likelyNext, dismiss } = useExitIntent();

  function buildGraph() {
    for (let i = 0; i < 10; i++) {
      track('/checkout/payment');
      track('/cart');
      track('/checkout/payment');
      track('/thank-you');
    }
  }

  function simulateExit() {
    lifecycleAdapter.triggerExitIntent();
  }

  return (
    <>
      <PageHeader
        hook="⚛️ useExitIntent()"
        title="Smart Exit Intent"
        description={
          <>
            Fires when the pointer moves above the viewport <em>and</em> the Markov graph has at
            least one candidate with probability ≥ 0.4. <strong>No graph = no event</strong> — this
            prevents spammy overlays on accidental toolbar skims. The <code>likelyNext</code> field
            tells you exactly where the user was heading.
          </>
        }
      />

      <div className="two-col">
        <div className="card">
          <div className="card-title">Browser-native</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
            Build the graph first, then move your cursor to the very top of the viewport (above the
            page content, towards the browser address bar).
          </p>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={buildGraph}>
              Build Graph (10 sessions)
            </button>
            <button className="btn btn-primary" onClick={() => track('/checkout/payment')}>
              📍 Track /checkout/payment
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Simulate programmatically</div>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={buildGraph}>
              Build Graph
            </button>
            <button className="btn btn-danger" onClick={simulateExit}>
              🚪 Simulate Exit Intent
            </button>
          </div>
        </div>
      </div>

      {triggered && (
        <div className="alert alert-error" style={{ marginTop: 8 }}>
          <strong>exit_intent</strong> fired! state:{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>{state}</code> | likelyNext:{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>{likelyNext ?? 'none'}</code>{' '}
          <button type="button" className="btn btn-secondary" onClick={dismiss}>
            Dismiss
          </button>
        </div>
      )}

      <CodeBlock
        label="useExitIntent() — last-chance offer gated on Markov confidence"
        code={`<span class="kw">const</span> { <span class="prop">triggered</span>, <span class="prop">state</span>, <span class="prop">likelyNext</span>, <span class="prop">dismiss</span> } = <span class="fn">useExitIntent</span>();

<span class="kw">if</span> (triggered && state === <span class="str">'/checkout/payment'</span>) {
  <span class="kw">return</span> (
    &lt;<span class="fn">ExitOverlay</span>
      title=<span class="str">"Wait — your cart expires in 10 min!"</span>
      suggestedPage={likelyNext}
      onClose={dismiss}
    /&gt;
  );
}`}
      />
    </>
  );
}
