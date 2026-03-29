# `@passiveintent/react`

> React 18 & 19 wrapper for [`@passiveintent/core`](../core/README.md) with provider-based sharing, standalone engine mode, reactive intent hooks, and React-friendly wrappers around the core data structures.

[![Open React demo in StackBlitz](https://img.shields.io/badge/StackBlitz-React-1389FD?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/passiveintent/core/tree/main/demo-react)

---

## Installation

```bash
npm install @passiveintent/react @passiveintent/core
# peer deps
npm install react react-dom
```

`@passiveintent/react@1.1.x` expects `@passiveintent/core@^1.1.0`.

---

## What 1.1 Adds

- `PassiveIntentProvider` for a single shared `IntentManager` across your tree
- `usePassiveIntent()` context mode alongside the existing standalone `usePassiveIntent(config)`
- Reactive provider hooks for exit intent, idle/resume, attention return, propensity, predictive prefetching, and event logs
- Standalone `useBloomFilter()` and `useMarkovGraph()` hooks for visualizations and custom tooling
- Re-exports of the core types, classes, and helpers commonly needed in React apps

---

## Quick Start

### Recommended: shared engine with `PassiveIntentProvider`

```tsx
'use client';

import {
  PassiveIntentProvider,
  usePassiveIntent,
  useExitIntent,
  usePredictiveLink,
} from '@passiveintent/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function IntentTracker() {
  const pathname = usePathname();
  const { track, on, getTelemetry } = usePassiveIntent();
  const { triggered, likelyNext, dismiss } = useExitIntent();

  usePredictiveLink({
    threshold: 0.35,
    sanitize: (state) => !state.startsWith('/admin'),
  });

  useEffect(() => {
    track(pathname);
  }, [pathname, track]);

  useEffect(() => {
    return on('high_entropy', () => {
      console.log('[PassiveIntent] telemetry', getTelemetry());
    });
  }, [on, getTelemetry]);

  if (!triggered) return null;

  return (
    <aside>
      <p>Still deciding?</p>
      <p>Most likely next step: {likelyNext ?? 'unknown'}</p>
      <button onClick={dismiss}>Close</button>
    </aside>
  );
}

export function App() {
  return (
    <PassiveIntentProvider
      config={{
        storageKey: 'my-app-intent',
        botProtection: true,
        eventCooldownMs: 60_000,
      }}
    >
      <IntentTracker />
    </PassiveIntentProvider>
  );
}
```

### Standalone mode

Use this when a component should own its own isolated engine instance.

```tsx
import { usePassiveIntent } from '@passiveintent/react';
import { useEffect } from 'react';

export function WidgetTracker({ route }: { route: string }) {
  const { track, getTelemetry } = usePassiveIntent({
    storageKey: 'embedded-widget',
    crossTabSync: false,
  });

  useEffect(() => {
    track(route);
  }, [route, track]);

  return <pre>{JSON.stringify(getTelemetry(), null, 2)}</pre>;
}
```

---

## Core API

### `PassiveIntentProvider`

Place this near your app root when multiple components should share one engine.

| Prop       | Type                               | Notes                                                                                                                                                                                                                                               |
| ---------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`   | `IntentManagerConfig`              | Required. Captured on first render; remount to apply changes.                                                                                                                                                                                       |
| `adapters` | `{ storage?, timer?, lifecycle? }` | Optional adapter overrides merged into `config`. `lifecycle` maps to core `lifecycleAdapter`.                                                                                                                                                       |
| `onError`  | `(error: Error) => void`           | Optional. Called when `IntentManager` construction throws. When provided, the error is swallowed and all hooks return safe zero-value snapshots. When omitted, the error propagates to the nearest `<IntentErrorBoundary>` or React error boundary. |
| `children` | `ReactNode`                        | Descendant components can call `usePassiveIntent()` with no arguments.                                                                                                                                                                              |

### `IntentErrorBoundary`

Wrap `PassiveIntentProvider` to catch errors thrown by the `IntentManager` constructor (invalid config, restricted storage, etc.) and prevent them from crashing the whole tree.

```tsx
import { IntentErrorBoundary, PassiveIntentProvider } from '@passiveintent/react';

<IntentErrorBoundary
  fallback={(err, reset) => (
    <div>Analytics unavailable. <button onClick={reset}>Retry</button></div>
  )}
>
  <PassiveIntentProvider config={...}>
    <App />
  </PassiveIntentProvider>
</IntentErrorBoundary>
```

| Prop       | Type                                             | Notes                                                                                                                                     |
| ---------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `fallback` | `(error: Error, reset: () => void) => ReactNode` | Optional. Custom error UI. `reset()` clears the error state and remounts children. Defaults to an accessible alert with a "Retry" button. |
| `children` | `ReactNode`                                      | —                                                                                                                                         |

> **`onError` vs `IntentErrorBoundary`:** Use `onError` to log errors and keep the tree alive (hooks silently no-op). Use `IntentErrorBoundary` to render fallback UI. You can combine both.

### `usePassiveIntent`

Two overloads:

```ts
usePassiveIntent(): UsePassiveIntentReturn
usePassiveIntent(config: IntentManagerConfig): UsePassiveIntentReturn
```

- `usePassiveIntent()` reads the nearest `PassiveIntentProvider` and throws if none exists.
- `usePassiveIntent(config)` creates a component-scoped `IntentManager`.
- Both modes are SSR-safe and Strict Mode safe.
- Config is captured on first render in both modes; remount to apply a new config.

All returned methods are stable across re-renders.

| Method              | Signature                                                             | Notes                                                              |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `track`             | `(state: string) => void`                                             | Records a page view or custom state transition.                    |
| `on`                | `(event, listener) => () => void`                                     | Typed subscription API. Returns a no-op unsubscribe during SSR.    |
| `getTelemetry`      | `() => PassiveIntentTelemetry`                                        | Returns a fully shaped zero-value object until the engine is live. |
| `predictNextStates` | `(threshold?, sanitize?) => { state: string; probability: number }[]` | Sorted Markov predictions.                                         |
| `hasSeen`           | `(state: string) => boolean`                                          | Bloom filter membership test.                                      |
| `incrementCounter`  | `(key: string, by?: number) => number`                                | Exact session counter increment.                                   |
| `getCounter`        | `(key: string) => number`                                             | Reads a session counter.                                           |
| `resetCounter`      | `(key: string) => void`                                               | Resets a session counter.                                          |

---

## Provider Hooks

All hooks in this section require a `PassiveIntentProvider` ancestor.

| Hook                                                 | Returns                                                | Purpose                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `useRouteTracker(pathname)`                          | `void`                                                 | Syncs the current route into the engine on every pathname change. Drop into your root layout for push-state SPAs.         |
| `useExitIntent(select?)`                             | `{ triggered, state, likelyNext, dismiss, isPending }` | Reacts to `exit_intent`. `dismiss()` is deferred via `useTransition`; `isPending` is `true` while the reset is in-flight. |
| `useIdle(select?)`                                   | `{ isIdle, idleMs, isPending }`                        | Tracks `user_idle` and `user_resumed`. `isPending` included for interface consistency.                                    |
| `useAttentionReturn(select?)`                        | `{ returned, hiddenDuration, dismiss, isPending }`     | Reacts when a user returns after triggering `attention_return`. `dismiss()` is deferred.                                  |
| `useSignals()`                                       | `{ exitIntent, idle, attentionReturn }`                | Convenience composition of the three signal hooks above.                                                                  |
| `usePropensity(targetState, options?, select?)`      | `number`                                               | Single-hop conversion score with dwell-time friction.                                                                     |
| `usePropensityScore(targetState, options?, select?)` | `number`                                               | **Deprecated.** Use `usePropensity` instead — identical signature, safer under concurrent rendering. See migration note below. |
| `usePredictiveLink(options?)`                        | `{ predictions }`                                      | Reads `predictNextStates()` on navigation and can inject `<link rel="prefetch">` tags.                                    |
| `useEventLog(events, options?)`                      | `{ log, clear }`                                       | Bounded reverse-chronological log of selected engine events.                                                              |

### `useRouteTracker`

For push-state SPAs (Next.js App Router, React Router v6, Remix) where `history.pushState` is not intercepted automatically, drop `useRouteTracker` into your root layout:

```tsx
// Next.js App Router — app/layout.tsx
'use client';
import { usePathname } from 'next/navigation';
import { PassiveIntentProvider, useRouteTracker } from '@passiveintent/react';

function RouteSync() {
  useRouteTracker(usePathname());
  return null;
}

export default function RootLayout({ children }) {
  return (
    <PassiveIntentProvider config={{ storageKey: 'my-app' }}>
      <RouteSync />
      {children}
    </PassiveIntentProvider>
  );
}
```

```tsx
// React Router v6
import { useLocation } from 'react-router-dom';
import { useRouteTracker } from '@passiveintent/react';

function RouteSync() {
  useRouteTracker(useLocation().pathname);
  return null;
}
```

The optional `select` parameter subscribes to only a slice of the return value — the component re-renders only when the selector's output changes (via `Object.is`):

```ts
// Re-renders only when triggered flips, not on every dismiss/isPending change
const triggered = useExitIntent((d) => d.triggered);

// Re-renders only when the propensity tier changes, not on every float update
const tier = usePropensity('/checkout', undefined, (s) =>
  s > 0.7 ? 'high' : s > 0.4 ? 'medium' : 'low',
);
```

### Hook defaults

| Hook                   | Default options                      |
| ---------------------- | ------------------------------------ |
| `usePropensity()`      | `alpha = 0.2`                        |
| `usePropensityScore()` | `alpha = 0.2` _(deprecated)_        |
| `usePredictiveLink()`  | `threshold = 0.3`, `prefetch = true` |
| `useEventLog()`        | `maxEntries = 100`                   |

### Migrating from `usePropensityScore` to `usePropensity`

`usePropensityScore` is deprecated. `usePropensity` is a drop-in replacement with an identical call signature:

```ts
// Before
const score = usePropensityScore('/checkout', { alpha: 0.3 });
const tier  = usePropensityScore('/checkout', undefined, (s) => s > 0.7 ? 'high' : 'low');

// After
const score = usePropensity('/checkout', { alpha: 0.3 });
const tier  = usePropensity('/checkout', undefined, (s) => s > 0.7 ? 'high' : 'low');
```

The difference is internal: `usePropensity` computes the score inside the event handler and caches it in a ref, so `getSnapshot` is a cheap ref read. `usePropensityScore` calls `predictNextStates()` inside `getSnapshot` itself — React may invoke `getSnapshot` many times per render in concurrent mode, which technically violates the external-store contract if the engine advances between calls. Both work correctly in practice; `usePropensity` is the stricter implementation.

---

## Standalone Data-Structure Hooks

These hooks do not require a provider.

| Hook                      | Returns                                                                                                     | Purpose                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `useBloomFilter(config?)` | `{ add, check, itemCount, estimatedFPR, bits, toBase64 }`                                                   | React wrapper around core `BloomFilter` for visualizers, tooling, and custom seen-state workflows. |
| `useMarkovGraph(config?)` | `{ record, getProbability, getLikelyNextStates, entropyForState, stateCount, edgeCount, snapshot, toJSON }` | React wrapper around core `MarkovGraph` for graph explorers, dashboards, and experiments.          |

Both hooks create their underlying core instances synchronously on first render and keep derived visualization state reactive.

---

## Re-exports

The package also re-exports the core items most React consumers need:

- Classes: `IntentManager`, `PropensityCalculator`, `BloomFilter`, `MarkovGraph`
- Helpers: `computeBloomConfig`, `MemoryStorageAdapter`
- Config and telemetry types: `IntentManagerConfig`, `PassiveIntentTelemetry`, `BloomFilterConfig`, `MarkovGraphConfig`, `SerializedMarkovGraph`
- Event types: `IntentEventName`, `IntentEventMap`, and the exported payload types from `@passiveintent/core`
- Adapter interfaces: `TimerAdapter`, `LifecycleAdapter`, `StorageAdapter`

---

## SSR & Framework Compatibility

`@passiveintent/react` works out of the box in **Next.js (App Router + Pages Router)**, **Vite SPAs**, and **Create React App** without any extra configuration.

### What's built in

- No browser API (`window`, `document`, `localStorage`, etc.) is accessed at module evaluation time.
- All engine creation is gated behind `IS_BROWSER = typeof window !== 'undefined'`.
- Every hook returns safe zero-value defaults before the engine is live (during SSR or before hydration).
- All three entry-point files (`index.ts`, `provider.tsx`, `hooks.ts`) carry a `'use client'` directive so **Next.js App Router** automatically treats any import from `@passiveintent/react` as a client module — no wrapper file required.

> **Server Components:** Because every file in this package carries `'use client'`, you **cannot** import `@passiveintent/react` directly from a React Server Component — doing so will throw a build-time error in Next.js App Router and Remix. Use it only inside Client Components (`'use client'` boundary). For Remix, use [`@passiveintent/remix`](../remix/README.md) which provides `ClientOnly`, `withPassiveIntent`, and `createIntentClientLoader` helpers designed for Remix's SSR/hydration model.

### Next.js App Router

Because the `'use client'` directive is already inside the library, you can import directly from a Client Component:

```tsx
// app/components/IntentTracker.tsx
'use client'; // your own boundary — or omit if this file is already client-side
import { usePassiveIntent } from '@passiveintent/react';
```

Or place `PassiveIntentProvider` in a dedicated providers file:

```tsx
// app/providers.tsx
'use client';
import { PassiveIntentProvider } from '@passiveintent/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PassiveIntentProvider config={{ storageKey: 'my-app' }}>{children}</PassiveIntentProvider>
  );
}
```

```tsx
// app/layout.tsx  (Server Component — no 'use client' needed here)
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Server Components and re-exports

`@passiveintent/react` re-exports `IntentManager`, `MarkovGraph`, `BloomFilter`, and related helpers from `@passiveintent/core`. Because `@passiveintent/react` is a `'use client'` module, these re-exports are also part of the client bundle. **If you need any of these classes in a React Server Component, import directly from `@passiveintent/core` instead:**

```ts
// ✅ Safe in Server Components
import { IntentManager, MarkovGraph } from '@passiveintent/core';

// ❌ Not usable in Server Components (triggers the 'use client' boundary)
import { IntentManager } from '@passiveintent/react';
```

### Next.js Pages Router and Vite / CRA

No special setup needed. The `'use client'` directive is a plain string expression that non-RSC bundlers treat as a no-op. The `IS_BROWSER` guards prevent any engine creation during `getServerSideProps` or `getStaticProps` runs.

---

## Runtime Guarantees

- **Concurrent-safe subscriptions**: provider hooks use `useSyncExternalStore`, so snapshots stay consistent in React 18 concurrent rendering.
- **Strict Mode safe**: provider and standalone engine creation use idempotent guards and explicit cleanup.
- **SSR safe**: no browser API is touched at module load time; engine creation is gated by `IS_BROWSER`; `'use client'` directives mark the RSC boundary automatically.
- **Stable references**: returned callbacks and provider context values are memoized for predictable dependency arrays.
- **No silent subscription loss**: provider and standalone engine instances are created before child effects run, so descendant hooks can subscribe immediately.

---

## React 18 & 19 Design Notes

The wrapper uses React concurrent primitives only where they solve a concrete problem:

| Primitive              | Where it is used                                                                                                            | Why                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `useSyncExternalStore` | `useExitIntent`, `useIdle`, `useAttentionReturn`, `usePropensity`, `usePropensityScore`, `usePredictiveLink`, `useEventLog` | Eliminates tearing in Concurrent Mode and keeps subscriptions aligned with React's external-store contract. |
| `useTransition`        | `dismiss()` in `useExitIntent` and `useAttentionReturn`                                                                     | Defers the reset update so callers can show a loading indicator via `isPending` while the UI closes.        |
| `startTransition`      | Deferred Bloom filter bit decoding, Markov graph snapshot serialization                                                     | Pushes heavier visualization work off the urgent render path.                                               |
| `useRef`               | Engine instance storage, hook snapshots, option refs, `notifyRef` for dismiss flows                                         | Holds mutable engine state without forcing re-renders.                                                      |
| `useCallback`          | All `usePassiveIntent` methods and stable hook callbacks                                                                    | Safe to use in dependency arrays without churn or effect loops.                                             |
| `useMemo`              | Provider value and object-returning hooks                                                                                   | Prevents downstream re-renders when snapshots have not changed.                                             |
| `useReducer`           | Event log state and version counters in `useBloomFilter` / `useMarkovGraph`                                                 | Keeps reducer identity stable and updates explicit.                                                         |
| `useDebugValue`        | All domain hooks and `usePassiveIntent`                                                                                     | Gives formatted labels in React DevTools without changing runtime behavior.                                 |

This package avoids the older `useState` + `useEffect` subscription pattern for external stores. Event handlers write to refs and signal React; listener cleanup is always returned from the subscription boundary. The result is no stale-closure subscription flow and no leaked-listener bookkeeping in user code.

### Concurrency model

The `useSyncExternalStore` contract is followed directly:

- `subscribe` wires listeners, mutates refs in event handlers, and then calls `onStoreChange()`.
- `getSnapshot` returns a stable ref-backed snapshot, or computes directly from refs in `usePropensityScore()`.
- `getServerSnapshot` always returns safe SSR defaults such as `EXIT_INITIAL`, `IDLE_INITIAL`, `0`, or `[]`.

`usePropensity()` and `usePropensityScore()` use the same formula but differ in where the computation runs:

| Hook                             | Where the formula runs                                      | Tradeoff                                                                                                        |
| -------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `usePropensity()` ✓ recommended  | Event handlers write a precomputed score into `snapshotRef` | `getSnapshot` is a trivial ref read — always returns the same value within a render pass. Strictly correct.     |
| `usePropensityScore()` deprecated | `getSnapshot()` calls `predictNextStates()` on every read  | React may call `getSnapshot` multiple times per render; if the engine advances between calls, values could differ. Works in practice but is technically less correct under concurrent rendering. |

Prefer `usePropensity()` for all new code. `usePropensityScore()` is deprecated and will be removed in a future major version.

### Memory and SSR behavior

| Pattern                                                                   | Guarantee                                                                                          |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Render-phase instance init with `if (ref.current === null && IS_BROWSER)` | The engine exists before child effects subscribe, and creation stays idempotent under Strict Mode. |
| Cleanup-only `useEffect(() => () => destroy(), [])`                       | Timers and listeners are torn down on unmount.                                                     |
| Subscription cleanup returned from `subscribe`                            | Re-subscribe and unmount both cleanly release listeners.                                           |
| `notifyRef.current = null` during teardown                                | Imperative dismiss handlers become harmless after unmount.                                         |

SSR support is explicit:

- `IS_BROWSER = typeof window !== 'undefined'` guards all engine creation.
- Server snapshots and no-op callbacks keep hooks safe before hydration.
- `react-dom` is an optional peer dependency, so the wrapper can still be consumed in SSR-only or non-DOM React environments.

```ts
// Before hydration or outside the browser
track(state); // no-op
on(event, listener); // returns a no-op unsubscribe
getTelemetry(); // returns TELEMETRY_DEFAULT
predictNextStates(); // []
hasSeen(state); // false
```

---

## Why Use The Wrapper

Compared with wiring `@passiveintent/core` manually inside every component, the React wrapper removes repetitive lifecycle and subscription code:

| Concern              | Raw `@passiveintent/core`                           | With `@passiveintent/react`                                              |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Instance lifecycle   | Manual `new IntentManager()` + `destroy()` handling | `PassiveIntentProvider` or `usePassiveIntent(config)` manages it for you |
| Event subscriptions  | Manual `.on()` bookkeeping in effects               | Declarative hooks with automatic teardown                                |
| Concurrent rendering | Caller must avoid tearing manually                  | `useSyncExternalStore` handles external-store semantics                  |
| Re-render control    | Caller must memoize callbacks and objects           | Stable references are built in                                           |
| SSR                  | Caller adds `typeof window` guards                  | Safe defaults and browser-gated init are built in                        |
| Prefetching          | Manual DOM link injection                           | `usePredictiveLink()` injects and cleans up prefetch links               |
| Composition          | Caller combines multiple signals                    | `useSignals()` bundles the common signal hooks                           |

---

## Demo

The live example app in [`demo-react`](../../demo-react) runs on React 19 and exercises the provider flow, `IntentErrorBoundary`, `onError` logging, `isPending` dismiss indicators, event log, predictive prefetching, telemetry, and all signal hooks. It is the reference implementation for the design choices above: external-store subscriptions, stable callback identities, deferred visualization work, and SSR-safe engine wiring.
