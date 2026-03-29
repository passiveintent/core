/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useRef } from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import type { UsePassiveIntentReturn } from '@passiveintent/react';

/**
 * `useRoutePassiveIntent` — automatic route-change tracking for Remix and
 * Shopify Hydrogen apps.
 *
 * Calls `track(pathname)` on the shared `PassiveIntentProvider` instance
 * every time the supplied `pathname` changes, then returns the full
 * `usePassiveIntent()` context so you can also subscribe to intent events
 * from the same component.
 *
 * **Recommended placement**: render this once in your Remix `app/root.tsx`
 * (inside the component that `withPassiveIntent` wraps), or in a dedicated
 * `<PassiveIntentTracker />` component mounted inside the provider boundary.
 *
 * @param pathname - The current route path, typically from Remix's
 *   `useLocation().pathname`. Must be a stable string — a new string value
 *   triggers the tracking effect.
 *
 * @returns The full `UsePassiveIntentReturn` object so callers can also
 *   subscribe to intent events (e.g. `exit_intent`, `high_entropy`) without
 *   a second `usePassiveIntent()` call.
 *
 * @example — Remix root.tsx
 * ```tsx
 * import { useLocation } from '@remix-run/react';
 * import { useRoutePassiveIntent } from '@passiveintent/remix';
 *
 * function App() {
 *   const { pathname } = useLocation();
 *   const { on } = useRoutePassiveIntent(pathname);
 *
 *   useEffect(() => {
 *     return on('exit_intent', ({ likelyNext }) => {
 *       // prefetch the predicted next page
 *       const link = document.createElement('link');
 *       link.rel = 'prefetch';
 *       link.href = likelyNext ?? '';
 *       document.head.appendChild(link);
 *     });
 *   }, [on]);
 *
 *   return <Outlet />;
 * }
 *
 * export default withPassiveIntent(App, { maxStates: 200 });
 * ```
 *
 * @example — Shopify Hydrogen (Remix-based)
 * ```tsx
 * // app/root.tsx
 * import { useLocation } from '@remix-run/react';
 * import { withPassiveIntent, useRoutePassiveIntent } from '@passiveintent/remix';
 *
 * function Root() {
 *   const { pathname } = useLocation();
 *   useRoutePassiveIntent(pathname);
 *   return <Layout><Outlet /></Layout>;
 * }
 *
 * export default withPassiveIntent(Root, { maxStates: 300, debug: false });
 * ```
 */
export function useRoutePassiveIntent(pathname: string): UsePassiveIntentReturn {
  const intent = usePassiveIntent();
  const trackRef = useRef(intent.track);
  trackRef.current = intent.track;

  useEffect(() => {
    trackRef.current(pathname);
  }, [pathname]);

  return intent;
}
