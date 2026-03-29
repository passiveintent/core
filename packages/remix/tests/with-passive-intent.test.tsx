/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview withPassiveIntent HOC tests
 *
 * Contracts tested:
 *   1. Wrapped component renders inside ClientOnly + PassiveIntentProvider
 *   2. Wrapped component receives its original props unchanged
 *   3. Hooks inside the wrapped component can access the intent context
 *   4. Config default (empty object) — works without explicit config arg
 *   5. Custom config is forwarded to PassiveIntentProvider
 *   6. displayName is set correctly for DevTools
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import React from 'react';

vi.mock('@passiveintent/core', () => ({
  IntentManager: vi.fn(),
}));

import { withPassiveIntent, usePassiveIntent } from '../src/index.client.js';
import { IntentManager } from '@passiveintent/core';

const MockIM = vi.mocked(IntentManager);

function makeFakeInstance() {
  return {
    destroy: vi.fn(),
    track: vi.fn(),
    on: vi.fn().mockReturnValue(vi.fn()),
    getTelemetry: vi.fn().mockReturnValue({ sessionId: 'hoc-test' }),
    predictNextStates: vi.fn().mockReturnValue([]),
    hasSeen: vi.fn().mockReturnValue(false),
    incrementCounter: vi.fn().mockReturnValue(0),
    getCounter: vi.fn().mockReturnValue(0),
    resetCounter: vi.fn(),
    trackConversion: vi.fn(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  MockIM.mockImplementation(function () {
    return makeFakeInstance() as unknown as InstanceType<typeof IntentManager>;
  });
});

afterEach(() => cleanup());

// ── Test components ───────────────────────────────────────────────────────────

interface PageProps {
  title: string;
  count?: number;
}

function Page({ title, count = 0 }: PageProps) {
  return (
    <div>
      <h1 data-testid="title">{title}</h1>
      <span data-testid="count">{count}</span>
    </div>
  );
}

function IntentConsumer() {
  const { getTelemetry } = usePassiveIntent();
  return <span data-testid="session">{getTelemetry().sessionId}</span>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('withPassiveIntent HOC', () => {
  // ── 1. Renders wrapped component ─────────────────────────────────────────

  describe('1 — renders wrapped component', () => {
    it('renders the wrapped component in the DOM', () => {
      const WrappedPage = withPassiveIntent(Page);
      render(<WrappedPage title="Home" />);
      expect(screen.getByTestId('title').textContent).toBe('Home');
    });

    it('renders without config (uses empty default)', () => {
      const Wrapped = withPassiveIntent(Page);
      expect(() => render(<Wrapped title="Test" />)).not.toThrow();
    });
  });

  // ── 2. Props passthrough ──────────────────────────────────────────────────

  describe('2 — props are forwarded unchanged', () => {
    it('passes all props to the wrapped component', () => {
      const Wrapped = withPassiveIntent(Page);
      const { container } = render(<Wrapped title="Products" count={42} />);
      const scope = within(container);
      expect(scope.getByTestId('title').textContent).toBe('Products');
      expect(scope.getByTestId('count').textContent).toBe('42');
    });

    it('passes default prop values correctly', () => {
      const Wrapped = withPassiveIntent(Page);
      const { container } = render(<Wrapped title="About" />);
      expect(within(container).getByTestId('count').textContent).toBe('0');
    });
  });

  // ── 3. Context availability ───────────────────────────────────────────────

  describe('3 — PassiveIntentProvider context is available inside wrapped component', () => {
    it('hooks inside the wrapped component can read from context', () => {
      const WrappedConsumer = withPassiveIntent(IntentConsumer);
      render(<WrappedConsumer />);
      // IntentConsumer calls usePassiveIntent() which needs provider context
      expect(screen.getByTestId('session').textContent).toBe('hoc-test');
    });

    it('creates exactly one IntentManager for the wrapped tree', () => {
      const Wrapped = withPassiveIntent(IntentConsumer);
      render(<Wrapped />);
      expect(MockIM).toHaveBeenCalledTimes(1);
    });
  });

  // ── 4. Default config ─────────────────────────────────────────────────────

  describe('4 — default config (no second argument)', () => {
    it('calls IntentManager with empty config object when no config provided', () => {
      const Wrapped = withPassiveIntent(IntentConsumer);
      render(<Wrapped />);
      expect(MockIM).toHaveBeenCalledWith({});
    });
  });

  // ── 5. Custom config forwarding ───────────────────────────────────────────

  describe('5 — custom config is forwarded to PassiveIntentProvider', () => {
    it('passes the config object to IntentManager', () => {
      const config = { maxStates: 200, storageKey: 'hydrogen-store' };
      const Wrapped = withPassiveIntent(IntentConsumer, config);
      render(<Wrapped />);
      expect(MockIM).toHaveBeenCalledWith(config);
    });
  });

  // ── 6. Config-change warning (dev-only) ──────────────────────────────────
  //
  // withPassiveIntent captures config at HOC creation time via a closure.
  // A dev-only console.warn fires inside PassiveIntentRoot when
  // !Object.is(configRef.current, config) — i.e. when the closed-over config
  // reference differs from what configRef was seeded with on mount.
  //
  // NOTE: Because `config` is a fixed closure value and configRef.current is
  // initialised to that same value and never mutated, the warning branch is
  // unreachable through normal React rendering. The tests below verify the
  // negative cases (no spurious warnings) and the production suppression.
  // The warning message format is verified separately via the implementation
  // source, which is the authoritative specification.

  describe('6 — dev-only warning when config reference changes', () => {
    it('does NOT warn on initial render', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const Wrapped = withPassiveIntent(Page, { maxStates: 100 });
      render(<Wrapped title="A" />);

      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('[PassiveIntent]'));

      warnSpy.mockRestore();
    });

    it('does NOT warn on a normal re-render when config reference is stable', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // config is captured at HOC creation and never changes — configRef.current
      // will always Object.is-equal to the closed-over config.
      const Wrapped = withPassiveIntent(Page, { maxStates: 100 });
      const { rerender } = render(<Wrapped title="A" />);
      rerender(<Wrapped title="B" />);

      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('[PassiveIntent]'));

      warnSpy.mockRestore();
    });

    it('does not warn in production (NODE_ENV=production)', () => {
      const original = process.env.NODE_ENV;
      // @ts-expect-error — forcing production for this test
      process.env.NODE_ENV = 'production';

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const Wrapped = withPassiveIntent(Page, { maxStates: 10 });
      const { rerender } = render(<Wrapped title="prod" />);
      rerender(<Wrapped title="prod2" />);

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
      // @ts-expect-error
      process.env.NODE_ENV = original;
    });
  });

  // ── 7. displayName ────────────────────────────────────────────────────────

  describe('7 — displayName', () => {
    it('sets displayName to withPassiveIntent(ComponentName)', () => {
      const Wrapped = withPassiveIntent(Page);
      expect(Wrapped.displayName).toBe('withPassiveIntent(Page)');
    });

    it('uses displayName if set on the component', () => {
      function Unnamed() {
        return null;
      }
      Unnamed.displayName = 'MySpecialPage';
      const Wrapped = withPassiveIntent(Unnamed);
      expect(Wrapped.displayName).toBe('withPassiveIntent(MySpecialPage)');
    });

    it('handles anonymous components gracefully', () => {
      const Anon = (
        () => () =>
          null
      )(); // no .name
      Object.defineProperty(Anon, 'name', { value: '' });
      const Wrapped = withPassiveIntent(Anon);
      expect(Wrapped.displayName).toBe('withPassiveIntent(Component)');
    });
  });
});
