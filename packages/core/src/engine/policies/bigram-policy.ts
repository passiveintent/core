/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { EnginePolicy } from './engine-policy.js';
import type { MarkovGraph } from '../../core/markov.js';

/**
 * BigramPolicy — records second-order (bigram) Markov transitions.
 *
 * Replaces the inline `if (this.enableBigrams && trajectory.length >= 3)`
 * conditional that was previously in `SignalEngine.recordTransition`.
 * When this policy is **not** instantiated (because `enableBigrams` is
 * `false`), no bigram accounting executes at all.
 *
 * Bigram states are encoded as `"prev\x00from"` → `"from\x00to"` using \x00
 * (NUL) as a collision-resistant separator that will never appear in
 * URL-based state labels.
 *
 * The frequency-threshold guard prevents sparse bigram pollution during the
 * early learning phase: bigrams are only recorded when the *unigram* source
 * state (`from`) has accumulated at least `bigramFrequencyThreshold`
 * outgoing transitions.
 */
export class BigramPolicy implements EnginePolicy {
  private readonly graph: MarkovGraph;
  private readonly bigramFrequencyThreshold: number;

  constructor(graph: MarkovGraph, bigramFrequencyThreshold: number) {
    this.graph = graph;
    this.bigramFrequencyThreshold = bigramFrequencyThreshold;
  }

  onTransition(from: string, to: string, trajectory: readonly string[]): void {
    if (trajectory.length < 3) return;

    const prev2 = trajectory[trajectory.length - 3];
    const bigramFrom = `${prev2}\x00${from}`;
    const bigramTo = `${from}\x00${to}`;

    // Only record when the unigram source has enough outgoing transitions.
    if (this.graph.rowTotal(from) >= this.bigramFrequencyThreshold) {
      this.graph.incrementTransition(bigramFrom, bigramTo);
    }
  }
}
