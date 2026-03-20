/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @passiveintent/remix — server entry point
 *
 * This module is loaded in the Remix server runtime (Node.js / Cloudflare Workers).
 * It must NOT import browser globals (window, document, localStorage, etc.).
 *
 * Only type exports and server-safe utilities are exposed here.
 * All React hooks and components live in the client entry (index.client.ts).
 */

// Server-safe type re-exports from @passiveintent/react
export type {
  IntentManagerConfig,
  PassiveIntentTelemetry,
  IntentEventName,
  IntentEventMap,
  BloomFilterConfig,
  MarkovGraphConfig,
} from '@passiveintent/react';

// MemoryStorageAdapter is safe on the server (no window/localStorage dependency)
export { MemoryStorageAdapter } from '@passiveintent/react';

// clientLoader helpers (TypeScript types only reference @remix-run/server-runtime)
export { createIntentClientLoader } from './loaders.js';
