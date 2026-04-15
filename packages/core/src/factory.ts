/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Progressive Disclosure layer — createBrowserIntent
 * --------------------------------------------------------
 * The 90 % use-case entry point for standard web applications.
 *
 * Returns a fully configured `IntentManager` with browser-standard adapters
 * (`BrowserStorageAdapter`, `BrowserTimerAdapter`, `BrowserLifecycleAdapter`)
 * wired in automatically.  Callers get the complete public API (`track`, `on`,
 * `getTelemetry`, `predictNextStates`, counters, etc.) with zero boilerplate.
 *
 * For custom platforms (React Native, Electron, food-delivery/dating domains),
 * use `new IntentEngine({…})` directly with injected adapter interfaces.
 *
 * ```ts
 * // Standard web — one line:
 * const intent = createBrowserIntent({ storageKey: 'my-app' });
 *
 * intent.on('high_entropy', ({ state }) => showHelpWidget(state));
 * intent.on('exit_intent',  ({ likelyNext }) => prefetch(likelyNext));
 *
 * // Manual route tracking (push-state SPAs):
 * intent.track('/checkout/review');
 *
 * // SPA teardown:
 * intent.destroy();
 * ```
 *
 * Architecture layers
 * -------------------
 *   Layer 1 — Core algorithms  : MarkovGraph, BloomFilter      (pure, no I/O)
 *   Layer 2 — Microkernel      : IntentEngine                  (adapter interfaces)
 *   Layer 3 — Web factory  ← YOU ARE HERE                      (progressive disclosure)
 *   Layer 4 — Framework SDKs   : usePassiveIntent (React hook)
 */

import { BrowserStorageAdapter } from './adapters.js';
import { IntentManager } from './engine/intent-manager.js';
import type { MarkovGraphConfig, BloomFilterConfig } from './types/events.js';
import type { SerializedMarkovGraph } from './core/markov.js';

/* ------------------------------------------------------------------ */
/*  BrowserConfig                                                       */
/* ------------------------------------------------------------------ */

/**
 * User-facing configuration for `createBrowserIntent`.
 *
 * All fields are optional — `createBrowserIntent({})` is a valid, fully-
 * operational call that uses sensible defaults for every setting.
 */
export interface BrowserConfig {
  /**
   * localStorage key used to persist the Bloom filter and Markov graph
   * across sessions.
   *
   * Use a unique key per application to avoid collisions when multiple
   * PassiveIntent instances share the same origin.
   *
   * Default: `'passive-intent-engine'`
   */
  storageKey?: string;

  /**
   * Namespace prefix applied to every localStorage key written by this instance.
   *
   * Essential when multiple micro-frontends share the same origin.  Each
   * instance must receive a unique namespace so their persisted graphs never
   * collide.  The full key becomes `"${namespace}${storageKey}"`.
   *
   * Default: `'passiveintent:'`
   */
  namespace?: string;

  /**
   * Pre-trained baseline graph exported from a previous session via
   * `IntentManager.exportGraph()` or `MarkovGraph.toJSON()`.
   *
   * Required for `trajectory_anomaly` detection.  Without a baseline,
   * the engine emits `high_entropy` and `exit_intent` events but silently
   * skips trajectory z-score comparisons.
   */
  baseline?: SerializedMarkovGraph;

  /**
   * Markov graph tuning parameters.  Omit to accept production-tested defaults:
   *   - `highEntropyThreshold`: 0.75 (normalized entropy above which `high_entropy` fires)
   *   - `divergenceThreshold`:  3.5  (z-score magnitude for `trajectory_anomaly`)
   *   - `smoothingAlpha`:       0.1  (Dirichlet regularization — prevents cold-start spikes)
   *   - `maxStates`:            500  (LFU eviction cap)
   */
  graph?: MarkovGraphConfig;

  /**
   * Bloom filter sizing.  Omit to accept defaults (`bitSize: 2048, hashCount: 4`).
   * Use `BloomFilter.computeOptimal(expectedRoutes, targetFPR)` to size precisely.
   */
  bloom?: BloomFilterConfig;

  /**
   * Optional custom state normalizer applied **after** the built-in
   * `normalizeRouteState()` (which strips query strings, hashes, trailing
   * slashes, UUIDs, and numeric IDs ≥ 4 digits).
   *
   * Use this to collapse dynamic slugs the built-in normalizer misses:
   * ```ts
   * stateNormalizer: (s) => s.replace(/^\/blog\/[^/]+$/, '/blog/:slug')
   * ```
   * Returning an empty string silently drops that `track()` call.
   */
  stateNormalizer?: (state: string) => string;

  /**
   * Non-fatal error callback.  The engine never throws — storage errors,
   * quota exhaustion, parse failures, and invalid API calls are all routed
   * here so the host app can log or alert without a try/catch at every call
   * site.
   *
   * ```ts
   * onError: ({ code, message }) => Sentry.captureMessage(message, { tags: { code } })
   * ```
   */
  onError?: (error: { code: string; message: string }) => void;
}

/* ------------------------------------------------------------------ */
/*  Factory                                                             */
/* ------------------------------------------------------------------ */

/**
 * Create a fully configured `IntentManager` for standard browser environments.
 *
 * Uses built-in browser adapters (`BrowserStorageAdapter`, `BrowserTimerAdapter`,
 * `BrowserLifecycleAdapter`) — all SSR-safe and no-op when browser globals are absent.
 *
 * This factory intentionally wires `BrowserStorageAdapter`, so persisted graph
 * data is written to browser `localStorage` when browser globals are available.
 * If your deployment needs consent gating, ePrivacy review, or a managed
 * storage policy, put `createBrowserIntent()` behind your own compliance flow
 * or construct `IntentManager` directly with an explicit adapter strategy.
 * PassiveIntent itself remains zero-egress and does not receive the data.
 *
 * @param config  Optional tuning parameters.  Every field has a sensible default.
 * @returns       A live `IntentManager` instance, ready to receive `on()` subscriptions
 *                and `track()` calls.  Call `destroy()` in SPA teardown paths.
 *
 * @example Minimal setup
 * ```ts
 * const intent = createBrowserIntent();
 * intent.on('high_entropy', ({ state, normalizedEntropy }) => {
 *   console.log('Confused navigation detected:', state, normalizedEntropy);
 * });
 * ```
 *
 * @example With baseline for trajectory anomaly detection
 * ```ts
 * const intent = createBrowserIntent({
 *   storageKey: 'acme-shop',
 *   baseline:   importedBaselineGraph,
 *   onError:    ({ code, message }) => logger.warn(code, message),
 * });
 * ```
 */
export function createBrowserIntent(config: BrowserConfig = {}): IntentManager {
  return new IntentManager({
    storageKey: config.storageKey ?? 'passive-intent-engine',
    storage: new BrowserStorageAdapter(config.namespace),
    namespace: config.namespace,
    baseline: config.baseline,
    graph: config.graph,
    bloom: config.bloom,
    stateNormalizer: config.stateNormalizer,
    onError: config.onError,
  });
}
