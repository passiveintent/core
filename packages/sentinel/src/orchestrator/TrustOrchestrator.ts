/**
 * TrustOrchestrator — continuous trust score engine.
 *
 * Maintains a rolling trust score T in [0.0, 1.0] and updates it using:
 *
 *   T(t+1) = clamp(decay * T(t) - penalty + normalization, 0.0, 1.0)
 */

export interface TrustConfig {
  /** Starting trust score. Defaults to 1.0. */
  initialTrust?: number;
  /** Multiplicative decay applied each cycle (0 < decay ≤ 1). Defaults to 0.95. */
  decay?: number;
}

export class TrustOrchestrator {
  private trustScore: number;
  private readonly decay: number;

  constructor(config: TrustConfig = {}) {
    this.trustScore = Math.min(1.0, Math.max(0.0, config.initialTrust ?? 1.0));
    this.decay = Math.min(1.0, Math.max(0.0, config.decay ?? 0.95));
  }

  /**
   * Compute the next trust score using the formula:
   *   T(t+1) = clamp(decay * T(t) - penalty + normalization, 0.0, 1.0)
   *
   * @param penalty      Risk deduction to apply (≥ 0).
   * @param normalization Positive adjustment that rewards good behaviour (≥ 0).
   * @returns The updated trust score.
   */
  calculateTrust(penalty: number, normalization: number): number {
    const next = this.decay * this.trustScore - penalty + normalization;
    this.trustScore = Math.min(1.0, Math.max(0.0, next));
    return this.trustScore;
  }

  /** Current trust score (0.0 – 1.0). */
  getTrustScore(): number {
    return this.trustScore;
  }
}
