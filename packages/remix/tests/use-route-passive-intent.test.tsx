/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview useRoutePassiveIntent hook tests
 *
 * Contracts tested:
 *   1. Calls track() with the initial pathname on mount
 *   2. Calls track() again when pathname changes
 *   3. Does NOT call track() when an unrelated prop/state changes (pathname unchanged)
 *   4. Returns the full usePassiveIntent() context object
 *   5. Works correctly across multiple pathname transitions
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import React, { useState, useReducer } from 'react';

vi.mock('@passiveintent/core', () => ({
  IntentManager: vi.fn(),
}));

import { useRoutePassiveIntent } from '../src/index.client.js';
import { PassiveIntentProvider } from '../src/index.client.js';
import { IntentManager } from '@passiveintent/core';

const MockIM = vi.mocked(IntentManager);

function makeFakeInstance() {
  return {
    destroy: vi.fn(),
    track: vi.fn(),
    on: vi.fn().mockReturnValue(vi.fn()),
    getTelemetry: vi.fn().mockReturnValue({ sessionId: 'route-test' }),
    predictNextStates: vi.fn().mockReturnValue([]),
    hasSeen: vi.fn().mockReturnValue(false),
    incrementCounter: vi.fn().mockReturnValue(0),
    getCounter: vi.fn().mockReturnValue(0),
    resetCounter: vi.fn(),
    trackConversion: vi.fn(),
  };
}

let fakeInstance: ReturnType<typeof makeFakeInstance>;

beforeEach(() => {
  vi.clearAllMocks();
  fakeInstance = makeFakeInstance();
  MockIM.mockImplementation(function () {
    return fakeInstance as unknown as InstanceType<typeof IntentManager>;
  });
});

afterEach(() => cleanup());

// ── Test helpers ──────────────────────────────────────────────────────────────

/**
 * Simple harness: renders useRoutePassiveIntent inside a PassiveIntentProvider.
 * Exposes a setter so tests can simulate route changes.
 */
function RouteTracker({ initialPath }: { initialPath: string }) {
  const [pathname, setPathname] = useState(initialPath);
  // Separate counter used to force a real re-render without changing pathname.
  // setPathname(pathname) would bail out because the value is identical.
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);
  const intent = useRoutePassiveIntent(pathname);

  return (
    <div>
      <span data-testid="session">{intent.getTelemetry().sessionId}</span>
      <button type="button" data-testid="navigate" onClick={() => setPathname('/products/tee')}>
        navigate
      </button>
      <button type="button" data-testid="navigate-again" onClick={() => setPathname('/cart')}>
        navigate-again
      </button>
      <button type="button" data-testid="unrelated-update" onClick={() => forceUpdate()}>
        unrelated-update
      </button>
    </div>
  );
}

function renderWithProvider(initialPath = '/') {
  return render(
    <PassiveIntentProvider config={{}}>
      <RouteTracker initialPath={initialPath} />
    </PassiveIntentProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useRoutePassiveIntent', () => {
  // ── 1. Tracks initial pathname on mount ──────────────────────────────────

  describe('1 — tracks initial pathname on mount', () => {
    it('calls track() with the initial pathname after mount', () => {
      renderWithProvider('/home');
      expect(fakeInstance.track).toHaveBeenCalledWith('/home');
    });

    it('calls track() exactly once on mount', () => {
      renderWithProvider('/home');
      expect(fakeInstance.track).toHaveBeenCalledTimes(1);
    });
  });

  // ── 2. Tracks pathname changes ────────────────────────────────────────────

  describe('2 — tracks pathname changes', () => {
    it('calls track() again when pathname changes', () => {
      const { getByTestId } = renderWithProvider('/');
      act(() => {
        getByTestId('navigate').click();
      });
      expect(fakeInstance.track).toHaveBeenCalledWith('/products/tee');
    });

    it('calls track() for each distinct pathname', () => {
      const { getByTestId } = renderWithProvider('/');
      act(() => {
        getByTestId('navigate').click();
      });
      act(() => {
        getByTestId('navigate-again').click();
      });
      expect(fakeInstance.track).toHaveBeenNthCalledWith(1, '/');
      expect(fakeInstance.track).toHaveBeenNthCalledWith(2, '/products/tee');
      expect(fakeInstance.track).toHaveBeenNthCalledWith(3, '/cart');
    });
  });

  // ── 3. No duplicate track on same pathname ────────────────────────────────

  describe('3 — no duplicate track when pathname is unchanged', () => {
    it('does not call track() again when re-rendered with the same pathname', () => {
      const { getByTestId } = renderWithProvider('/same');
      const callsBefore = fakeInstance.track.mock.calls.length;
      act(() => {
        getByTestId('unrelated-update').click();
      });
      expect(fakeInstance.track.mock.calls.length).toBe(callsBefore);
    });
  });

  // ── 4. Returns full intent context ───────────────────────────────────────

  describe('4 — returns full usePassiveIntent() context', () => {
    it('returns getTelemetry from the provider context', () => {
      const { getByTestId } = renderWithProvider('/page');
      expect(getByTestId('session').textContent).toBe('route-test');
    });
  });

  // ── 5. Multiple transitions ───────────────────────────────────────────────

  describe('5 — multiple pathname transitions tracked correctly', () => {
    it('tracks all unique pathnames in order', () => {
      const { getByTestId } = renderWithProvider('/a');
      act(() => {
        getByTestId('navigate').click();
      }); // /products/tee
      act(() => {
        getByTestId('navigate-again').click();
      }); // /cart

      const calls = fakeInstance.track.mock.calls.map(([p]) => p);
      expect(calls).toEqual(['/a', '/products/tee', '/cart']);
    });
  });
});
