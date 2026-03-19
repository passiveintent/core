/**
 * useSimGuard — returns a `runGuarded(fn)` wrapper that prevents concurrent
 * async simulations. If a simulation is already running, subsequent calls are
 * silently dropped until the current one finishes.
 *
 * When used inside a SimGuardProvider, all consumers share the same lock so
 * IntentMeter and page-level simulations cannot run simultaneously.
 * Outside a provider, each call site gets its own independent lock (fallback).
 */
import React, { createContext, useCallback, useContext, useRef } from 'react';

type RunGuarded = (fn: () => Promise<void>) => Promise<void>;

const SimGuardContext = createContext<RunGuarded | null>(null);

export function SimGuardProvider({ children }: { children: React.ReactNode }) {
  const runningRef = useRef(false);

  const runGuarded = useCallback(async (fn: () => Promise<void>) => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      await fn();
    } finally {
      runningRef.current = false;
    }
  }, []);

  return React.createElement(SimGuardContext.Provider, { value: runGuarded }, children);
}

export function useSimGuard(): RunGuarded {
  const ctx = useContext(SimGuardContext);

  // Fallback: independent lock when used outside a provider.
  const runningRef = useRef(false);
  const fallback = useCallback(async (fn: () => Promise<void>) => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      await fn();
    } finally {
      runningRef.current = false;
    }
  }, []);

  return ctx ?? fallback;
}
