import React, { lazy, Suspense, useMemo, useState } from 'react';
import {
  PassiveIntentProvider,
  MemoryStorageAdapter,
  IntentErrorBoundary,
} from '@passiveintent/react';
import { LogProvider } from './LogContext';
import { ToastProvider } from './components/Toast';
import { SimGuardProvider } from './hooks/useSimGuard';
import { timerAdapter, lifecycleAdapter } from './adapters';
import { ECOMMERCE_BASELINE } from './baseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import Shell from './Shell';

const Overview = lazy(() => import('./pages/Overview'));
const BasicTracking = lazy(() => import('./pages/BasicTracking'));
const HighEntropy = lazy(() => import('./pages/HighEntropy'));
const DwellTime = lazy(() => import('./pages/DwellTime'));
const Trajectory = lazy(() => import('./pages/Trajectory'));
const Hesitation = lazy(() => import('./pages/Hesitation'));
const AttentionReturn = lazy(() => import('./pages/AttentionReturn'));
const IdleDetection = lazy(() => import('./pages/IdleDetection'));
const ExitIntent = lazy(() => import('./pages/ExitIntent'));
const BloomFilterPage = lazy(() => import('./pages/BloomFilter'));
const MarkovPredictions = lazy(() => import('./pages/MarkovPredictions'));
const BotDetection = lazy(() => import('./pages/BotDetection'));
const Conversion = lazy(() => import('./pages/Conversion'));
const Counters = lazy(() => import('./pages/Counters'));
const AmazonPlayground = lazy(() => import('./pages/AmazonPlayground'));
const ShowcaseFintech = lazy(() => import('./pages/ShowcaseFintech'));
const ShowcaseHealthcare = lazy(() => import('./pages/ShowcaseHealthcare'));
const ShowcaseChurn = lazy(() => import('./pages/ShowcaseChurn'));
const BYOBaseline = lazy(() => import('./pages/BYOBaseline'));
const CrossTabSync = lazy(() => import('./pages/CrossTabSync'));
const PropensityScore = lazy(() => import('./pages/PropensityScore'));

export type DemoKey =
  | 'overview'
  | 'basic-tracking'
  | 'showcase-ecommerce'
  | 'showcase-fintech'
  | 'showcase-healthcare'
  | 'showcase-churn'
  | 'high-entropy'
  | 'dwell-time'
  | 'trajectory'
  | 'hesitation'
  | 'attention-return'
  | 'idle-detection'
  | 'exit-intent'
  | 'bloom-filter'
  | 'markov-graph'
  | 'bot-detection'
  | 'conversion'
  | 'counters'
  | 'propensity-score'
  | 'byob'
  | 'cross-tab';

const PAGE_MAP: Record<DemoKey, React.ComponentType> = {
  overview: Overview,
  'basic-tracking': BasicTracking,
  'showcase-ecommerce': AmazonPlayground,
  'showcase-fintech': ShowcaseFintech,
  'showcase-healthcare': ShowcaseHealthcare,
  'showcase-churn': ShowcaseChurn,
  'high-entropy': HighEntropy,
  'dwell-time': DwellTime,
  trajectory: Trajectory,
  hesitation: Hesitation,
  'attention-return': AttentionReturn,
  'idle-detection': IdleDetection,
  'exit-intent': ExitIntent,
  'bloom-filter': BloomFilterPage,
  'markov-graph': MarkovPredictions,
  'bot-detection': BotDetection,
  conversion: Conversion,
  counters: Counters,
  'propensity-score': PropensityScore,
  byob: BYOBaseline,
  'cross-tab': CrossTabSync,
};

export default function App() {
  const [active, setActive] = useState<DemoKey>('overview');
  const [sessionKey, setSessionKey] = useState(0);
  const ActivePage = PAGE_MAP[active];
  const memStorage = useMemo(() => new MemoryStorageAdapter(), [sessionKey]);

  return (
    <IntentErrorBoundary
      fallback={(err, reset) => (
        <div className="alert alert-error engine-error-boundary">
          <strong>[PassiveIntent] Engine failed to initialise</strong>
          <pre className="engine-error-message">{err.message}</pre>
          <button type="button" onClick={reset}>
            Retry
          </button>
        </div>
      )}
    >
      <PassiveIntentProvider
        key={sessionKey}
        config={{
          storageKey: 'pi-react-demo',
          botProtection: true,
          crossTabSync: false,
          enableBigrams: true,
          persistThrottleMs: 200,
          baseline: ECOMMERCE_BASELINE,
          baselineMeanLL: -1.4,
          baselineStdLL: 0.35,
          graph: {
            highEntropyThreshold: 0.72,
            divergenceThreshold: 2.5,
            maxStates: 500,
            smoothingAlpha: 0.1,
          },
          dwellTime: { enabled: true, minSamples: 3, zScoreThreshold: 2.0 },
        }}
        adapters={{ storage: memStorage, timer: timerAdapter, lifecycle: lifecycleAdapter }}
        onError={(err) => console.error('[PassiveIntent] Engine error:', err)}
      >
        <LogProvider>
          <ToastProvider>
            <SimGuardProvider>
              <Shell
                active={active}
                onNavigate={setActive}
                onReset={() => setSessionKey((k) => k + 1)}
              >
                <ErrorBoundary key={active}>
                  <Suspense fallback={<div className="page-loading">Loading…</div>}>
                    <ActivePage />
                  </Suspense>
                </ErrorBoundary>
              </Shell>
            </SimGuardProvider>
          </ToastProvider>
        </LogProvider>
      </PassiveIntentProvider>
    </IntentErrorBoundary>
  );
}
