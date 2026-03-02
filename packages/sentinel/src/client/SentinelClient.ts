import { IntentManager } from '@passiveintent/core';
import type { IntentManagerConfig } from '@passiveintent/core';
import { TrustOrchestrator } from '../orchestrator/TrustOrchestrator.js';
import type { TrustConfig } from '../orchestrator/TrustOrchestrator.js';

export interface SentinelConfig {
  /** Config forwarded verbatim to the underlying {@link IntentManager}. */
  intentManager?: IntentManagerConfig;
  /** Initial trust score configuration. */
  trust?: TrustConfig;
  /**
   * Risk penalty applied to the trust score each time the core engine fires
   * an anomaly event. Defaults to 0.1.
   */
  anomalyPenalty?: number;
}

/**
 * SentinelClient — security orchestrator that wraps {@link IntentManager}
 * and maintains a continuous zero-trust score via {@link TrustOrchestrator}.
 *
 * Subscribes to anomaly events emitted by the core engine and translates them
 * into risk penalties fed to the trust orchestrator.
 */
export class SentinelClient {
  private readonly intentManager: IntentManager;
  private readonly orchestrator: TrustOrchestrator;
  private readonly unsubscribers: Array<() => void> = [];

  constructor(config: SentinelConfig = {}) {
    const anomalyPenalty = config.anomalyPenalty ?? 0.1;

    this.intentManager = new IntentManager(config.intentManager ?? {});
    this.orchestrator = new TrustOrchestrator(config.trust ?? {});

    // Subscribe to all core anomaly events and translate them into penalties.
    for (const event of [
      'high_entropy',
      'trajectory_anomaly',
      'dwell_time_anomaly',
    ] as const) {
      const unsub = this.intentManager.on(event, () => {
        this.orchestrator.calculateTrust(anomalyPenalty, 0);
      });
      this.unsubscribers.push(unsub);
    }
  }

  /** The underlying core {@link IntentManager} instance. */
  getIntentManager(): IntentManager {
    return this.intentManager;
  }

  /** The {@link TrustOrchestrator} that maintains the continuous trust score. */
  getOrchestrator(): TrustOrchestrator {
    return this.orchestrator;
  }

  /** Current trust score (0.0 – 1.0). */
  getTrustScore(): number {
    return this.orchestrator.getTrustScore();
  }

  /** Remove all anomaly listeners and destroy the underlying IntentManager. */
  destroy(): void {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers.length = 0;
    this.intentManager.destroy();
  }
}
