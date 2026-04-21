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
 * **Namespace isolation** — when multiple micro-frontends share the same
 * origin, construct each adapter with a unique `namespace` string.  Every
 * read, write, and delete is transparently prefixed with
 * `"${namespace}${key}"` so that instances never overwrite one another's
 * persisted state.  The default namespace is `'passiveintent:'`.
 *
 * **Legacy migration** — when using the default namespace, `load` first
 * checks the namespaced key.  If not found it falls back to the legacy
 * unprefixed key and, on a successful read, transparently migrates the
 * value to the namespaced key and removes the old entry.  This makes the
 * migration automatic and invisible to callers on the first read after
 * upgrade.
 *
 * Note: `localStorage` is synchronous.  For async backends (React Native
 * AsyncStorage, Capacitor Preferences, IndexedDB) use `IntentManager.createAsync()`
 * with an `AsyncStorageAdapter` — that path remains in Layer 3 (IntentManager).
 *
 * Usage:
 * ```ts
 * import { LocalStorageAdapter } from '@passiveintent/core/plugins/web';
 *
 * // Default namespace ('passiveintent:')
 * const engine = new IntentEngine({
 *   persistence: new LocalStorageAdapter(),
 *   // …
 * });
 *
 * // Custom namespace for micro-frontend isolation
 * const mfeEngine = new IntentEngine({
 *   persistence: new LocalStorageAdapter('checkout-mfe:'),
 *   // …
 * });
 * ```
 */

import type { IPersistenceAdapter } from '../../types/microkernel.js';
import { BrowserStorageAdapter } from '../../adapters.js';

/** Default namespace prefix applied to every localStorage key. */
const DEFAULT_NAMESPACE = 'passiveintent:';

export class LocalStorageAdapter implements IPersistenceAdapter {
  private readonly storage: BrowserStorageAdapter;

  /**
   * @param namespace  Prefix prepended to every key before it is read from or
   *                   written to `localStorage`.  Defaults to `'passiveintent:'`.
   *                   Pass an empty string `''` to disable prefixing entirely
   *                   (not recommended when multiple instances share an origin).
   */
  constructor(namespace: string = DEFAULT_NAMESPACE) {
    this.storage = new BrowserStorageAdapter(namespace);
  }

  /**
   * Load a value from localStorage.
   * Returns `null` when the key is absent, when localStorage is unavailable
   * (SSR, incognito with storage blocked, sandboxed iframe), or when a
   * `SecurityError` is thrown.
   *
   * Namespace prefixing, SSR guarding, and legacy key migration are all
   * handled by the underlying `BrowserStorageAdapter`.
   */
  load(key: string): string | null {
    return this.storage.getItem(key);
  }

  /**
   * Save a value to localStorage.
   * Silently no-ops when localStorage is unavailable.
   *
   * Wraps `BrowserStorageAdapter.setItem` in a try/catch so that
   * `QuotaExceededError` and `SecurityError` are swallowed here rather than
   * propagating to the caller.  Higher-layer error handling (IntentEngine's
   * `onError` callback) is the right place to observe these failures; the
   * caller (`IntentEngine._persist()`) already wraps this call in its own
   * try/catch and routes any thrown error through `onError`.
   */
  save(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch {
      // SecurityError (sandboxed/opaque origin) or QuotaExceededError — swallowed.
    }
  }

  /**
   * Remove a previously saved value from localStorage.
   * Silently no-ops when localStorage is unavailable.
   */
  delete(key: string): void {
    this.storage.removeItem(key);
  }
}
