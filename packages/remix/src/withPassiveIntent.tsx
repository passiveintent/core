/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, type ComponentType } from 'react';
import { PassiveIntentProvider, type IntentManagerConfig } from '@passiveintent/react';
import { ClientOnly } from './ClientOnly.js';

/**
 * Higher-order component that wraps a Remix root component with
 * PassiveIntentProvider inside a ClientOnly boundary.
 *
 * Apply this to your Remix `app/root.tsx` default export so intent tracking
 * initialises once per session on the client, never on the server.
 *
 * @example
 * // app/root.tsx
 * import { withPassiveIntent } from '@passiveintent/remix';
 *
 * function App() { ... }
 * export default withPassiveIntent(App, { maxStates: 200 });
 */
export function withPassiveIntent<P extends object>(
  Component: ComponentType<P>,
  config: IntentManagerConfig = {},
) {
  function PassiveIntentRoot(props: P) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const configRef = useRef(config);
      if (!Object.is(configRef.current, config)) {
        console.warn(
          '[PassiveIntent] The config passed to withPassiveIntent() has changed between renders, ' +
          'but config is frozen at HOC creation time and the new value will have no effect. ' +
          'To apply a new config, remount the component by changing its `key` prop.',
        );
      }
    }

    return (
      <ClientOnly>
        <PassiveIntentProvider config={config}>
          <Component {...props} />
        </PassiveIntentProvider>
      </ClientOnly>
    );
  }

  const displayName = Component.displayName || Component.name || 'Component';
  PassiveIntentRoot.displayName = `withPassiveIntent(${displayName})`;

  return PassiveIntentRoot;
}
