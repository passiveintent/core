/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { MarkovGraph } from '../packages/core/dist/index.js';
import * as fs from 'fs';

// 1. Create the E-Commerce Strict Funnel Blueprint
const graph = new MarkovGraph({
  highEntropyThreshold: 0.75,
  divergenceThreshold: 3.5,
  baselineMeanLL: -0.2, // Very tight variance expected
  baselineStdLL: 0.05,
});

// 2. Synthesize a massive amount of "perfect" checkout traffic
for (let i = 0; i < 1000; i++) {
  graph.incrementTransition('/cart', '/checkout/shipping');
  graph.incrementTransition('/checkout/shipping', '/checkout/payment');
  graph.incrementTransition('/checkout/payment', '/checkout/success');
}

// 3. Add a tiny bit of noise to prevent absolute zero probabilities
graph.incrementTransition('/cart', '/products');
graph.incrementTransition('/checkout/shipping', '/cart');

// 4. Export the mathematically perfect JSON
const blueprint = graph.toJSON();
fs.writeFileSync('./ecommerce-strict-funnel.json', JSON.stringify(blueprint, null, 2));
