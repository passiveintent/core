/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * E2E spec for createBrowserIntent() — Layer 3 factory.
 *
 * These tests verify that the factory returns a fully configured IntentManager
 * with browser-standard adapters and that real browser interactions produce the
 * expected intent signals.  They complement the unit tests in
 * microkernel.test.mjs, which mock every adapter; here everything is real:
 * actual DOM, actual localStorage, actual event plumbing.
 *
 * Sandbox: sandbox/browser-intent/index.html
 * Engine exposed at: window.__engine
 * DOM assertions target: [data-cy="event-log"] [data-event="<type>"]
 */

// export {} makes this file a module so declare global is valid (avoids TS2669).
export {};

// Extend the Window type so TypeScript is happy accessing __engine
interface IntentManagerLike {
  track(state: string): void;
  destroy(): void;
  getTelemetry(): { sessionId: string; transitionsEvaluated: number };
}

declare global {
  interface Window {
    __engine: IntentManagerLike;
  }
}

describe('createBrowserIntent() — Layer 3 browser integration', () => {
  beforeEach(() => {
    cy.visit('/sandbox/browser-intent/index.html', {
      onBeforeLoad: (win) => {
        win.localStorage.removeItem('passiveintent:passive-intent-browser-test');
      },
    });

    // Wait until the ESM module has loaded and the sandbox's explicit
    // engine.track(pathname) has fired — this guarantees window.__engine is ready.
    cy.get('[data-cy="event-log"] [data-event="state_change"]').should('have.length.at.least', 1);
  });

  // =========================================================================
  // Factory wiring
  // =========================================================================

  it('emits an initial state_change from the explicit track() on page load', () => {
    // The sandbox calls engine.track(window.location.pathname) after construction.
    // Read the actual pathname at runtime so the assertion is not coupled to the
    // sandbox's file path or the dev-server's base URL configuration.
    cy.location('pathname').then((pathname) => {
      cy.get('[data-cy="event-log"] [data-event="state_change"]')
        .first()
        .should('contain.text', pathname);
    });
  });

  // =========================================================================
  // Manual track() path
  // =========================================================================

  it('engine.track() emits a state_change for the given route', () => {
    cy.window().then((win) => {
      win.__engine.track('/products');
    });
    cy.get('[data-cy="event-log"] [data-event="state_change"]')
      .last()
      .should('contain.text', '/products');
  });

  it('engine.track() accumulates multiple state_change events', () => {
    cy.window().then((win) => {
      win.__engine.track('/search');
      win.__engine.track('/product/detail');
      win.__engine.track('/cart');
    });
    // 1 initial track() on page load + 3 manual tracks = at least 4
    cy.get('[data-cy="event-log"] [data-event="state_change"]').should('have.length.at.least', 4);
    cy.get('[data-cy="event-log"] [data-event="state_change"]')
      .last()
      .should('contain.text', '/cart');
  });

  // =========================================================================
  // Full IntentManager API surface
  // =========================================================================

  it('getTelemetry() returns a valid telemetry snapshot', () => {
    cy.window().then((win) => {
      const telemetry = win.__engine.getTelemetry();
      expect(telemetry).to.have.property('sessionId').that.is.a('string');
      expect(telemetry).to.have.property('transitionsEvaluated').that.is.a('number');
    });
  });

  // =========================================================================
  // LocalStorageAdapter — persistence
  // =========================================================================

  it('persists state to localStorage after the first track()', () => {
    cy.window().then((win) => {
      win.__engine.track('/checkout');
    });
    cy.window().then((win) => {
      const stored = win.localStorage.getItem('passiveintent:passive-intent-browser-test');
      expect(stored).to.not.be.null;
      // Wire format: JSON with bloomBase64 + graphBinary keys
      expect(stored).to.include('bloomBase64');
      expect(stored).to.include('graphBinary');
    });
  });

  // =========================================================================
  // destroy() teardown
  // =========================================================================

  it('destroy() does not throw', () => {
    cy.window().then((win) => {
      expect(() => win.__engine.destroy()).to.not.throw();
    });
  });

  it('after destroy(), track() calls no longer add state_change entries', () => {
    cy.window().then((win) => {
      win.__engine.destroy();

      // Record the log length right after destroy.
      const countBefore = win.document.querySelectorAll('[data-event="state_change"]').length;

      // track() after destroy — the removed listeners must NOT fire.
      win.__engine.track('/after-destroy');

      const countAfter = win.document.querySelectorAll('[data-event="state_change"]').length;

      expect(countAfter).to.equal(countBefore);
    });
  });
});
