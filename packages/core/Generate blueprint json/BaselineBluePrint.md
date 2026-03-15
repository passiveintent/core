# 🗺️ PassiveIntent: Baseline Blueprints

## Overview: Solving the Cold-Start Problem

PassiveIntent uses localized continuous Markov Chains and Welford's online variance algorithm to detect behavioral anomalies (like hesitation or erratic navigation).

Because the engine evaluates strictly on the client side without cross-session egress, a fresh installation starts with an empty mathematical baseline. By default, the engine requires a short "learning period" (gathering organic traffic) before it can confidently trigger interventions without false positives.

**Blueprints** solve this cold-start problem. By injecting a pre-calculated mathematical topography into the engine on Day 1, developers can achieve instant, zero-latency intent detection from the very first user session.

---

## The Blueprints

### 1. The E-Commerce Strict Funnel (`ecommerce-strict-funnel.json`)

**The Purpose:** Designed for highly rigid, linear conversion flows (e.g., Shopify checkouts, SaaS signups, ticketing platforms).

**The Math:** This blueprint synthesizes a Markov graph with heavily weighted, unidirectional transition probabilities (`/cart` → `/shipping` → `/payment`). It encodes extremely tight variance thresholds (low `baselineStdLL` and high `baselineMeanLL`).

**Why it is Helpful:**
In a checkout flow, users _should not_ deviate. If a user suddenly loops back to `/shipping` from `/payment`, or if their transition velocity drops (hesitation), the engine needs to flag it immediately. This blueprint guarantees the engine treats linear progression as the rigid norm, allowing you to trigger "Free Shipping" coupons or support chats the second a user introduces friction.

### 2. The Media / Exploratory Flow (`media-exploratory.json`)

**The Purpose:** Designed for interconnected, content-heavy applications (e.g., blogs, news sites, discovery feeds, documentation).

**The Math:** This blueprint generates a "hub-and-spoke" Markov graph (`/` → `/category` → `/article` → `/`). It expects a high degree of entropy and features relaxed divergence thresholds.

**Why it is Helpful:**
On a media site, erratic clicking and looping behavior is completely normal—it indicates exploration, not frustration. If you applied the E-Commerce blueprint to a blog, the engine would throw false positives every time a user clicked back to the homepage. This blueprint teaches the engine to tolerate structural chaos and only trigger an anomaly when behavior becomes _truly_ abnormal (e.g., a bot scraping, or a user rage-clicking a broken image).

---

## 🚀 How to Use Blueprints

You can inject a blueprint directly into your engine's configuration upon initialization. The engine will instantly adopt the blueprint's topography and begin refining it with real user data.

```javascript
import { IntentManager } from '@passiveintent/core';
import strictFunnelBlueprint from './ecommerce-strict-funnel.json';

// Initialize the engine with instant ROI
const engine = new IntentManager({
  // Inject the pre-calculated baseline
  baseline: strictFunnelBlueprint,
  dwellTime: {
    targetFPR: 0.02, // 2% False Positive Rate
  },
});

// The engine can now catch hesitation on the very first user session
engine.on('hesitation_detected', (payload) => {
  if (payload.confidence === 'high') {
    triggerDiscountPopup();
  }
});
```

## Re-generating Blueprints

If you alter the core ContinuousGraphModel or BINARY_CODEC_SPEC, you must regenerate these JSON files using the synthesis scripts located in packages/core/scripts/.

```Bash
node .\e-commerce.js
node .\pub-media.js
```
