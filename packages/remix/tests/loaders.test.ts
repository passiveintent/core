/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview createIntentClientLoader tests
 *
 * Contracts tested:
 *   1. Returns a function (the clientLoader)
 *   2. Without mergeServerData=true — returns null (no server round-trip)
 *   3. With mergeServerData=true — calls serverLoader() and returns its result
 *   4. serverLoader is only called when mergeServerData=true
 *   5. Async behaviour — the returned clientLoader is async
 */

import { describe, it, expect, vi } from 'vitest';
import { createIntentClientLoader } from '../src/loaders.js';

describe('createIntentClientLoader', () => {
  // ── 1. Return type ────────────────────────────────────────────────────────

  describe('1 — return type', () => {
    it('returns a function', () => {
      expect(typeof createIntentClientLoader()).toBe('function');
    });

    it('returned function is async (returns a Promise)', () => {
      const loader = createIntentClientLoader();
      const result = loader({ serverLoader: async () => ({}) });
      expect(result).toBeInstanceOf(Promise);
    });
  });

  // ── 2. Default (mergeServerData=false) ────────────────────────────────────

  describe('2 — mergeServerData=false (default)', () => {
    it('resolves to null without calling serverLoader', async () => {
      const serverLoader = vi.fn(async () => ({ product: 'data' }));
      const loader = createIntentClientLoader();

      const result = await loader({ serverLoader });

      expect(result).toBeNull();
      expect(serverLoader).not.toHaveBeenCalled();
    });

    it('explicit false also skips serverLoader', async () => {
      const serverLoader = vi.fn(async () => 'server-data');
      const loader = createIntentClientLoader(false);

      const result = await loader({ serverLoader });

      expect(result).toBeNull();
      expect(serverLoader).not.toHaveBeenCalled();
    });
  });

  // ── 3. mergeServerData=true — delegates to serverLoader ──────────────────

  describe('3 — mergeServerData=true', () => {
    it('calls serverLoader() and returns its resolved value', async () => {
      const serverData = { product: { id: '123', title: 'Tee' } };
      const serverLoader = vi.fn(async () => serverData);
      const loader = createIntentClientLoader(true);

      const result = await loader({ serverLoader });

      expect(serverLoader).toHaveBeenCalledTimes(1);
      expect(result).toEqual(serverData);
    });

    it('propagates serverLoader rejection', async () => {
      const serverLoader = vi.fn(async () => {
        throw new Error('server error');
      });
      const loader = createIntentClientLoader(true);

      await expect(loader({ serverLoader })).rejects.toThrow('server error');
    });
  });

  // ── 4. serverLoader call isolation ───────────────────────────────────────

  describe('4 — serverLoader is only called when mergeServerData=true', () => {
    it('two loaders: one default, one merge — only merge calls serverLoader', async () => {
      const serverLoader = vi.fn(async () => 'data');

      const intentOnly = createIntentClientLoader();
      const withMerge = createIntentClientLoader(true);

      await intentOnly({ serverLoader });
      expect(serverLoader).not.toHaveBeenCalled();

      await withMerge({ serverLoader });
      expect(serverLoader).toHaveBeenCalledTimes(1);
    });
  });

  // ── 5. Each call creates an independent loader ────────────────────────────

  describe('5 — independent loader instances', () => {
    it('each createIntentClientLoader() call produces an independent function', () => {
      const a = createIntentClientLoader();
      const b = createIntentClientLoader();
      expect(a).not.toBe(b);
    });

    it('loaders do not share state between calls', async () => {
      const serverLoader1 = vi.fn(async () => 'first');
      const serverLoader2 = vi.fn(async () => 'second');

      const loaderA = createIntentClientLoader(true);
      const loaderB = createIntentClientLoader(false);

      const [r1, r2] = await Promise.all([
        loaderA({ serverLoader: serverLoader1 }),
        loaderB({ serverLoader: serverLoader2 }),
      ]);

      expect(r1).toBe('first');
      expect(r2).toBeNull();
      expect(serverLoader1).toHaveBeenCalledTimes(1);
      expect(serverLoader2).not.toHaveBeenCalled();
    });
  });
});
