/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PassiveIntentService — PLACEHOLDER
 *
 * Target: SAP Spartacus / Composable Storefront (Angular 15+, NgModule-based)
 *
 * Planned architecture:
 * ─────────────────────────────────────────────────────────────────────────────
 *  @Injectable({ providedIn: 'root' })
 *  export class PassiveIntentService implements OnDestroy {
 *    private manager: IntentManager;
 *
 *    // Public observable streams — bridged from IntentManager.on() callbacks
 *    readonly intentEvents$: Observable<IntentEvent>;
 *    readonly exitIntent$: Observable<ExitIntentPayload>;
 *    readonly idle$: Observable<IdlePayload>;
 *    readonly attentionReturn$: Observable<AttentionReturnPayload>;
 *    readonly propensity$: (targetState: string) => Observable<number>;
 *
 *    track(state: string): void { ... }
 *    ngOnDestroy(): void { this.manager.destroy(); }
 *  }
 *
 * Bridge pattern (IntentManager → RxJS):
 *   private bridge<T>(eventName: IntentEventName): Observable<T> {
 *     return new Observable(subscriber => {
 *       const unsub = this.manager.on(eventName, payload => subscriber.next(payload));
 *       return () => unsub();
 *     });
 *   }
 *
 * Build considerations:
 * ─────────────────────────────────────────────────────────────────────────────
 *  - Requires ng-packagr (Angular Package Format) — NOT tsup
 *  - Output: FESM2020 + UMD (required by Angular library consumers)
 *  - Spartacus uses NgModules (not standalone components)
 *  - ng-packagr config: ng-package.json → { "lib": { "entryFile": "src/index.ts" } }
 *  - Build command: ng build @passiveintent/angular (Angular CLI workspace) or
 *                   npx ng-packagr -p ng-package.json
 *
 * Spartacus / Composable Storefront integration:
 * ─────────────────────────────────────────────────────────────────────────────
 *  import { PassiveIntentModule } from '@passiveintent/angular';
 *
 *  @NgModule({
 *    imports: [
 *      PassiveIntentModule.forRoot({ maxStates: 200 }),
 *      ...
 *    ]
 *  })
 *  export class AppModule {}
 *
 *  // In a component:
 *  constructor(private intent: PassiveIntentService) {}
 *  ngOnInit() {
 *    this.intent.exitIntent$.subscribe(payload => this.showRetentionModal(payload));
 *    this.intent.track('/product/' + this.product.code);
 *  }
 */

import type { Observable } from 'rxjs';

export interface PassiveIntentServiceStub {
  intentEvents$: Observable<unknown>;
  exitIntent$: Observable<unknown>;
  idle$: Observable<unknown>;
  attentionReturn$: Observable<unknown>;
  track(state: string): void;
  destroy(): void;
}

/** Placeholder — not yet implemented. @see PassiveIntentServiceStub for planned API. */
export const PassiveIntentService = null as unknown as new () => PassiveIntentServiceStub;
