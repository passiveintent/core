# Changelog

All notable changes to this project will be documented in this file.

---

## 1.0.0 – Initial Release

### Features

- **Local-first inference** — no network calls required; the entire intent model runs inside the user's browser.
- **SSR-safe runtime** — browser globals (`window`, `localStorage`) are accessed only through swappable adapter interfaces, keeping the SDK safe in Node.js, Deno, Bun, and Edge Worker environments.
- **Bounded growth** — LFU-style graph pruning evicts the least-frequently-used states when `maxStates` is exceeded, preventing unbounded memory growth.
- **Efficient persistence** — binary graph encoding (`toBinary` / `fromBinary`) paired with a dirty-flag optimization eliminates redundant `localStorage` writes when no navigation has occurred since the last persist cycle.
- **Bot-resilient signals** — `EntropyGuard` tracks the last 10 `track()` call timestamps in a fixed circular buffer and suppresses entropy and trajectory events for sessions exhibiting impossibly-fast or robotic timing patterns.
- **Dwell-time anomaly detection** — per-state dwell time is tracked using Welford's online algorithm; a `dwell_time_anomaly` event fires when the z-score exceeds the configured threshold.
- **Selective bigram Markov transitions** — optional second-order transition learning (`A→B→C`) is frequency-gated: bigram edges are only recorded once the unigram from-state crosses `bigramFrequencyThreshold` (default: 5), preventing state explosion.
- **Event cooldown** — configurable `eventCooldownMs` suppresses repeated emissions of the same event type within a rolling window, protecting downstream consumers from event flooding.
- **Cross-tab synchronization** — `BroadcastSync` uses the `BroadcastChannel` API to propagate `track()` deltas and deterministic counter increments across tabs, with input-length validation to prevent heap-amplification attacks from compromised tabs.
- **Clean teardown** — `destroy()` flushes pending state, cancels all timers, and removes all event listeners; designed for SPA lifecycle hooks (`useEffect` teardown, `onUnmounted`, `ngOnDestroy`).
- **Route state normalizer** — `normalizeRouteState()` strips UUIDs, MongoDB ObjectIDs, and numeric path segments from URLs, collapsing dynamic routes to stable canonical keys.
