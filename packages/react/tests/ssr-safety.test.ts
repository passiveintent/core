/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview SSR safety tests — verifies the React package returns safe
 * zero-value defaults when the engine is absent (null-instance state).
 *
 * Contracts tested:
 *   1. All usePassiveIntent() callbacks are no-ops / return zero-values when
 *      the engine is null (equivalent to SSR where IS_BROWSER=false prevents
 *      construction, or post-unmount where the ref is cleared)
 *   2. PassiveIntentProvider onError prop swallows constructor throws and all
 *      context callbacks still return zero-values
 *   3. on() always returns a callable NOOP_UNSUBSCRIBE
 *
 * Note on IS_BROWSER testing: IS_BROWSER = typeof window !== 'undefined' is
 * evaluated once at module load time. Testing it by deleting globalThis.window
 * mid-test does not work because @testing-library/react's renderHook itself
 * depends on window. The correct approach is to test the *observable contract*:
 * that all public callbacks are safe when instanceRef.current is null — which
 * is the identical runtime state to SSR (IS_BROWSER=false → no construction).
 * The post-unmount state achieves this without breaking the test environment.
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

vi.mock('@passiveintent/core', () => ({
  IntentManager: vi.fn(),
}));

import { usePassiveIntent, PassiveIntentProvider } from '../src/index.js';
import { IntentManager } from '@passiveintent/core';

const MockIM = vi.mocked(IntentManager);

function makeFakeInstance() {
  return {
    destroy: vi.fn(),
    track: vi.fn(),
    on: vi.fn().mockReturnValue(vi.fn()),
    getTelemetry: vi.fn().mockReturnValue({ sessionId: 'ssr-test' }),
    predictNextStates: vi.fn().mockReturnValue([]),
    hasSeen: vi.fn().mockReturnValue(false),
    incrementCounter: vi.fn().mockReturnValue(0),
    getCounter: vi.fn().mockReturnValue(0),
    resetCounter: vi.fn(),
    trackConversion: vi.fn(),
  };
}

const BASE_CONFIG = { storageKey: 'ssr-test' };

function withProvider(children: React.ReactNode) {
  return React.createElement(PassiveIntentProvider, { config: BASE_CONFIG }, children);
}

describe('SSR safety', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockIM.mockImplementation(function MockIntentManager() {
      return makeFakeInstance() as unknown as InstanceType<typeof IntentManager>;
    });
  });

  // ── 1. Standalone mode — null-instance resilience (SSR-equivalent state) ──

  describe('1 — standalone usePassiveIntent() zero-value contracts', () => {
    it('all callbacks return zero-values without throwing when engine is null', () => {
      // Post-unmount mirrors the SSR state exactly: instanceRef.current = null,
      // all callbacks use optional-chaining so the behavior is identical to
      // the IS_BROWSER=false path where no instance is ever constructed.
      const { result, unmount } = renderHook(() => usePassiveIntent(BASE_CONFIG));
      unmount();

      expect(() => result.current.track('/page')).not.toThrow();
      expect(result.current.getTelemetry().sessionId).toBe('');
      expect(result.current.getTelemetry().botStatus).toBe('human');
      expect(result.current.getTelemetry().engineHealth).toBe('healthy');
      expect(result.current.getTelemetry().transitionsEvaluated).toBe(0);
      expect(result.current.predictNextStates()).toEqual([]);
      expect(result.current.hasSeen('/any')).toBe(false);
      expect(result.current.getCounter('x')).toBe(0);
      expect(result.current.incrementCounter('x')).toBe(0);
      expect(() => result.current.resetCounter('x')).not.toThrow();
      expect(() => result.current.trackConversion({ type: 'purchase' } as any)).not.toThrow();
    });

    it('on() returns a callable NOOP_UNSUBSCRIBE when engine is null', () => {
      const { result, unmount } = renderHook(() => usePassiveIntent(BASE_CONFIG));
      unmount();

      const unsub = result.current.on('exit_intent', vi.fn());
      expect(typeof unsub).toBe('function');
      expect(() => unsub()).not.toThrow();
    });
  });

  // ── 2. Context mode — Provider null-instance resilience ───────────────────

  describe('2 — PassiveIntentProvider context callbacks when engine is null', () => {
    it('all context callbacks return zero-values when engine failed to initialise', () => {
      MockIM.mockImplementation(function () {
        throw new Error('init failure');
      });

      const { result, unmount } = renderHook(() => usePassiveIntent(), {
        wrapper: ({ children }) =>
          React.createElement(
            PassiveIntentProvider,
            { config: BASE_CONFIG, onError: vi.fn() },
            children,
          ),
      });

      expect(() => result.current.track('/page')).not.toThrow();
      expect(result.current.getTelemetry().sessionId).toBe('');
      expect(result.current.predictNextStates()).toEqual([]);
      expect(result.current.hasSeen('/x')).toBe(false);
      expect(result.current.getCounter('k')).toBe(0);

      const unsub = result.current.on('exit_intent', vi.fn());
      expect(() => unsub()).not.toThrow();

      unmount();
    });
  });

  // ── 3. onError swallows constructor throws ────────────────────────────────

  describe('3 — PassiveIntentProvider onError prop', () => {
    it('calls onError and does not rethrow when IntentManager constructor throws', () => {
      MockIM.mockImplementation(function () {
        throw new Error('storage unavailable');
      });

      const onError = vi.fn();

      const { unmount } = renderHook(() => usePassiveIntent(), {
        wrapper: ({ children }) =>
          React.createElement(PassiveIntentProvider, { config: BASE_CONFIG, onError }, children),
      });

      // React Strict Mode double-invokes the provider, so onError may be called
      // twice (once per simulated mount). Assert at least once with the right error.
      expect(onError).toHaveBeenCalled();
      expect((onError.mock.calls[0][0] as Error).message).toMatch(/storage unavailable/);
      unmount();
    });
  });

  // ── 4. on() NOOP_UNSUBSCRIBE is always callable ───────────────────────────

  describe('4 — NOOP_UNSUBSCRIBE contract', () => {
    it('on() unsubscribe returned when engine is null is always a callable function', () => {
      const { result, unmount } = renderHook(() => usePassiveIntent(BASE_CONFIG));
      unmount(); // engine destroyed → ref = null

      const unsub = result.current.on('user_idle', vi.fn());
      expect(typeof unsub).toBe('function');
      expect(() => unsub()).not.toThrow();
    });
  });
});
