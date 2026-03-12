/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BrowserLifecycleAdapter — web plugin for ILifecycleAdapter
 * --------------------------------------------------------
 * Bridges the browser's Page Visibility API and DOM interaction events
 * into the microkernel's ILifecycleAdapter contract.
 *
 * This plugin re-exports and explicitly types the existing
 * BrowserLifecycleAdapter implementation from the core adapters module,
 * making the interface contract visible at the plugin layer.
 *
 * The concrete class satisfies ILifecycleAdapter structurally (same method
 * signatures), and the subclass declaration below makes that relationship
 * explicit so tooling and consumers can rely on it without inspection.
 *
 * Events wired:
 *   - `document.visibilitychange` → onPause / onResume callbacks
 *   - `mousemove`, `scroll`, `touchstart`, `keydown` → onInteraction callbacks
 *     (throttled to ≤ 1 per 1 000 ms)
 *   - `document.documentElement` mouseleave (clientY ≤ 0) → onExitIntent callbacks
 */

import { BrowserLifecycleAdapter as _Base } from '../../adapters.js';
import type { ILifecycleAdapter } from '../../types/microkernel.js';

/**
 * Standard browser lifecycle adapter for the IntentEngine microkernel.
 *
 * Drop-in for any environment where `document` and `window` are available.
 * All DOM access is guarded with `typeof document !== 'undefined'` checks so
 * the module can be imported in SSR / Node.js without throwing.
 *
 * ```ts
 * import { BrowserLifecycleAdapter } from '@passiveintent/core/plugins/web';
 *
 * const engine = new IntentEngine({
 *   lifecycle: new BrowserLifecycleAdapter(),
 *   // …
 * });
 * ```
 */
export class BrowserLifecycleAdapter extends _Base implements ILifecycleAdapter {}
