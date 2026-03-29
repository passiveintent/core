/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Remix clientLoader utilities for PassiveIntent.
 *
 * Remix route loaders run on the server — PassiveIntent tracking is
 * purely client-side. These helpers let you opt individual routes into
 * client-only data fetching so intent signals never leak to the server.
 */

/**
 * Creates a Remix `clientLoader` that runs exclusively in the browser.
 *
 * By default it returns `null` (no server data needed for intent tracking).
 * Pass an optional `serverFallback` to merge server data with client-side
 * loading (e.g. product data fetched server-side, intent initialised client-side).
 *
 * @example — intent-only route (no server data)
 * export const clientLoader = createIntentClientLoader();
 * export const HydrateFallback = () => <Spinner />;
 *
 * @example — merge with server loader data
 * export const loader = async () => json({ product: await fetchProduct() });
 * export const clientLoader = createIntentClientLoader(true);
 *
 * @throws {Error} When `mergeServerData` is `true` and the route has no
 * `export const loader` — Remix's `serverLoader()` will throw in that case.
 * The error is rethrown with a message that identifies `createIntentClientLoader`
 * as the source and instructs the caller to add a server loader export.
 */
export function createIntentClientLoader(mergeServerData = false) {
  return async function clientLoader({ serverLoader }: { serverLoader: () => Promise<unknown> }) {
    if (mergeServerData) {
      try {
        return await serverLoader();
      } catch (err) {
        const original = err instanceof Error ? err.message : String(err);
        throw new Error(
          `[createIntentClientLoader] mergeServerData: true requires a server loader export ` +
            `on the same route (e.g. \`export const loader = ...\`). ` +
            `Original error: ${original}`,
        );
      }
    }
    return null;
  };
}
