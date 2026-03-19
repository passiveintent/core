/**
 * LogContext — live event log for the demo shell.
 *
 * Subscribes to all PassiveIntent events via usePassiveIntent() and keeps a
 * rolling 100-entry log. Requires a <PassiveIntentProvider> ancestor.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import type { IntentEventName } from '@passiveintent/react';

// ─── Log entry ────────────────────────────────────────────────────────────────

export interface LogEntry {
  id: number;
  eventName: string;
  data: unknown;
  time: string;
}

type LogAction = { type: 'ADD'; entry: Omit<LogEntry, 'id'> } | { type: 'CLEAR' };

interface LogState {
  entries: LogEntry[];
  seq: number;
}

function logReducer(state: LogState, action: LogAction): LogState {
  switch (action.type) {
    case 'ADD':
      return {
        entries: [{ ...action.entry, id: state.seq + 1 }, ...state.entries].slice(0, 100),
        seq: state.seq + 1,
      };
    case 'CLEAR':
      return { entries: [], seq: 0 };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface LogCtx {
  logEntries: LogEntry[];
  clearLog: () => void;
}

const LogContext = createContext<LogCtx | null>(null);

// ─── Events to capture ────────────────────────────────────────────────────────

const ALL_EVENTS: IntentEventName[] = [
  'state_change',
  'high_entropy',
  'trajectory_anomaly',
  'dwell_time_anomaly',
  'bot_detected',
  'hesitation_detected',
  'session_stale',
  'attention_return',
  'user_idle',
  'user_resumed',
  'exit_intent',
  'conversion',
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LogProvider({ children }: { children: ReactNode }) {
  const { on } = usePassiveIntent();
  const [{ entries: logEntries }, dispatch] = useReducer(logReducer, { entries: [], seq: 0 });

  useEffect(() => {
    const unsubs = ALL_EVENTS.map((ev) =>
      on(ev as IntentEventName, (payload) => {
        dispatch({
          type: 'ADD',
          entry: {
            eventName: ev,
            data: payload,
            time: new Date().toLocaleTimeString(),
          },
        });
      }),
    );
    return () => unsubs.forEach((u) => u());
    // on is useCallback([]) — stable across renders, intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearLog = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  return <LogContext.Provider value={{ logEntries, clearLog }}>{children}</LogContext.Provider>;
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useLogContext(): LogCtx {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogContext must be used inside <LogProvider>');
  return ctx;
}
