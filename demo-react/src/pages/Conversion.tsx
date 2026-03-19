/**
 * Conversion Tracking — trackConversion() via usePassiveIntent hook.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import CodeBlock from '../components/CodeBlock';
import PageHeader from '../components/PageHeader';
import type { ConversionPayload } from '@passiveintent/react';

export default function Conversion() {
  const { on, trackConversion } = usePassiveIntent();
  const [type, setType] = useState('purchase');
  const [value, setValue] = useState(49.99);
  const [currency, setCurrency] = useState('USD');
  const [history, setHistory] = useState<ConversionPayload[]>([]);

  useEffect(() => {
    return on('conversion', (p) => {
      setHistory((h) => [p as ConversionPayload, ...h].slice(0, 10));
    });
  }, [on]);

  const handleTrack = useCallback(() => {
    trackConversion({ type, value, currency });
  }, [type, value, currency, trackConversion]);

  return (
    <>
      <PageHeader
        hook="⚛️ usePassiveIntent() — trackConversion()"
        title="Conversion Tracking"
        description={
          <>
            <strong>trackConversion()</strong> emits a <strong>conversion</strong> event locally.
            The payload <em>never leaves the device</em> unless your listener explicitly sends it.
            Use it to correlate behavioral signals with revenue outcomes — entirely in-browser,
            fully GDPR-compliant.
          </>
        }
      />

      <div className="card">
        <div className="card-title">Fire a conversion event</div>
        <div className="input-row" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="purchase">purchase</option>
              <option value="signup">signup</option>
              <option value="subscription">subscription</option>
              <option value="add_to_cart">add_to_cart</option>
              <option value="trial_start">trial_start</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Value</label>
            <input type="number" value={value} onChange={(e) => setValue(+e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ minWidth: 0, width: 80 }}
            />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={handleTrack}>
            💰 Track Conversion
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <div className="card-title">Conversion history (session only, never persisted)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Currency</th>
              </tr>
            </thead>
            <tbody>
              {history.map((c, i) => (
                <tr key={i}>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
                      {c.type}
                    </code>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{c.value ?? '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{c.currency ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CodeBlock
        label="trackConversion — local-only revenue correlation"
        code={`<span class="kw">import</span> { <span class="fn">usePassiveIntent</span> } <span class="kw">from</span> <span class="str">'@passiveintent/react'</span>;

<span class="kw">const</span> { <span class="prop">on</span>, <span class="prop">trackConversion</span> } = <span class="fn">usePassiveIntent</span>();

<span class="fn">on</span>(<span class="str">'conversion'</span>, ({ <span class="prop">type</span>, <span class="prop">value</span>, <span class="prop">currency</span> }) => {
  <span class="cmt">// You decide — the engine never sends this anywhere</span>
  <span class="kw">if</span> (type === <span class="str">'purchase'</span>) analytics.<span class="fn">revenue</span>({ value, currency });
});

<span class="fn">trackConversion</span>({ type: <span class="str">'purchase'</span>, value: <span class="num">49.99</span>, currency: <span class="str">'USD'</span> });`}
      />
    </>
  );
}
