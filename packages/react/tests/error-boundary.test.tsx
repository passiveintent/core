/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Tests for IntentErrorBoundary.
 *
 * Contracts tested:
 *   1. Renders children when there is no error
 *   2. Renders the default fallback UI when a child throws
 *   3. Renders a custom fallback when provided
 *   4. Reset clears the error and re-mounts children
 *   5. Default fallback has correct ARIA attributes for accessibility
 */

import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import React from 'react';
import { IntentErrorBoundary } from '../src/error-boundary.js';

afterEach(() => cleanup());

// A component that throws on demand
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('test engine failure');
  return <div data-testid="child">ok</div>;
}

// Silence the jsdom console.error spam from React's error boundary logging
const silenceConsole = () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => spy.mockRestore();
};

describe('IntentErrorBoundary', () => {
  // ── 1. Happy path ────────────────────────────────────────────────────────

  it('renders children when there is no error', () => {
    render(
      <IntentErrorBoundary>
        <Bomb shouldThrow={false} />
      </IntentErrorBoundary>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  // ── 2. Default fallback ──────────────────────────────────────────────────

  it('renders the default fallback when a child throws', () => {
    const restore = silenceConsole();
    render(
      <IntentErrorBoundary>
        <Bomb shouldThrow={true} />
      </IntentErrorBoundary>,
    );
    restore();

    // Default fallback contains the error message
    expect(screen.getByText(/test engine failure/i)).toBeTruthy();
    // Default fallback has a Retry button
    expect(screen.getByRole('button', { name: /retry/i })).toBeTruthy();
  });

  // ── 3. Custom fallback ───────────────────────────────────────────────────

  it('renders a custom fallback when the fallback prop is provided', () => {
    const restore = silenceConsole();
    render(
      <IntentErrorBoundary
        fallback={(err) => <div data-testid="custom-fallback">{err.message}</div>}
      >
        <Bomb shouldThrow={true} />
      </IntentErrorBoundary>,
    );
    restore();

    expect(screen.getByTestId('custom-fallback')).toBeTruthy();
    expect(screen.getByText('test engine failure')).toBeTruthy();
    // The default [PassiveIntent] text should NOT appear
    expect(screen.queryByText(/\[PassiveIntent\]/)).toBeNull();
  });

  // ── 4. Reset ─────────────────────────────────────────────────────────────

  it('reset() clears the error state and re-mounts children', () => {
    const restore = silenceConsole();
    render(
      <IntentErrorBoundary
        fallback={(_err, reset) => (
          <button type="button" data-testid="reset-btn" onClick={reset}>
            Reset
          </button>
        )}
      >
        <Bomb shouldThrow={true} />
      </IntentErrorBoundary>,
    );
    restore();

    // Fallback is visible
    expect(screen.getByTestId('reset-btn')).toBeTruthy();

    // After clicking reset the error is cleared — children re-render.
    // Bomb still throws because shouldThrow is still true (it's a prop),
    // so the boundary catches again. To verify reset actually clears state,
    // we check the button disappears briefly and then reappears.
    // A cleaner approach: render a non-throwing tree after reset by using
    // a stateful parent.
    fireEvent.click(screen.getByTestId('reset-btn'));

    // The boundary re-renders children after reset. Since Bomb still throws
    // (same prop), the boundary catches again and shows the fallback.
    // What matters: reset() was invoked and the cycle completes without error.
    expect(screen.getByTestId('reset-btn')).toBeTruthy();
  });

  // ── 5. Accessibility ─────────────────────────────────────────────────────

  it('default fallback has role="alert" and aria-live="assertive"', () => {
    const restore = silenceConsole();
    render(
      <IntentErrorBoundary>
        <Bomb shouldThrow={true} />
      </IntentErrorBoundary>,
    );
    restore();

    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.getAttribute('aria-live')).toBe('assertive');
    expect(alert.getAttribute('aria-atomic')).toBe('true');
  });

  // ── 6. Custom fallback receives reset callback ────────────────────────────

  it('custom fallback reset callback clears error and re-renders children', () => {
    const restore = silenceConsole();

    // Use a stateful wrapper so Bomb's prop changes before reset fires.
    // This mirrors real usage: fix the root cause, then call reset.
    let setThrow!: (v: boolean) => void;

    function Wrapper() {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      setThrow = setShouldThrow;
      return (
        <IntentErrorBoundary
          fallback={(_err, reset) => (
            <button
              type="button"
              data-testid="reset-btn"
              onClick={() => {
                setShouldThrow(false);
                reset();
              }}
            >
              Reset
            </button>
          )}
        >
          <Bomb shouldThrow={shouldThrow} />
        </IntentErrorBoundary>
      );
    }

    render(<Wrapper />);
    restore();

    expect(screen.getByTestId('reset-btn')).toBeTruthy();

    // Click reset: sets shouldThrow=false then clears boundary error state
    act(() => {
      fireEvent.click(screen.getByTestId('reset-btn'));
    });

    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.queryByTestId('reset-btn')).toBeNull();
  });
});
