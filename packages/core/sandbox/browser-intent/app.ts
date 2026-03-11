/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sandbox for createBrowserIntent() (Layer 3 factory).
 *
 * Used by the Cypress E2E spec `cypress/e2e/browser-intent.cy.ts`.
 * Exposes the engine as `window.__engine` so Cypress can drive it directly.
 * Event log items are written to `#event-log` for DOM assertions.
 */

import { createBrowserIntent, type IntentEngine } from '../../src/index.js';

const engine: IntentEngine = createBrowserIntent({
  storageKey: 'passive-intent-browser-test',
  // Low divergence threshold so trajectory_anomaly can fire easily in tests
  // when a baseline is provided.  No baseline here — just testing the factory
  // wiring and basic event plumbing.
});

/* ── DOM helpers ──────────────────────────────────────────────────────── */

const eventLog = document.getElementById('event-log') as HTMLUListElement;

function appendEvent(type: string, detail: string): void {
  const li = document.createElement('li');
  li.dataset.event = type;
  li.textContent = `${type}: ${detail}`;
  eventLog.appendChild(li);
}

/* ── Event subscriptions ──────────────────────────────────────────────── */

engine.on('state_change', ({ to }) => {
  appendEvent('state_change', to);
});

engine.on('high_entropy', ({ state }) => {
  appendEvent('high_entropy', state);
});

engine.on('trajectory_anomaly', ({ zScore }) => {
  appendEvent('trajectory_anomaly', String(zScore));
});

/* ── Expose for Cypress ───────────────────────────────────────────────── */

(window as typeof window & { __engine: IntentEngine }).__engine = engine;
