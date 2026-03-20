/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PassiveIntentModule — PLACEHOLDER
 *
 * Target: SAP Spartacus / Composable Storefront (NgModule-based apps)
 *
 * Planned architecture:
 * ─────────────────────────────────────────────────────────────────────────────
 *  @NgModule({
 *    imports: [CommonModule],
 *    providers: [],   // populated by forRoot()
 *    exports: [],     // export directives/pipes when added
 *  })
 *  export class PassiveIntentModule {
 *    static forRoot(config?: IntentManagerConfig): ModuleWithProviders<PassiveIntentModule> {
 *      return {
 *        ngModule: PassiveIntentModule,
 *        providers: [
 *          PassiveIntentService,
 *          { provide: PASSIVE_INTENT_CONFIG, useValue: config ?? {} },
 *        ],
 *      };
 *    }
 *  }
 *
 * Usage:
 *  PassiveIntentModule.forRoot({ maxStates: 200, debug: false })
 */

/** Placeholder — not yet implemented. */
export const PassiveIntentModule = null;
