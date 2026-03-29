<!--
  Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>

  This source code is licensed under the AGPL-3.0-only license found in the
  LICENSE file in the root directory of this source tree.
-->

# Changelog

All notable changes to `@passiveintent/core` will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - 2026-03-29

### Added

- **`namespace` option for `BrowserStorageAdapter`** — the constructor now accepts an optional `namespace` string prefix (`default: 'passiveintent:'`) prepended to every `localStorage` key. Prevents key collisions when multiple PassiveIntent instances share the same origin (micro-frontend architectures).

  ```ts
  // Each micro-frontend gets its own isolated key space
  new BrowserStorageAdapter('checkout-mfe:')
  new BrowserStorageAdapter('recommendations-mfe:')
  ```

- **`namespace` option for `LocalStorageAdapter`** — same isolation primitive on the `IntentEngine` (Layer 2) persistence adapter. Constructor: `new LocalStorageAdapter(namespace?)`. Defaults to `'passiveintent:'`. Pass `''` to disable prefixing entirely (not recommended when multiple instances share an origin).

- **`LocalStorageAdapter.delete(key)`** — new method on `IPersistenceAdapter` that removes a previously saved key from `localStorage`. Silently no-ops when `localStorage` is unavailable.

- **`namespace` field on `IntentManagerConfig`** — forwards a namespace prefix through `IntentManager` to `BrowserStorageAdapter`. Useful when constructing `IntentManager` directly rather than through adapters.

  ```ts
  new IntentManager({ storageKey: 'intent', namespace: 'checkout-mfe:' })
  // writes to localStorage key 'checkout-mfe:intent'
  ```

- **`namespace` field on `BrowserConfig`** — same forwarding for the `createBrowserIntent()` factory.

  ```ts
  createBrowserIntent({ storageKey: 'intent', namespace: 'checkout-mfe:' })
  ```

### Changed

- **Internal re-export refactor** — `intent-sdk.ts` (internal barrel) was removed. All exports now resolve directly to their canonical source modules (`./engine/intent-manager.js`, `./core/bloom.js`, etc.). No public API change — all previously exported names remain available from `@passiveintent/core`.

---

## [1.2.2] - 2026-03-26

### Fixed

- **Fixed declaration artifact glob** — `files` in `package.json` was `dist/*.d.ts` (top-level only), causing all subdirectory declaration files (`dist/types/`, `dist/engine/`, etc.) to be excluded from the published package. Changed to `dist/**/*.d.ts` so the full declaration tree ships and `CoreInterfaces` resolves correctly for consumers.

---

## [1.2.1] - 2026-03-25

### Added

- **`CoreInterfaces.EnginePolicy` and `CoreInterfaces.PolicyTrackContext` now exported** — these plugin contracts were previously internal types not included in the published artifact. Enterprise packages building custom `IntentManager` plugins (injected via `IntentManagerConfig.plugins`) can now properly type their implementations without duplicating the interfaces or falling back to `any`.

  ```ts
  import type { CoreInterfaces } from '@passiveintent/core';

  class MyPlugin implements CoreInterfaces.EnginePolicy {
    onTrackContext(ctx: CoreInterfaces.PolicyTrackContext): void { ... }
  }
  ```

  Both types are re-exported through the existing `CoreInterfaces` namespace (sourced from `./engine/policies/engine-policy`). No runtime changes — type-only export.

---

## [1.2.0] - 2026-03-23

### Changed

- **`createBrowserIntent()` now returns `IntentManager`** — the factory previously returned `IntentEngine` (the microkernel with only `track`, `on`, `destroy`). It now returns the full `IntentManager` instance, giving vanilla-JS callers immediate access to the complete public API: `getTelemetry`, `predictNextStates`, `hasSeen`, `incrementCounter`, `getCounter`, `resetCounter`, `trackConversion`, `flushNow`, `exportGraph`, `resetSession`, `getPerformanceReport`, and more — with zero extra configuration.
  - The `BrowserConfig` type and all its fields (`storageKey`, `baseline`, `graph`, `bloom`, `stateNormalizer`, `onError`) are unchanged.
  - **Additive at runtime** — `IntentManager` is a strict superset of the old return type; all existing `engine.track()` / `engine.on()` / `engine.destroy()` call sites continue to work.
  - **TypeScript:** the return type widens from `IntentEngine` to `IntentManager`. Code with an explicit `: IntentEngine` annotation on the `createBrowserIntent()` result should remove the annotation or widen it to `IntentManager`.
  - **`MouseKinematicsAdapter` removed from the factory** — this adapter auto-tracked `popstate` / `hashchange` URL changes and emitted the initial page-load pathname via a deferred microtask on startup. `IntentManager` does not expose an `IInputAdapter` injection point, so both behaviors are gone. **Migration:** call `engine.track(window.location.pathname)` (or the equivalent in your framework) immediately after subscribing your `engine.on('state_change', …)` listeners to reproduce the initial-path emit that `createBrowserIntent()` previously provided automatically via `MouseKinematicsAdapter`. For ongoing SPA navigation use `useRouteTracker` from `@passiveintent/react`, or call `engine.track(pathname)` on each route change. History `pushState` was never intercepted by the adapter (by design), so the practical impact outside of the initial page-load emit is limited to `popstate`/`hashchange` navigation.

- **`BigramPolicy` separator changed from `→` (U+2192) to `\x00` (NUL)** — bigram state keys are encoded as `"prev\x00from"` → `"from\x00to"`. The previous arrow character, while visually readable, could theoretically appear in non-URL state labels supplied via custom `stateNormalizer`. NUL cannot appear in valid URL paths, making it a guaranteed collision-resistant separator.
  - **Impact:** bigram edge data in existing `localStorage` persisted graphs will not be recognised as bigrams after this update (keys use the old format). Unigram transitions are unaffected. The graph relearns bigrams from fresh navigation within one session.

### Fixed

- **`incrementCounter()` non-finite guard** — the previous implementation had two separate checks for `key === ''` and `!Number.isFinite(by)` that could both trigger an `onError` call on a single invalid invocation. The guard is now a single unified check (`typeof by !== 'number' || !Number.isFinite(by)`) that returns early before the key check, emitting at most one error per invalid call.

---

## [1.1.1] - 2026-03-23

### Added

- **`plugins` config field** (`IntentManagerConfig.plugins?: EnginePolicy[]`) — allows external wrappers and host applications to inject custom `EnginePolicy` implementations into the `trackStages` pipeline without modifying core source code. Injected plugins are appended after all built-in policies (Drift, Dwell, Bigram, CrossTab), preserving deterministic execution order. Plugins within the array run in the order they are provided.
- **Plugin isolation boundary** — every hook call into an external plugin (`onTrackStart`, `onTrackContext`, `onTransition`, `onAfterEvaluation`, `onCounterIncrement`, `destroy`) is wrapped in a `try/catch`. A throwing plugin is silently isolated: `track()` completes normally, the error is forwarded to `onError` with `code: 'VALIDATION'` and a message identifying the plugin index, and execution continues with the next plugin. If no `onError` is configured the throw is discarded without propagating to the caller.

### Notes

- Fully backwards-compatible. Omitting `plugins` (or setting `plugins: []`) produces identical behaviour to `1.1.0`.
- Built-in policies are never affected by the isolation boundary — they run unwrapped at their original performance characteristics.
