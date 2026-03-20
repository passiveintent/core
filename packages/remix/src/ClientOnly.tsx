/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Prevents browser-only hooks and DOM APIs from executing during SSR or
 * the initial hydration pass. Children are rendered only after the component
 * mounts in the browser.
 *
 * Use this to wrap any PassiveIntent hooks that touch browser globals
 * (usePredictiveLink injects <link> tags, useBloomFilter uses atob, etc.).
 *
 * @example
 * <ClientOnly fallback={<Skeleton />}>
 *   <PropensityBadge targetState="/checkout" />
 * </ClientOnly>
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
