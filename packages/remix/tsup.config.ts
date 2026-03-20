/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';

const external = [
  'react',
  'react-dom',
  '@remix-run/react',
  '@remix-run/server-runtime',
  '@passiveintent/react',
  '@passiveintent/core',
];

export default defineConfig([
  // Server entry — imported by Remix loaders/actions (Node.js context)
  {
    entry: { 'index.server': 'src/index.server.ts' },
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    target: 'es2020',
    outDir: 'dist',
    external,
  },
  // Client entry — imported in browser context (full react re-export + Remix helpers)
  {
    entry: { 'index.client': 'src/index.client.ts' },
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    target: 'es2020',
    outDir: 'dist',
    external,
  },
  // Types-only build — produces the single .d.ts referenced by package "types" field
  {
    entry: { 'index.types': 'src/index.types.ts' },
    format: ['esm'],
    dts: { only: true },
    outDir: 'dist',
    external,
  },
]);
