/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { MarkovGraph } from '../dist/index.js';
import * as fs from 'fs';

// 1. Create the Media Exploratory Blueprint
const graph = new MarkovGraph({
  highEntropyThreshold: 0.9, // Higher threshold because browsing is naturally chaotic
  divergenceThreshold: 4.5, // Allow more deviation
  baselineMeanLL: -1.5, // Lower mean log-likelihood expected
  baselineStdLL: 0.8, // High variance expected
});

const categories = ['/tech', '/business', '/culture'];
const articles = ['/article/1', '/article/2', '/article/3', '/article/4'];

// 2. Synthesize chaotic but normal browsing traffic
for (let i = 0; i < 500; i++) {
  // Homepage to categories
  graph.incrementTransition('/', categories[Math.floor(Math.random() * categories.length)]);

  // Categories to articles
  const currentCat = categories[Math.floor(Math.random() * categories.length)];
  const currentArt = articles[Math.floor(Math.random() * articles.length)];
  graph.incrementTransition(currentCat, currentArt);

  // Articles back to homepage or categories (the "hub and spoke" model)
  graph.incrementTransition(currentArt, '/');
  graph.incrementTransition(currentArt, categories[Math.floor(Math.random() * categories.length)]);

  // Occasional article-to-article clicking
  graph.incrementTransition(currentArt, articles[Math.floor(Math.random() * articles.length)]);
}

// 3. Export the JSON
const blueprint = graph.toJSON();
fs.writeFileSync('./media-exploratory.json', JSON.stringify(blueprint, null, 2));
