/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @passiveintent/vanilla
 *
 * Placeholder — Vanilla JS / IIFE / UMD adapter.
 *
 * Status: NOT YET IMPLEMENTED
 *
 * ─── Target environments ──────────────────────────────────────────────────────
 *
 *  1. Google Tag Manager (GTM) — Custom HTML tag injection
 *     <script>
 *       PassiveIntent.init({ debug: false });
 *       PassiveIntent.track(window.location.pathname);
 *     </script>
 *     Load via: Custom HTML tag → src="https://cdn.jsdelivr.net/npm/@passiveintent/vanilla/dist/passiveintent.iife.js"
 *
 *  2. Wix Velo — ES module import in page code
 *     import { init, track, on } from '@passiveintent/vanilla';
 *
 *  3. Squarespace — Code Injection (Settings → Advanced → Code Injection → Header)
 *     <script src="https://cdn.jsdelivr.net/npm/@passiveintent/vanilla/dist/passiveintent.iife.js"></script>
 *     <script>
 *       document.addEventListener('DOMContentLoaded', function() {
 *         PassiveIntent.init();
 *         PassiveIntent.track(window.location.pathname);
 *       });
 *     </script>
 *
 * ─── Planned build approach ───────────────────────────────────────────────────
 *
 *  IIFE bundle (primary — for script tag + GTM):
 *    npx esbuild src/index.ts \
 *      --bundle \
 *      --format=iife \
 *      --global-name=PassiveIntent \
 *      --minify \
 *      --target=es2017 \
 *      --outfile=dist/passiveintent.iife.js
 *
 *  ESM bundle (for Wix Velo / modern bundlers):
 *    npx esbuild src/index.ts \
 *      --bundle \
 *      --format=esm \
 *      --minify \
 *      --target=es2020 \
 *      --outfile=dist/passiveintent.esm.js
 *
 *  Target size: ~15 KB minified + gzipped (core + adapters, no React)
 *
 * ─── Planned package.json exports ────────────────────────────────────────────
 *
 *  "exports": {
 *    ".": {
 *      "import": "./dist/passiveintent.esm.js",
 *      "require": "./dist/passiveintent.cjs.js",
 *      "script":  "./dist/passiveintent.iife.js"
 *    }
 *  },
 *  "unpkg": "./dist/passiveintent.iife.js",
 *  "jsdelivr": "./dist/passiveintent.iife.js"
 */

import type { PassiveIntentGlobal, PassiveIntentVanillaConfig } from './types.js';

/** Placeholder singleton — throws on all calls until implemented. */
export const PassiveIntent: PassiveIntentGlobal = {
  init(_config?: PassiveIntentVanillaConfig) {
    throw new Error('[PassiveIntent] @passiveintent/vanilla is not yet implemented.');
  },
  track(_state: string) {
    throw new Error('[PassiveIntent] @passiveintent/vanilla is not yet implemented.');
  },
  on(_event: string, _handler: (payload: unknown) => void) {
    throw new Error('[PassiveIntent] @passiveintent/vanilla is not yet implemented.');
  },
  destroy() {
    throw new Error('[PassiveIntent] @passiveintent/vanilla is not yet implemented.');
  },
};

export type { PassiveIntentGlobal, PassiveIntentVanillaConfig } from './types.js';
