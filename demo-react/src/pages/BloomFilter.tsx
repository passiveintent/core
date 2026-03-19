/**
 * Bloom Filter — hasSeen() membership test + standalone BloomFilter class.
 *
 * React pattern: controlled input + local state for the standalone filter demo.
 */
import React, { useCallback, useState } from 'react';
import {
  BloomFilter,
  computeBloomConfig,
  usePassiveIntent,
  useBloomFilter,
} from '@passiveintent/react';
import CodeBlock from '../components/CodeBlock';
import PageHeader from '../components/PageHeader';

export default function BloomFilterPage() {
  const { hasSeen } = usePassiveIntent();

  // hasSeen() panel
  const [checkInput, setCheckInput] = useState('/checkout/payment');
  const [checkResult, setCheckResult] = useState<boolean | null>(null);

  // Standalone BloomFilter panel
  const { add, check, estimatedFPR, bits } = useBloomFilter({ bitSize: 512, hashCount: 4 });
  const [bfInput, setBfInput] = useState('user@example.com');
  const [bfResult, setBfResult] = useState<string | null>(null);

  // computeBloomConfig panel
  const [cfgItems, setCfgItems] = useState(1000);
  const [cfgFpr, setCfgFpr] = useState(0.01);
  const [cfgResult, setCfgResult] = useState<{
    bitSize: number;
    hashCount: number;
    estimatedFpRate: number;
  } | null>(null);

  const handleCheck = useCallback(() => {
    setCheckResult(hasSeen(checkInput.trim()));
  }, [hasSeen, checkInput]);

  const handleAdd = useCallback(() => {
    add(bfInput);
    setBfResult(`Added "${bfInput}".`);
  }, [add, bfInput]);

  const handleTest = useCallback(() => {
    const r = check(bfInput);
    setBfResult(`"${bfInput}" → ${r ? '✓ Probably in set' : '✗ Definitely not in set'}`);
  }, [check, bfInput]);

  const handleComputeCfg = useCallback(() => {
    setCfgResult(computeBloomConfig(cfgItems, cfgFpr));
  }, [cfgItems, cfgFpr]);

  return (
    <>
      <PageHeader
        hook="⚛️ hasSeen() + useBloomFilter()"
        title="Bloom Filter API"
        description={
          <>
            <strong>hasSeen(route)</strong> is an O(k) membership test on the engine's internal
            Bloom filter — useful to check if a user has ever visited a page without storing a list.
            Use <strong>useBloomFilter()</strong> standalone for your own deduplication needs, and{' '}
            <strong>computeBloomConfig()</strong> to size it optimally.
          </>
        }
      />

      <div className="two-col">
        <div className="card">
          <div className="card-title">intent.hasSeen() — O(k) lookup</div>
          <div className="input-row">
            <input
              type="text"
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
            <button className="btn btn-primary" onClick={handleCheck}>
              Check
            </button>
          </div>
          {checkResult !== null && (
            <div
              className={`alert alert-${checkResult ? 'warning' : 'info'}`}
              style={{ marginTop: 10 }}
            >
              <code style={{ fontFamily: 'var(--font-mono)' }}>{checkInput}</code> →{' '}
              <strong>{checkResult ? '✓ Probably seen' : '✗ Definitely not seen'}</strong>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Standalone BloomFilter</div>
          <div className="input-row">
            <input type="text" value={bfInput} onChange={(e) => setBfInput(e.target.value)} />
            <button className="btn btn-secondary" onClick={handleAdd}>
              Add
            </button>
            <button className="btn btn-primary" onClick={handleTest}>
              Test
            </button>
          </div>
          {bfResult === null && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              The input is pre-filled — press <strong style={{ color: 'var(--text)' }}>Add</strong>{' '}
              to insert it, then <strong style={{ color: 'var(--text)' }}>Test</strong> to check
              membership. Watch the bits light up below.
            </p>
          )}
          {bfResult && (
            <div className="alert alert-info" style={{ marginTop: 10 }}>
              {bfResult} Estimated FPR: {(estimatedFPR * 100).toFixed(3)}%
            </div>
          )}
          <div className="bit-viz" style={{ marginTop: 12 }}>
            {bits.slice(0, 256).map((on, i) => (
              <div key={i} className={`bit${on ? ' on' : ''}`} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            First 256 bits of the filter (lit = set)
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-title">computeBloomConfig() — optimal sizing</div>
        <div className="input-row">
          <label>Expected items:</label>
          <input type="number" value={cfgItems} onChange={(e) => setCfgItems(+e.target.value)} />
          <label>Target FPR:</label>
          <input
            type="number"
            value={cfgFpr}
            step={0.001}
            onChange={(e) => setCfgFpr(+e.target.value)}
            style={{ width: 80 }}
          />
          <button className="btn btn-secondary" onClick={handleComputeCfg}>
            Compute
          </button>
        </div>
        {cfgResult && (
          <div className="alert alert-success" style={{ marginTop: 10 }}>
            bitSize: <strong>{cfgResult.bitSize}</strong> (
            {(cfgResult.bitSize / 8 / 1024).toFixed(1)} KB)
            {' | '}hashCount: <strong>{cfgResult.hashCount}</strong>
            {' | '}actual FPR: <strong>{(cfgResult.estimatedFpRate * 100).toFixed(3)}%</strong>
          </div>
        )}
      </div>

      <CodeBlock
        label="BloomFilter API"
        code={`<span class="kw">import</span> { <span class="type">BloomFilter</span>, <span class="fn">computeBloomConfig</span>, <span class="fn">useBloomFilter</span> } <span class="kw">from</span> <span class="str">'@passiveintent/react'</span>;

<span class="cmt">// Reactive hook — owns the instance lifecycle</span>
<span class="kw">const</span> { <span class="prop">add</span>, <span class="prop">check</span>, <span class="prop">itemCount</span>, <span class="prop">estimatedFPR</span>, <span class="prop">bits</span> } = <span class="fn">useBloomFilter</span>({ bitSize: <span class="num">512</span>, hashCount: <span class="num">4</span> });

<span class="fn">add</span>(<span class="str">'user@example.com'</span>);
<span class="fn">check</span>(<span class="str">'user@example.com'</span>);  <span class="cmt">// true  — probably seen (no false negatives)</span>
<span class="fn">check</span>(<span class="str">'other@example.com'</span>); <span class="cmt">// false — definitely not seen</span>

<span class="cmt">// Via usePassiveIntent</span>
<span class="kw">const</span> { hasSeen } = <span class="fn">usePassiveIntent</span>(config);
hasSeen(<span class="str">'/checkout/payment'</span>); <span class="cmt">// O(k), no false negatives</span>`}
      />
    </>
  );
}
