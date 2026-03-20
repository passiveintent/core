/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @passiveintent/remix — client entry point
 *
 * This module is loaded in the browser (Remix client runtime).
 * It re-exports the full @passiveintent/react surface so consumers
 * can import everything from a single '@passiveintent/remix' specifier.
 *
 * Additional Remix-specific helpers are exported alongside.
 */

// Full @passiveintent/react re-export — hooks, provider, components, types
export * from '@passiveintent/react';

// Remix-specific additions
export { ClientOnly } from './ClientOnly.js';
export { withPassiveIntent } from './withPassiveIntent.js';
export { createIntentClientLoader } from './loaders.js';
export { useRoutePassiveIntent } from './useRoutePassiveIntent.js';
