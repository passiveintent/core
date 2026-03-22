<!--
  Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>

  This source code is licensed under the AGPL-3.0-only license found in the
  LICENSE file in the root directory of this source tree.
-->

# Changelog

All notable changes to `@passiveintent/core` will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.1] - 2026-03-23

### Added

- **`plugins` config field** (`IntentManagerConfig.plugins?: EnginePolicy[]`) — allows external wrappers and host applications to inject custom `EnginePolicy` implementations into the `trackStages` pipeline without modifying core source code. Injected plugins are appended after all built-in policies (Drift, Dwell, Bigram, CrossTab), preserving deterministic execution order. Plugins within the array run in the order they are provided.
- **Plugin isolation boundary** — every hook call into an external plugin (`onTrackStart`, `onTrackContext`, `onTransition`, `onAfterEvaluation`, `onCounterIncrement`, `destroy`) is wrapped in a `try/catch`. A throwing plugin is silently isolated: `track()` completes normally, the error is forwarded to `onError` with `code: 'VALIDATION'` and a message identifying the plugin index, and execution continues with the next plugin. If no `onError` is configured the throw is discarded without propagating to the caller.

### Notes

- Fully backwards-compatible. Omitting `plugins` (or setting `plugins: []`) produces identical behaviour to `1.1.0`.
- Built-in policies are never affected by the isolation boundary — they run unwrapped at their original performance characteristics.
