/**
 * Structurally compatible subset of the core EnginePolicy interface.
 * Defined locally because @passiveintent/core does not yet export the
 * EnginePolicy type as part of its public API.
 */
export interface EnginePolicy {
  onTrackStart?(now: number): void;
  onTrackContext?(ctx: PolicyTrackContext): void;
  onTransition?(from: string, to: string, trajectory: readonly string[]): void;
  onAfterEvaluation?(from: string, to: string): void;
  onCounterIncrement?(key: string, by: number): void;
  destroy?(): void;
}

export interface PolicyTrackContext {
  readonly state: string;
  readonly now: number;
  readonly from: string | null;
}

/**
 * VelocityScrapingPolicy — example custom security policy for sentinel.
 *
 * Detects suspiciously fast navigation (velocity scraping) by counting
 * state transitions within a sliding time window.  When the transition
 * rate exceeds the configured threshold the policy increments an internal
 * violation counter that the host application can inspect.
 *
 * This stub demonstrates the {@link EnginePolicy} interface pattern so that
 * external security rules can be composed with the core engine once
 * @passiveintent/core exposes a public injection mechanism.
 */
export class VelocityScrapingPolicy implements EnginePolicy {
  private readonly windowMs: number;
  private readonly maxTransitions: number;
  private readonly timestamps: number[] = [];
  private violations = 0;

  /**
   * @param windowMs        Rolling window size in milliseconds (default: 5000).
   * @param maxTransitions  Maximum allowed transitions within the window (default: 10).
   */
  constructor(windowMs = 5_000, maxTransitions = 10) {
    this.windowMs = windowMs;
    this.maxTransitions = maxTransitions;
  }

  onTransition(_from: string, _to: string, _trajectory: readonly string[]): void {
    const now = Date.now();

    // Evict timestamps outside the rolling window.
    const cutoff = now - this.windowMs;
    while (this.timestamps.length > 0 && this.timestamps[0] < cutoff) {
      this.timestamps.shift();
    }

    this.timestamps.push(now);

    if (this.timestamps.length > this.maxTransitions) {
      this.violations += 1;
    }
  }

  onTrackContext(_ctx: PolicyTrackContext): void {
    // No-op — context hook reserved for future enrichment.
  }

  /** Number of velocity violations detected since creation. */
  getViolationCount(): number {
    return this.violations;
  }

  destroy(): void {
    this.timestamps.length = 0;
    this.violations = 0;
  }
}
