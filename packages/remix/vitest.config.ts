/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Resolve @passiveintent/react to its TS source (no build required)
      '@passiveintent/react': resolve(__dirname, '../react/src/index.ts'),
      // Resolve @passiveintent/core to its TS source
      '@passiveintent/core': resolve(__dirname, '../core/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    isolate: true,
  },
});
