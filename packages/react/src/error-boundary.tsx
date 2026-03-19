/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import type { ReactNode } from 'react';

export interface IntentErrorBoundaryProps {
  /**
   * Rendered when `PassiveIntentProvider` fails to initialise the engine or
   * when a child component throws during render. Receives the caught error and
   * a `reset` callback that clears the error state and re-mounts children.
   *
   * Defaults to an accessible alert box with a "Retry" button.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * `IntentErrorBoundary` — library-level error boundary for
 * `PassiveIntentProvider`.
 *
 * Place it **around** `<PassiveIntentProvider>` to catch errors thrown by the
 * synchronous `IntentManager` constructor (e.g. invalid config, restricted
 * storage origin) and prevent them from crashing the entire React tree.
 *
 * When the constructor throws and no `onError` prop is set on the provider,
 * the error propagates to the nearest error boundary — this component. When
 * `onError` is set, the provider swallows the error (engine stays null, all
 * hooks return safe zero-value snapshots), so this boundary only triggers on
 * rendering errors thrown by child components.
 *
 * @example
 * ```tsx
 * <IntentErrorBoundary
 *   fallback={(err, reset) => (
 *     <div>Analytics unavailable. <button onClick={reset}>Retry</button></div>
 *   )}
 * >
 *   <PassiveIntentProvider config={...}>
 *     <App />
 *   </PassiveIntentProvider>
 * </IntentErrorBoundary>
 * ```
 */
export class IntentErrorBoundary extends Component<IntentErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      return this.props.fallback ? (
        this.props.fallback(error, this.reset)
      ) : (
        <div role="alert" aria-live="assertive" aria-atomic="true">
          <strong>[PassiveIntent]</strong> Failed to initialise: <code>{error.message}</code>{' '}
          <button type="button" onClick={this.reset}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
