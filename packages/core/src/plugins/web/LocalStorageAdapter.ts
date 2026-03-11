/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LocalStorageAdapter — web plugin for IPersistenceAdapter
 * --------------------------------------------------------
 * Implements IPersistenceAdapter on top of the browser's `window.localStorage`.
 *
 * Every access is guarded with `typeof window === 'undefined'` checks so the
 * module can be imported in SSR / Node.js / Web Worker environments without
 * throwing.  When `window.localStorage` is unavailable the adapter silently
 * degrades to a no-op (load returns `null`, save is skipped).
 *
 * Note: `localStorage` is synchronous.  For async backends (React Native
 * AsyncStorage, Capacitor Preferences, IndexedDB) use `IntentManager.createAsync()`
 * with an `AsyncStorageAdapter` — that path remains in Layer 3 (IntentManager).
 *
 * Usage:
 * ```ts
 * import { LocalStorageAdapter } from '@passiveintent/core/plugins/web';
 *
 * const engine = new IntentEngine({
 *   persistence: new LocalStorageAdapter(),
 *   // …
 * });
 * ```
 */

import type { IPersistenceAdapter } from '../../types/microkernel.js';

export class LocalStorageAdapter implements IPersistenceAdapter {
  /**
   * Load a value from localStorage.
   * Returns `null` when the key is absent, when localStorage is unavailable
   * (SSR, incognito with storage blocked, sandboxed iframe), or when a
   * `SecurityError` is thrown.
   */
  load(key: string): string | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      // SecurityError in sandboxed iframes / opaque origins.
      return null;
    }
  }

  /**
   * Save a value to localStorage.
   * Silently no-ops when localStorage is unavailable.
   *
   * Unlike `BrowserStorageAdapter.setItem`, this method also catches and
   * **swallows** `QuotaExceededError` so that a full storage partition does
   * not surface an uncaught exception.  Higher-layer error handling
   * (IntentEngine's `onError` callback) is the right place to observe this
   * failure; the caller (`IntentEngine._persist()`) wraps this call in its
   * own try/catch and routes any thrown error through `onError`.
   */
  save(key: string, value: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  }
}
