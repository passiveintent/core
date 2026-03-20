/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface PassiveIntentVanillaConfig {
  /** Whether to log debug output to the console. Default: false. */
  debug?: boolean;
  /**
   * Maximum number of Markov states to track.
   * Maps to IntentManagerConfig.maxStates. Default: 100.
   */
  maxStates?: number;
}

export interface PassiveIntentGlobal {
  /** Initialise the intent engine. Call once, typically in your tag/script. */
  init(config?: PassiveIntentVanillaConfig): void;
  /** Track a page/state transition. Call on each route change or virtual pageview. */
  track(state: string): void;
  /** Subscribe to an intent event. Returns an unsubscribe function. */
  on(event: string, handler: (payload: unknown) => void): () => void;
  /** Tear down the engine and release all listeners. */
  destroy(): void;
}
