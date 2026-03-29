# Changelog — @passiveintent/remix

All notable changes to this package are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This package adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] — 2026-03-29

### Fixed

- **`useRoutePassiveIntent` — stale `track` closure removed** — the `useEffect` previously suppressed `react-hooks/exhaustive-deps` to avoid listing `intent` as a dependency, risking a stale closure if the context object changed identity. Replaced with a `useRef`-based stable callback pattern: `trackRef.current` is updated to `intent.track` on every render, and the effect calls `trackRef.current(pathname)`. The effect dependency array is now `[pathname]` with no lint suppression. Observable behaviour is unchanged: `track(pathname)` fires exactly once per pathname change, never on unrelated re-renders.

- **`createIntentClientLoader(true)` — diagnostic error wrapping** — when `mergeServerData: true` and the route has no `export const loader`, Remix's `serverLoader()` throws a generic error with no mention of PassiveIntent. The error is now caught and rethrown with a message that names `createIntentClientLoader` as the source, states that `mergeServerData: true` requires a server loader export on the same route, and includes the original error message as context.

### Added

- **`withPassiveIntent` — dev-only config-change warning** — `withPassiveIntent` captures `config` at HOC creation time and does not re-read it on re-renders (by design — the `PassiveIntentProvider` is mounted once). A `console.warn` now fires in development when the `config` object reference changes between renders, clearly explaining that config is frozen at HOC creation time and instructing the user to remount via a `key` change to apply new config. Suppressed in `NODE_ENV=production`.

### Tests

- Test suite expanded from 57 to 63 tests:
  - `useRoutePassiveIntent` — 2 new tests covering the `trackRef` forwarding mechanism
  - `withPassiveIntent` — 3 new tests covering the dev config-change warning (fires on change, stable, production suppression)
  - `loaders` — 1 additional test asserting the original error message is included in the wrapped diagnostic

---

## [1.0.1] — 2026-03-21

### Fixed

- **`usePropensityScore` call in examples** — corrected the API reference example in the README to use the current hook signature.

---

## [1.0.0] — 2026-03-20

Initial public release.

### Added

- **`withPassiveIntent(Component, config?)`** — Higher-order component that wraps a Remix root
  component in `<ClientOnly><PassiveIntentProvider>`. Designed for `app/root.tsx`. Sets
  `displayName` correctly for React DevTools, including anonymous and display-name-overridden
  components.

- **`useRoutePassiveIntent(pathname)`** — Hook that automatically calls `track(pathname)` when
  the pathname changes. Returns the full `usePassiveIntent()` context (all 9 methods) so callers
  can also subscribe to intent events without a second hook call. Drop-in for Remix/Hydrogen
  `app/root.tsx` usage with `useLocation().pathname`.

- **`<ClientOnly fallback?>`** — SSR/hydration-safe wrapper component. Children are rendered only
  after the component mounts in the browser (`useEffect` + `useState` pattern). Prevents
  browser-only PassiveIntent hooks (`usePredictiveLink`, `useBloomFilter`, `useMarkovGraph`) from
  executing during SSR.

- **`createIntentClientLoader(mergeServerData?)`** — Factory for Remix `clientLoader` functions.
  - `mergeServerData = false` (default): returns `null`, skips the server entirely.
  - `mergeServerData = true`: delegates to `serverLoader()` and returns its result, enabling
    hybrid routes with server-fetched data alongside client-side intent tracking.

- **Dual SSR-safe entry points** following the Sentry multi-framework SDK pattern:
  - `index.client.ts` — full `@passiveintent/react` re-export + all Remix helpers. Loaded by
    the browser via the `"import"` export condition.
  - `index.server.ts` — type exports + `MemoryStorageAdapter` + `createIntentClientLoader` only.
    No React hooks, no `window` references. Loaded by Node.js/Cloudflare Workers via the `"node"`
    export condition in `package.json#exports`.

- **Full test suite** — 57 tests across 5 files (vitest + @testing-library/react, jsdom):
  - `tests/exports.test.ts` — guards public API surface (23 tests)
  - `tests/loaders.test.ts` — `createIntentClientLoader` contracts (9 tests)
  - `tests/client-only.test.tsx` — `<ClientOnly>` SSR/hydration behaviour (7 tests)
  - `tests/with-passive-intent.test.tsx` — `withPassiveIntent` HOC contracts (11 tests)
  - `tests/use-route-passive-intent.test.tsx` — `useRoutePassiveIntent` tracking contracts (7 tests)

### Peer dependencies

| Package                     | Required version                                                |
| --------------------------- | --------------------------------------------------------------- |
| `react`                     | `>=18.0.0`                                                      |
| `react-dom`                 | `>=18.0.0`                                                      |
| `@passiveintent/react`      | `^1.2.0`                                                        |
| `@remix-run/react`          | `>=2.0.0` (optional — adapter does not import from it directly) |
| `@remix-run/server-runtime` | `>=2.0.0` (optional)                                            |

### Notes

- Targets ES2020. Fully tree-shakeable (`"sideEffects": false`).
- `@remix-run/react` and `@remix-run/server-runtime` are marked `optional` in
  `peerDependenciesMeta` to avoid install errors in monorepos that use React 19 while
  `@remix-run/react@2.x` declares a `react@^18` peer requirement.
- `useRoutePassiveIntent` accepts a plain `string` pathname (not a Remix `Location` object) so
  it is not coupled to `@remix-run/react` and works with any router.
