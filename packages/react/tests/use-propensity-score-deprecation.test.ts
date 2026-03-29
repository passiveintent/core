/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview usePropensityScore deprecation warning tests
 *
 * Contracts tested:
 *   1. console.warn fires on first mount with a PassiveIntent-prefixed message
 *   2. console.warn fires exactly once — NOT on subsequent re-renders
 *   3. console.warn does NOT fire in production (process.env.NODE_ENV=production)
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

vi.mock('@passiveintent/core', () => ({
  IntentManager: vi.fn(),
}));

import { usePropensityScore, PassiveIntentProvider } from '../src/index';
import { IntentManager } from '@passiveintent/core';

const MockIM = vi.mocked(IntentManager);

function makeFakeInstance() {
  return {
    destroy: vi.fn(),
    track: vi.fn(),
    on: vi.fn().mockReturnValue(vi.fn()),
    getTelemetry: vi.fn().mockReturnValue({}),
    predictNextStates: vi.fn().mockReturnValue([]),
    hasSeen: vi.fn().mockReturnValue(false),
    incrementCounter: vi.fn().mockReturnValue(0),
    getCounter: vi.fn().mockReturnValue(0),
    resetCounter: vi.fn(),
    trackConversion: vi.fn(),
  };
}

function withProvider(children: React.ReactNode) {
  return React.createElement(
    PassiveIntentProvider,
    { config: { storageKey: 'dep-test' } },
    children,
  );
}

describe('usePropensityScore — deprecation warning', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    MockIM.mockImplementation(function () {
      return makeFakeInstance() as unknown as InstanceType<typeof IntentManager>;
    });
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  // ── 1. Fires on mount ─────────────────────────────────────────────────────

  describe('1 — fires on first mount', () => {
    it('calls console.warn once on initial render', () => {
      renderHook(() => usePropensityScore('/checkout'), {
        wrapper: ({ children }) => withProvider(children),
      });
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('warning message identifies the deprecated hook by name', () => {
      renderHook(() => usePropensityScore('/checkout'), {
        wrapper: ({ children }) => withProvider(children),
      });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('usePropensityScore'));
    });

    it('warning message is prefixed with [PassiveIntent]', () => {
      renderHook(() => usePropensityScore('/checkout'), {
        wrapper: ({ children }) => withProvider(children),
      });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[PassiveIntent]'));
    });

    it('warning message mentions usePropensity as the migration target', () => {
      renderHook(() => usePropensityScore('/checkout'), {
        wrapper: ({ children }) => withProvider(children),
      });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('usePropensity'));
    });
  });

  // ── 2. Fires exactly once per mount ──────────────────────────────────────

  describe('2 — fires exactly once (useRef(false) guard)', () => {
    it('does not fire again on re-renders with the same props', () => {
      const { rerender } = renderHook(
        ({ target }: { target: string }) => usePropensityScore(target),
        {
          initialProps: { target: '/checkout' },
          wrapper: ({ children }) => withProvider(children),
        },
      );

      const callsAfterMount = warnSpy.mock.calls.length;
      expect(callsAfterMount).toBe(1);

      rerender({ target: '/checkout' });
      rerender({ target: '/checkout' });

      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('does not fire again when the targetState prop changes', () => {
      const { rerender } = renderHook(
        ({ target }: { target: string }) => usePropensityScore(target),
        {
          initialProps: { target: '/checkout' },
          wrapper: ({ children }) => withProvider(children),
        },
      );

      rerender({ target: '/cart' });
      rerender({ target: '/home' });

      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });

  // ── 3. Suppressed in production ───────────────────────────────────────────

  describe('3 — suppressed in production', () => {
    it('does not call console.warn when NODE_ENV is production', () => {
      const original = process.env.NODE_ENV;
      // @ts-expect-error — overriding read-only env for test
      process.env.NODE_ENV = 'production';

      try {
        renderHook(() => usePropensityScore('/checkout'), {
          wrapper: ({ children }) => withProvider(children),
        });
        expect(warnSpy).not.toHaveBeenCalled();
      } finally {
        // @ts-expect-error
        process.env.NODE_ENV = original;
      }
    });
  });
});
