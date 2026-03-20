# Changelog — @passiveintent/remix

All notable changes to this package are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This package adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
