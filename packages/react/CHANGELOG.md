# Changelog

All notable changes to `@passiveintent/react` will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] - 2026-03-20

### Added

- `IntentErrorBoundary` — a library-level React error boundary for wrapping `PassiveIntentProvider`. Catches errors thrown by the synchronous `IntentManager` constructor (e.g. invalid config, restricted storage origin) and prevents them from crashing the entire tree. Accepts an optional `fallback` render prop `(error, reset) => ReactNode`; defaults to an accessible `role="alert"` box with a Retry button.
- `onError` prop on `PassiveIntentProvider` — when provided, absorbs `IntentManager` constructor errors instead of propagating them to the nearest error boundary. All hooks return safe zero-value snapshots when the engine fails to initialise. When omitted, errors propagate normally and can be caught by `IntentErrorBoundary`.
- SSR safety test suite (`ssr-safety.test.ts`) covering zero-value defaults for all hooks when the engine is absent.
- `'use client'` directive on `PassiveIntentProvider` for compatibility with React Server Components.

### Changed

- `useExitIntent` now uses `useSyncExternalStoreWithSelector` (from `use-sync-external-store/with-selector`) instead of `useSyncExternalStore`, enabling selector-level memoization: re-renders are only scheduled when the projected value changes (via `Object.is`), reducing unnecessary renders for callers that project to primitives or stable refs.
- `useExitIntent`'s `isPending` flag is now managed via `useState` instead of `useTransition`. `useTransition`'s pending state does not reliably reflect updates driven by `useSyncExternalStore`'s `onStoreChange`; the new implementation sets the flag immediately before notifying and clears it in the next microtask.
- `PassiveIntentProvider` defers `onError` invocation to a post-commit effect, avoiding the React rule against side-effects during render. A `failedInitRef` guard prevents duplicate error reports and redundant re-initialisation when render-phase construction has already failed.
- Added `use-sync-external-store` as a direct runtime dependency (previously relied on the transitive copy from React internals).
- React peer dependency updated to `>=18.0.0` (React 19 officially supported).
- `@types/react` and `@types/react-dom` dev dependencies updated to `^19`.

---

## [1.1.0] - 2026-03-14

### Added

- `PassiveIntentProvider` for sharing a single `IntentManager` instance across a React subtree.
- Context-mode `usePassiveIntent()` so descendants can read the shared provider instance without passing config repeatedly.
- Provider-only reactive hooks built on top of the shared engine:
  - `useExitIntent()`
  - `useIdle()`
  - `useAttentionReturn()`
  - `useSignals()`
  - `usePropensity()`
  - `usePropensityScore()`
  - `usePredictiveLink()`
  - `useEventLog()`
- Standalone React wrappers for core data structures:
  - `useBloomFilter()`
  - `useMarkovGraph()`
- React package re-exports for the main core classes, helpers, event payload types, and adapter interfaces.
- Provider and hook-focused test coverage for context mode, lifecycle cleanup, and the new reactive hooks.

### Changed

- `usePassiveIntent` now supports two explicit modes:
  - `usePassiveIntent()` for provider context access
  - `usePassiveIntent(config)` for isolated component-scoped engines
- Engine creation in provider and standalone mode now happens synchronously during render with an idempotent guard, preventing missed child subscriptions during initial effects.
- `getTelemetry()` now returns a fully typed zero-value telemetry object before the engine is live instead of an empty object cast.
- The React package now targets `@passiveintent/core@^1.1.0`.

### Notes

- Provider-based hooks throw a descriptive error when used outside `PassiveIntentProvider`.
- Reactive provider hooks use `useSyncExternalStore` for React 18 concurrent rendering safety.

---

## [1.0.0] - 2026-03-09

### Added

- Initial React wrapper with standalone `usePassiveIntent(config)`.
- Stable methods for `track`, `on`, `getTelemetry`, `predictNextStates`, `hasSeen`, and deterministic counters.
- SSR-safe and Strict Mode-safe `IntentManager` lifecycle handling for React applications.
