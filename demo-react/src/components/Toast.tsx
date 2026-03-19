/**
 * Toast — lightweight ephemeral notification system.
 *
 * Follows the same context + useReducer pattern as LogContext.
 * Toasts auto-dismiss after 2200 ms. Stack up to 4.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastEntry {
  id: number;
  message: string;
  variant: 'success' | 'info' | 'warning';
  icon?: string;
}

interface ToastCtx {
  toast: (message: string, variant?: ToastEntry['variant'], icon?: string) => void;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action = { type: 'ADD'; entry: ToastEntry } | { type: 'REMOVE'; id: number };

function reducer(state: ToastEntry[], action: Action): ToastEntry[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.entry].slice(-4); // max 4 visible
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const Ctx = createContext<ToastCtx | null>(null);

const AUTO_DISMISS_MS = 2200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const seqRef = useRef(0);

  const toast = useCallback(
    (message: string, variant: ToastEntry['variant'] = 'info', icon?: string) => {
      const id = ++seqRef.current;
      dispatch({ type: 'ADD', entry: { id, message, variant, icon } });
      setTimeout(() => dispatch({ type: 'REMOVE', id }), AUTO_DISMISS_MS);
    },
    [],
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="toast-portal" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.variant}`} role="status">
            {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
