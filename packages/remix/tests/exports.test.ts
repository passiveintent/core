/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Export surface tests
 *
 * Contracts tested:
 *   1. Client entry exports all @passiveintent/react hooks and components
 *   2. Client entry exports Remix-specific additions (ClientOnly, withPassiveIntent, createIntentClientLoader, useRoutePassiveIntent)
 *   3. Server entry exports only server-safe symbols (no React hooks, no browser APIs)
 *   4. Server entry exports createIntentClientLoader
 *   5. Server entry exports MemoryStorageAdapter
 *
 * These tests guard against accidental removal of public API surface.
 * They do NOT test runtime behaviour — that is covered in the other test files.
 */

import { describe, it, expect } from 'vitest';

// ── Client entry exports ──────────────────────────────────────────────────────

import * as client from '../src/index.client.js';

describe('client entry (@passiveintent/remix — browser)', () => {
  // ── 1. @passiveintent/react re-exports ─────────────────────────────────

  describe('1 — @passiveintent/react hooks re-exported', () => {
    it('exports usePassiveIntent', () => {
      expect(typeof client.usePassiveIntent).toBe('function');
    });
    it('exports useExitIntent', () => {
      expect(typeof client.useExitIntent).toBe('function');
    });
    it('exports useIdle', () => {
      expect(typeof client.useIdle).toBe('function');
    });
    it('exports useAttentionReturn', () => {
      expect(typeof client.useAttentionReturn).toBe('function');
    });
    it('exports useSignals', () => {
      expect(typeof client.useSignals).toBe('function');
    });
    it('exports usePropensity', () => {
      expect(typeof client.usePropensity).toBe('function');
    });
    it('exports usePredictiveLink', () => {
      expect(typeof client.usePredictiveLink).toBe('function');
    });
    it('exports useEventLog', () => {
      expect(typeof client.useEventLog).toBe('function');
    });
    it('exports useBloomFilter', () => {
      expect(typeof client.useBloomFilter).toBe('function');
    });
    it('exports useMarkovGraph', () => {
      expect(typeof client.useMarkovGraph).toBe('function');
    });
  });

  describe('1b — @passiveintent/react components re-exported', () => {
    it('exports PassiveIntentProvider', () => {
      expect(typeof client.PassiveIntentProvider).toBe('function');
    });
    it('exports IntentErrorBoundary', () => {
      expect(typeof client.IntentErrorBoundary).toBe('function');
    });
  });

  // ── 2. Remix-specific additions ─────────────────────────────────────────

  describe('2 — Remix-specific exports', () => {
    it('exports ClientOnly component', () => {
      expect(typeof client.ClientOnly).toBe('function');
    });
    it('exports withPassiveIntent HOC', () => {
      expect(typeof client.withPassiveIntent).toBe('function');
    });
    it('exports createIntentClientLoader', () => {
      expect(typeof client.createIntentClientLoader).toBe('function');
    });
    it('exports useRoutePassiveIntent hook', () => {
      expect(typeof client.useRoutePassiveIntent).toBe('function');
    });
  });
});

// ── Server entry exports ──────────────────────────────────────────────────────

import * as server from '../src/index.server.js';

describe('server entry (@passiveintent/remix — Node.js)', () => {
  // ── 3. No React hooks in server entry ──────────────────────────────────

  describe('3 — browser-only hooks NOT present in server entry', () => {
    it('does not export usePassiveIntent (browser hook)', () => {
      expect((server as Record<string, unknown>).usePassiveIntent).toBeUndefined();
    });
    it('does not export useExitIntent (browser hook)', () => {
      expect((server as Record<string, unknown>).useExitIntent).toBeUndefined();
    });
    it('does not export PassiveIntentProvider (browser component)', () => {
      expect((server as Record<string, unknown>).PassiveIntentProvider).toBeUndefined();
    });
    it('does not export ClientOnly (browser component)', () => {
      expect((server as Record<string, unknown>).ClientOnly).toBeUndefined();
    });
    it('does not export withPassiveIntent (browser HOC)', () => {
      expect((server as Record<string, unknown>).withPassiveIntent).toBeUndefined();
    });
  });

  // ── 4. createIntentClientLoader in server entry ─────────────────────────

  describe('4 — server entry exports createIntentClientLoader', () => {
    it('exports createIntentClientLoader', () => {
      expect(typeof server.createIntentClientLoader).toBe('function');
    });
  });

  // ── 5. MemoryStorageAdapter in server entry ─────────────────────────────

  describe('5 — server entry exports MemoryStorageAdapter', () => {
    it('exports MemoryStorageAdapter class', () => {
      expect(typeof server.MemoryStorageAdapter).toBe('function');
    });
  });
});
