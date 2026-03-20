# @passiveintent/remix

Remix and Shopify Hydrogen adapter for [PassiveIntent](https://passiveintent.dev) — privacy-first,
client-side intent tracking with zero server-side data exposure.

Built on top of [`@passiveintent/react`](../react) with SSR-safe dual entry points following the
[Sentry multi-framework SDK pattern](https://docs.sentry.io/platforms/).

[![npm version](https://img.shields.io/npm/v/@passiveintent/remix)](https://www.npmjs.com/package/@passiveintent/remix)
[![license](https://img.shields.io/badge/license-AGPL--3.0-blue)](../../LICENSE)

---

## Table of contents

- [Why a Remix adapter?](#why-a-remix-adapter)
- [Installation](#installation)
- [Quick start — Remix](#quick-start--remix)
- [Quick start — Shopify Hydrogen](#quick-start--shopify-hydrogen)
- [API reference](#api-reference)
  - [withPassiveIntent](#withpassiveintent)
  - [useRoutePassiveIntent](#useroutepassiveintent)
  - [ClientOnly](#clientonly)
  - [createIntentClientLoader](#createintentclientloader)
- [Server entry](#server-entry)
- [Architecture](#architecture)
- [FAQ](#faq)

---

## Why a Remix adapter?

Remix loaders and actions run on the server. Passive intent tracking is inherently a client-side
concern — it models the user's in-browser behaviour (scroll depth, exit intent, idle time, Markov
state transitions). Sending tracking signals to the server adds latency, creates a GDPR/CCPA
surface, and defeats the purpose of privacy-first design.

This adapter solves that with:

| Problem                               | Solution                                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| Loaders run on server                 | `createIntentClientLoader` — runs exclusively in the browser |
| Hooks crash during SSR                | `<ClientOnly>` — renders children only after hydration       |
| Provider must be in a client boundary | `withPassiveIntent` HOC — wraps your root component          |
| Route changes need tracking           | `useRoutePassiveIntent` — one hook, automatic tracking       |

---

## Installation

```bash
npm install @passiveintent/remix @passiveintent/react
```

Peer dependencies (required in your app, not this package):

```bash
npm install react react-dom @remix-run/react
```

---

## Quick start — Remix

### 1. Wrap your root component

```tsx
// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { withPassiveIntent } from '@passiveintent/remix';

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default withPassiveIntent(App, {
  maxStates: 200,
  debug: process.env.NODE_ENV === 'development',
});
```

### 2. Auto-track route changes

```tsx
// app/root.tsx — inside the App component
import { useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import { withPassiveIntent, useRoutePassiveIntent } from '@passiveintent/remix';

function App() {
  const { pathname } = useLocation();
  const { on } = useRoutePassiveIntent(pathname);

  useEffect(() => {
    return on('exit_intent', ({ likelyNext }) => {
      // prefetch the predicted next page
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = likelyNext ?? '';
      document.head.appendChild(link);
    });
  }, [on]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default withPassiveIntent(App, { maxStates: 200 });
```

### 3. Use client-only data loading in routes

For routes that show intent-driven UI (propensity scores, predictive links), skip the server
round-trip entirely:

```tsx
// app/routes/products.$handle.tsx
import {
  ClientOnly,
  usePassiveIntent,
  usePropensity,
  createIntentClientLoader,
} from '@passiveintent/remix';

export const clientLoader = createIntentClientLoader();
export const HydrateFallback = () => <div>Loading...</div>;

export default function ProductPage() {
  return (
    <ClientOnly fallback={<ProductSkeleton />}>
      <ProductWithIntent />
    </ClientOnly>
  );
}

function ProductWithIntent() {
  const { track, on } = usePassiveIntent();
  const { score } = usePropensity({ targetState: '/checkout' });
  // ...
}
```

### 4. Merge server data when needed

```tsx
// app/routes/products.$handle.tsx
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createIntentClientLoader } from '@passiveintent/remix';

// Server loader fetches product data
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const product = await fetchProduct(params.handle);
  return json({ product });
};

// clientLoader merges server data with client-side intent initialisation
export const clientLoader = createIntentClientLoader(true);

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  // product is available; intent tracking runs client-side
}
```

---

## Quick start — Shopify Hydrogen

Hydrogen is a Remix-based framework. The integration is identical, with one note: Hydrogen apps
often use React Server Components. Keep `withPassiveIntent` and `useRoutePassiveIntent` in
**client components** (`"use client"` files).

```tsx
// app/root.tsx
import { useLocation } from '@remix-run/react';
import { withPassiveIntent, useRoutePassiveIntent } from '@passiveintent/remix';

function Root() {
  const { pathname } = useLocation();
  useRoutePassiveIntent(pathname);

  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default withPassiveIntent(Root, {
  maxStates: 300,
  debug: false,
});
```

**Product page with propensity scoring:**

```tsx
// app/routes/products.$handle.tsx
import { ClientOnly, usePropensity, createIntentClientLoader } from '@passiveintent/remix';
export const clientLoader = createIntentClientLoader(true);

export default function ProductPage() {
  return (
    <ClientOnly fallback={<ProductSkeleton />}>
      <ProductContent />
    </ClientOnly>
  );
}

function ProductContent() {
  const { score } = usePropensity({ targetState: '/checkout' });

  return (
    <div>
      <ProductDetails />
      {score > 0.7 && <HighIntentBanner />}
    </div>
  );
}
```

---

## API reference

### `withPassiveIntent`

Higher-order component that wraps a Remix root component in
`<ClientOnly><PassiveIntentProvider>`. Apply once to your `app/root.tsx` default export.

```ts
function withPassiveIntent<P extends object>(
  Component: ComponentType<P>,
  config?: IntentManagerConfig,
): ComponentType<P>;
```

| Parameter   | Type                  | Default | Description                                 |
| ----------- | --------------------- | ------- | ------------------------------------------- |
| `Component` | `ComponentType<P>`    | —       | The root component to wrap                  |
| `config`    | `IntentManagerConfig` | `{}`    | Config forwarded to `PassiveIntentProvider` |

The wrapped component is given the `displayName` `withPassiveIntent(ComponentName)` for React
DevTools.

---

### `useRoutePassiveIntent`

Automatically calls `track(pathname)` when the pathname changes, and returns the full
`usePassiveIntent()` context.

```ts
function useRoutePassiveIntent(pathname: string): UsePassiveIntentReturn;
```

Must be called inside a `<PassiveIntentProvider>` boundary (i.e. inside a component wrapped
with `withPassiveIntent`, or inside a `<PassiveIntentProvider>` directly).

```tsx
const { pathname } = useLocation(); // from @remix-run/react
const { on, predictNextStates } = useRoutePassiveIntent(pathname);
```

---

### `ClientOnly`

Renders `children` only after the component has mounted in the browser. Prevents browser-only
hooks and APIs (DOM manipulation, `localStorage`, etc.) from executing during SSR or the initial
hydration pass.

```tsx
interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode; // default: null
}
```

```tsx
<ClientOnly fallback={<Skeleton />}>
  <PropensityDashboard />
</ClientOnly>
```

---

### `createIntentClientLoader`

Creates a Remix `clientLoader` that runs exclusively in the browser.

```ts
function createIntentClientLoader(mergeServerData?: boolean): ClientLoader;
```

| `mergeServerData` | Behaviour                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `false` (default) | Returns `null` — no server round-trip. Use when the route shows only intent-driven UI.                                         |
| `true`            | Calls `serverLoader()` and returns its result. Use when you need server data (e.g. product details) alongside intent tracking. |

When `mergeServerData` is `false` (default), export a `HydrateFallback` to avoid a flash of
empty content:

```tsx
export const clientLoader = createIntentClientLoader();
export const HydrateFallback = () => <Spinner />;
```

---

## Server entry

When imported in a Remix loader or action (Node.js context), this package automatically resolves
to its server entry point via the `"node"` condition in `package.json#exports`. The server entry
exports only:

- Type definitions (`IntentManagerConfig`, `PassiveIntentTelemetry`, etc.)
- `MemoryStorageAdapter` — server-safe storage implementation
- `createIntentClientLoader` — the factory function itself is safe on the server; the returned
  clientLoader function runs in the browser

No React hooks, no `window` references, no browser APIs.

```ts
// In a Remix loader — resolves to index.server.ts automatically
import type { IntentManagerConfig } from '@passiveintent/remix';
import { createIntentClientLoader } from '@passiveintent/remix';
```

---

## Architecture

```text
@passiveintent/remix
├── index.server.ts   ← loaded by Node.js (Remix loaders/actions)
│     Types + MemoryStorageAdapter + createIntentClientLoader
│
└── index.client.ts   ← loaded by the browser (Remix client runtime)
      @passiveintent/react (all hooks, provider, components)
      + ClientOnly
      + withPassiveIntent
      + createIntentClientLoader
      + useRoutePassiveIntent
```

The `"node"` export condition in `package.json` routes server imports to `index.server.ts` and
browser imports to `index.client.ts`. This mirrors the [Sentry SDK dual-entry
pattern](https://github.com/getsentry/sentry-javascript/tree/develop/packages/remix).

---

## FAQ

**Q: Can I use this without `withPassiveIntent`?**

Yes. Use `<PassiveIntentProvider config={...}>` directly from `@passiveintent/react`, then wrap
any browser-only components in `<ClientOnly>`. `withPassiveIntent` is a convenience HOC for
the common Remix `app/root.tsx` pattern.

**Q: Does this work with Remix v1?**

The adapter targets Remix v2+. `clientLoader` is a v2 feature.

**Q: Why is `@remix-run/react` listed as an optional peer dependency?**

The adapter does not import from `@remix-run/react` — `useRoutePassiveIntent` accepts a plain
`string` pathname so it works with any router. `@remix-run/react` is listed as a peer only to
signal compatibility; you must install it in your app.

**Q: Does intent data leave the browser?**

No. `@passiveintent/core` stores all Markov state, bloom filter, and telemetry data in
`localStorage` by default. No network requests are made unless you configure a custom
`StorageAdapter` that does so.
