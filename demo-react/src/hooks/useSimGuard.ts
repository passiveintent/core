/**
 * useSimGuard — returns a `runGuarded(fn)` wrapper that prevents concurrent
 * async simulations. If a simulation is already running, subsequent calls are
 * silently dropped until the current one finishes.
 *
 * Replaces the repeated `const simRef = useRef(false)` guard pattern in
 * IntentMeter and AmazonPlayground.
 */
import { useCallback, useRef } from 'react';

export function useSimGuard(): (fn: () => Promise<void>) => Promise<void> {
  const runningRef = useRef(false);

  return useCallback(async (fn: () => Promise<void>) => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      await fn();
    } finally {
      runningRef.current = false;
    }
  }, []);
}
