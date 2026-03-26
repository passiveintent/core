const NAV_ITEMS = [
  { href: './ecommerce/index.html', label: 'E-Commerce' },
  { href: '#why-different', label: 'Why' },
  { href: '#how', label: 'How' },
  { href: '#playground', label: 'Playground' },
  { href: '#demo', label: 'Demo' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#articles', label: 'Articles' },
];

const START_HERE = [
  {
    label: 'Docs',
    title: 'Documentation',
    description: 'Installation, APIs, and calibration guidance for teams moving toward production.',
    linkLabel: 'Open docs',
    href: 'https://github.com/passiveintent/core/tree/main/packages/core',
  },
  {
    label: 'Demo',
    title: 'Demo labs',
    description:
      'Open the React or Vanilla lab in StackBlitz and inspect hesitation, exit intent, and trajectory signals in motion.',
    linkLabel: 'See demo labs',
    href: '#demo',
  },
  {
    label: 'GitHub',
    title: 'Source code',
    description:
      'Review the core package, React package, demo apps, and calibration guide in the public repo.',
    linkLabel: 'View GitHub',
    href: 'https://github.com/passiveintent/core',
  },
  {
    label: 'Pricing',
    title: 'Pricing and licensing',
    description:
      'See the AGPL path, commercial tiers, and the brief used for legal and procurement review.',
    linkLabel: 'See pricing',
    href: '#pricing',
  },
];

const PRODUCTS = [
  {
    status: 'Shipping now',
    statusClass: '',
    title: 'PassiveIntent Core Library',
    description:
      'The shipping library for in-session intent detection across checkout, pricing, billing, and support-sensitive flows.',
    chips: ['JavaScript', 'React', 'Guided demo'],
    warmChips: [],
  },
  {
    status: 'Planned',
    statusClass: 'product-status-warm',
    title: 'Sentinel',
    description:
      'A future SDK for higher-sensitivity behavioral signals and insider-risk use cases. It is mentioned here only so the product family has shape.',
    chips: ['Future SDK'],
    warmChips: ['Insider-risk focus'],
  },
  {
    status: 'Planned',
    statusClass: 'product-status-warm',
    title: 'Integration Layer',
    description:
      'Packaged integrations for commerce, CRM, and SaaS surfaces so teams can bring the core library into real environments faster.',
    chips: ['Commerce', 'CRM'],
    warmChips: ['Shopify', 'BigCommerce', 'Salesforce'],
  },
];

const INTEGRATIONS = {
  available: [
    {
      title: 'Core SDK + React Package',
      status: 'Available',
      warm: false,
      description:
        'Shipping packages for browser apps and React teams adopting the library directly.',
      linkLabel: 'Open packages',
      href: 'https://www.npmjs.com/package/@passiveintent/core',
    },
    {
      title: 'StackBlitz demo labs',
      status: 'Live',
      warm: false,
      description:
        'Open the React or Vanilla labs in StackBlitz for a detached, full-window product evaluation.',
      linkLabel: 'See demo labs',
      href: '#demo',
    },
    {
      title: 'Docs + calibration',
      status: 'Available',
      warm: false,
      description:
        'Implementation docs and tuning guidance for teams moving from evaluation into production logic.',
      linkLabel: 'Open guide',
      href: 'https://github.com/passiveintent/core/blob/main/CALIBRATION_GUIDE.md',
    },
  ],
};

const ARTICLES = [
  {
    source: 'Medium',
    title: 'Why zero-egress intent detection belongs in the browser',
    description:
      'A category piece on why privacy-first intent modeling should happen close to the session.',
    live: false,
    linkLabel: 'Medium post coming soon',
  },
  {
    source: 'dev.to',
    title: 'Implementation notes from the guided lab',
    description:
      'A developer walkthrough of the core package, signal model, and intervention patterns shown in the lab.',
    live: false,
    linkLabel: 'dev.to post coming soon',
  },
  {
    source: 'Substack',
    title: 'A note on product direction',
    description:
      'Product thinking, launch context, and occasional notes on where the platform is heading.',
    live: false,
    linkLabel: 'Substack post coming soon',
  },
  {
    source: 'Hacker News',
    title: 'Launch thread or technical discussion',
    description:
      'A Show HN, launch post, or public technical thread worth sending curious visitors to.',
    live: false,
    linkLabel: 'HN thread coming soon',
  },
];

const COMMERCE_ESTIMATOR_PROFILES = {
  apparel: {
    label: 'apparel',
    factor: 0.00152,
    friction: 'Sizing hesitation',
    intervention: 'Return-assurance slide-in',
  },
  furniture: {
    label: 'furniture and home decor',
    factor: 0.00234,
    friction: 'Measurement validation',
    intervention: 'Save-and-price-lock email',
  },
  electronics: {
    label: 'electronics',
    factor: 0.00174,
    friction: 'Spec-comparison fatigue',
    intervention: 'Live expert compare sheet',
  },
  beauty: {
    label: 'beauty',
    factor: 0.00129,
    friction: 'Regimen doubt',
    intervention: 'Bundle-preserving gift prompt',
  },
};

const BEHAVIORAL_PLAYGROUND_MODES = {
  calibrated: {
    payloadMode: 'calibrated',
    consoleStatus: 'Blueprint active',
    modeNote: 'Calibrated mode is using your Blueprint or site-specific baseline.',
    mandateNote:
      'Blueprint or calibrated baseline active. The propensity bands below are now safe to operationalize as business rules.',
  },
  raw: {
    payloadMode: 'raw_markov',
    consoleStatus: 'Shadow mode only',
    modeNote:
      'Raw mode is relative only. Treat propensity as directional until the baseline stabilizes.',
    mandateNote:
      'Raw Markov mode is preview only. Let the engine learn or inject a Blueprint before you hard-gate discounts or support escalations.',
  },
};

const BEHAVIORAL_TOPOGRAPHY_STATES = [
  {
    id: 'low',
    intensity: 'Low intensity',
    label: 'The Conviction Buyer',
    summary: 'Decisive, linear path.',
    detailTitle: 'Buyer confidence is intact',
    event: '(None)',
    developerCheck: 'Trajectory Z-Score: < 1.5. No anomalies detected.',
    actionTitle: 'Protect Margin',
    actionDescription: 'Suppress all popups and discount codes. Let them buy.',
    actionChip: 'Protect margin',
    mathChip: 'Trajectory Z-Score: < 1.5',
    codeLabel: 'margin protection',
    color: '#74d5a1',
    rgb: '116, 213, 161',
    calibrated: {
      propensityLabel: '> 0.85',
      propensityChip: 'Propensity > 0.85',
      propensityBar: 0.91,
      metrics: {
        trajectory: { label: '0.9', scale: 0.18 },
        dwell: { label: '0.2', scale: 0.04 },
        entropy: { label: '0.18', scale: 0.18 },
        confidence: { label: '0.97', scale: 0.97 },
        likelyNext: { label: '0.91', scale: 0.91 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout',
        baselineMode: 'calibrated_blueprint',
        propensityToConvert: 0.91,
        trajectoryZScore: 0.94,
        confidence: 0.97,
        recommendedAction: 'suppress_interventions',
      },
      code: `if (session.propensityToConvert > 0.85) {
  suppressInterventions();
}`,
    },
    raw: {
      propensityLabel: 'Relative only',
      propensityChip: 'Propensity warming up',
      propensityBar: 0.78,
      metrics: {
        trajectory: { label: '1.1', scale: 0.22 },
        dwell: { label: '0.3', scale: 0.06 },
        entropy: { label: '0.19', scale: 0.19 },
        confidence: { label: '0.61', scale: 0.61 },
        likelyNext: { label: '0.78', scale: 0.78 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout',
        baselineMode: 'raw_markov_warming_up',
        rawPropensity: 0.78,
        trajectoryZScore: 1.12,
        confidence: 0.61,
        recommendedAction: 'observe_until_calibrated',
      },
      code: `if (baselineReady && session.rawPropensity > 0.85) {
  suppressInterventions();
}`,
    },
  },
  {
    id: 'mild',
    intensity: 'Mild intensity',
    label: 'The Window Shopper',
    summary: 'Browsing, exploring options.',
    detailTitle: 'They are curious, not yet stuck',
    event: 'high_entropy',
    developerCheck: 'Normalized Entropy: > 0.75. Check payload.normalizedEntropy.',
    actionTitle: 'Nudge',
    actionDescription:
      'Do not discount yet. Show social proof such as "15 people bought this today."',
    actionChip: 'Social proof only',
    mathChip: 'Normalized Entropy > 0.75',
    codeLabel: 'social proof',
    color: '#f2cb58',
    rgb: '242, 203, 88',
    calibrated: {
      propensityLabel: '0.40 - 0.84',
      propensityChip: 'Propensity 0.40 - 0.84',
      propensityBar: 0.67,
      metrics: {
        trajectory: { label: '1.4', scale: 0.28 },
        dwell: { label: '0.8', scale: 0.16 },
        entropy: { label: '0.82', scale: 0.82 },
        confidence: { label: '0.79', scale: 0.79 },
        likelyNext: { label: '0.58', scale: 0.58 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/pricing',
        event: 'high_entropy',
        normalizedEntropy: 0.82,
        outgoingStates: ['/compare', '/faq', '/pricing', '/demo'],
        propensityToConvert: 0.67,
        recommendedAction: 'show_social_proof',
      },
      code: `intent.on('high_entropy', ({ normalizedEntropy }) => {
  if (normalizedEntropy > 0.75) showSocialProof();
});`,
    },
    raw: {
      propensityLabel: 'Relative only',
      propensityChip: 'Propensity warming up',
      propensityBar: 0.54,
      metrics: {
        trajectory: { label: '1.6', scale: 0.32 },
        dwell: { label: '0.9', scale: 0.18 },
        entropy: { label: '0.82', scale: 0.82 },
        confidence: { label: '0.57', scale: 0.57 },
        likelyNext: { label: '0.49', scale: 0.49 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/pricing',
        event: 'high_entropy',
        baselineMode: 'raw_markov_warming_up',
        normalizedEntropy: 0.82,
        rawPropensity: 0.54,
        recommendedAction: 'shadow_mode_only',
      },
      code: `intent.on('high_entropy', ({ normalizedEntropy }) => {
  if (baselineReady && normalizedEntropy > 0.75) showSocialProof();
});`,
    },
  },
  {
    id: 'high',
    intensity: 'High intensity',
    label: 'Cognitive Friction',
    summary: 'Stuck reading fine print.',
    detailTitle: 'The buyer is lingering on objection handling',
    event: 'dwell_time_anomaly',
    developerCheck: 'Dwell Z-Score: > 2.5. Check payload.zScore > 0 so it is slow, not fast.',
    actionTitle: 'Incentivize',
    actionDescription:
      'Trigger the margin-saving intervention. Fire a "Free Shipping" popup.',
    actionChip: 'Offer free shipping',
    mathChip: 'Dwell Z-Score > 2.5',
    codeLabel: 'margin-saving offer',
    color: '#ff9b54',
    rgb: '255, 155, 84',
    calibrated: {
      propensityLabel: '0.15 - 0.39',
      propensityChip: 'Propensity 0.15 - 0.39',
      propensityBar: 0.29,
      metrics: {
        trajectory: { label: '2.2', scale: 0.44 },
        dwell: { label: '3.1', scale: 0.62 },
        entropy: { label: '0.42', scale: 0.42 },
        confidence: { label: '0.73', scale: 0.73 },
        likelyNext: { label: '0.36', scale: 0.36 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout/shipping',
        event: 'dwell_time_anomaly',
        dwellMs: 184000,
        zScore: 3.1,
        confidence: 0.73,
        propensityToConvert: 0.29,
        recommendedAction: 'free_shipping_offer',
      },
      code: `intent.on('dwell_time_anomaly', ({ zScore }) => {
  if (zScore > 0) showFreeShipping();
});`,
    },
    raw: {
      propensityLabel: 'Relative only',
      propensityChip: 'Propensity warming up',
      propensityBar: 0.31,
      metrics: {
        trajectory: { label: '2.4', scale: 0.48 },
        dwell: { label: '3.1', scale: 0.62 },
        entropy: { label: '0.44', scale: 0.44 },
        confidence: { label: '0.52', scale: 0.52 },
        likelyNext: { label: '0.33', scale: 0.33 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout/shipping',
        event: 'dwell_time_anomaly',
        baselineMode: 'raw_markov_warming_up',
        dwellMs: 184000,
        zScore: 3.1,
        rawPropensity: 0.31,
        recommendedAction: 'shadow_mode_only',
      },
      code: `intent.on('dwell_time_anomaly', ({ zScore }) => {
  if (baselineReady && zScore > 0) showFreeShipping();
});`,
    },
  },
  {
    id: 'critical',
    intensity: 'Critical intensity',
    label: 'Anxiety / Frustration',
    summary: 'Looping, lost, or erratic.',
    detailTitle: 'The path has broken from the expected high-intent route',
    event: 'trajectory_anomaly',
    developerCheck: 'Trajectory Z-Score: > 3.5. Check payload.confidence before escalating.',
    actionTitle: 'Rescue',
    actionDescription: 'Trigger an immediate customer support modal or live chat.',
    actionChip: 'Open support',
    mathChip: 'Trajectory Z-Score > 3.5',
    codeLabel: 'support rescue',
    color: '#ff6b6b',
    rgb: '255, 107, 107',
    calibrated: {
      propensityLabel: '< 0.15',
      propensityChip: 'Propensity < 0.15',
      propensityBar: 0.12,
      metrics: {
        trajectory: { label: '4.2', scale: 0.84 },
        dwell: { label: '1.9', scale: 0.38 },
        entropy: { label: '0.71', scale: 0.71 },
        confidence: { label: '0.88', scale: 0.88 },
        likelyNext: { label: '0.12', scale: 0.12 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/billing',
        event: 'trajectory_anomaly',
        trajectoryZScore: 4.2,
        confidence: 0.88,
        observedPath: ['/pricing', '/faq', '/pricing', '/billing'],
        propensityToConvert: 0.12,
        recommendedAction: 'open_support_modal',
      },
      code: `intent.on('trajectory_anomaly', ({ confidence }) => {
  if (confidence > 0.6) openSupportModal();
});`,
    },
    raw: {
      propensityLabel: 'Relative only',
      propensityChip: 'Propensity warming up',
      propensityBar: 0.19,
      metrics: {
        trajectory: { label: '3.9', scale: 0.78 },
        dwell: { label: '2.0', scale: 0.4 },
        entropy: { label: '0.68', scale: 0.68 },
        confidence: { label: '0.43', scale: 0.43 },
        likelyNext: { label: '0.19', scale: 0.19 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/billing',
        event: 'trajectory_anomaly',
        baselineMode: 'raw_markov_warming_up',
        trajectoryZScore: 3.9,
        confidence: 0.43,
        rawPropensity: 0.19,
        recommendedAction: 'observe_until_calibrated',
      },
      code: `intent.on('trajectory_anomaly', ({ confidence }) => {
  if (baselineReady && confidence > 0.6) openSupportModal();
});`,
    },
  },
  {
    id: 'compound',
    intensity: 'Compound signal',
    label: 'Confirmed Hesitation',
    summary: 'Frozen and confused.',
    detailTitle: 'Two independent signals agree that the buyer is stalled',
    event: 'hesitation_detected',
    developerCheck: 'Trajectory and dwell triggered within 30s of each other.',
    actionTitle: 'The Kill Shot',
    actionDescription:
      'Highest-confidence intervention. Fire your absolute best discount offer.',
    actionChip: 'Deploy best offer',
    mathChip: 'Trajectory + Dwell within 30s',
    codeLabel: 'offer ladder',
    color: '#7bc6ff',
    rgb: '123, 198, 255',
    calibrated: {
      propensityLabel: '< 0.39',
      propensityChip: 'Propensity < 0.39',
      propensityBar: 0.18,
      metrics: {
        trajectory: { label: '4.6', scale: 0.92 },
        dwell: { label: '3.8', scale: 0.76 },
        entropy: { label: '0.63', scale: 0.63 },
        confidence: { label: '0.94', scale: 0.94 },
        likelyNext: { label: '0.27', scale: 0.27 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout/payment',
        event: 'hesitation_detected',
        trajectoryZScore: 4.6,
        dwellZScore: 3.8,
        correlationWindowMs: 30000,
        confidence: 0.94,
        propensityToConvert: 0.18,
        recommendedAction: 'best_discount_offer',
      },
      code: `intent.on('hesitation_detected', () => {
  showBestOffer();
});`,
    },
    raw: {
      propensityLabel: 'Relative only',
      propensityChip: 'Propensity warming up',
      propensityBar: 0.24,
      metrics: {
        trajectory: { label: '4.1', scale: 0.82 },
        dwell: { label: '3.8', scale: 0.76 },
        entropy: { label: '0.61', scale: 0.61 },
        confidence: { label: '0.48', scale: 0.48 },
        likelyNext: { label: '0.24', scale: 0.24 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/checkout/payment',
        event: 'hesitation_detected',
        baselineMode: 'raw_markov_warming_up',
        trajectoryZScore: 4.1,
        dwellZScore: 3.8,
        confidence: 0.48,
        recommendedAction: 'shadow_mode_only',
      },
      code: `intent.on('hesitation_detected', () => {
  if (baselineReady) showBestOffer();
});`,
    },
  },
  {
    id: 'leaving',
    intensity: 'Leaving',
    label: 'Exit Intent',
    summary: 'Mouse moving to close tab.',
    detailTitle: 'Decision is escaping the session right now',
    event: 'exit_intent',
    developerCheck:
      'Mouseleave toward browser chrome plus payload.likelyNext >= 0.4.',
    actionTitle: 'Last Chance',
    actionDescription:
      'Trigger a targeted retention overlay using payload.likelyNext to personalize the message.',
    actionChip: 'Retention overlay',
    mathChip: 'Mouseleave + likelyNext >= 0.4',
    codeLabel: 'retention overlay',
    color: '#ff9dc5',
    rgb: '255, 157, 197',
    calibrated: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.38,
      metrics: {
        trajectory: { label: '2.9', scale: 0.58 },
        dwell: { label: '0.7', scale: 0.14 },
        entropy: { label: '0.33', scale: 0.33 },
        confidence: { label: '0.76', scale: 0.76 },
        likelyNext: { label: '0.62', scale: 0.62 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/pricing',
        event: 'exit_intent',
        likelyNext: 'enterprise',
        likelyNextProbability: 0.62,
        pointerHeading: 'browser_chrome',
        confidence: 0.76,
        recommendedAction: 'personalized_retention_overlay',
      },
      code: `intent.on('exit_intent', ({ likelyNext }) => {
  showRetentionOverlay(likelyNext);
});`,
    },
    raw: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.34,
      metrics: {
        trajectory: { label: '2.7', scale: 0.54 },
        dwell: { label: '0.7', scale: 0.14 },
        entropy: { label: '0.31', scale: 0.31 },
        confidence: { label: '0.41', scale: 0.41 },
        likelyNext: { label: '0.48', scale: 0.48 },
        away: { label: '0s', scale: 0.01 },
      },
      payload: {
        state: '/pricing',
        event: 'exit_intent',
        baselineMode: 'raw_markov_warming_up',
        likelyNextProbability: 0.48,
        confidence: 0.41,
        recommendedAction: 'shadow_mode_only',
      },
      code: `intent.on('exit_intent', ({ likelyNext }) => {
  if (baselineReady) showRetentionOverlay(likelyNext);
});`,
    },
  },
  {
    id: 'ghost',
    intensity: 'Attention return',
    label: 'Attention Return',
    summary: 'Tab hidden, then refocused.',
    detailTitle: 'Comparison-shopping happened off-tab and attention is back',
    event: 'attention_return',
    developerCheck: 'Time Away: >= 15s. Check payload.hiddenDuration.',
    actionTitle: 'Re-engage',
    actionDescription:
      'Welcome them back with the last product or decision context still visible.',
    actionChip: 'Welcome back prompt',
    mathChip: 'Hidden >= 15s',
    codeLabel: 'welcome back',
    color: '#86f2ea',
    rgb: '134, 242, 234',
    calibrated: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.52,
      metrics: {
        trajectory: { label: '1.7', scale: 0.34 },
        dwell: { label: '0.4', scale: 0.08 },
        entropy: { label: '0.29', scale: 0.29 },
        confidence: { label: '0.81', scale: 0.81 },
        likelyNext: { label: '0.52', scale: 0.52 },
        away: { label: '21s', scale: 0.18 },
      },
      payload: {
        state: '/product/alpha',
        event: 'attention_return',
        hiddenDuration: 21000,
        lastProduct: 'Model X Headset',
        confidence: 0.81,
        recommendedAction: 'welcome_back_prompt',
      },
      code: `intent.on('attention_return', ({ hiddenDuration }) => {
  showWelcomeBack(hiddenDuration);
});`,
    },
    raw: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.47,
      metrics: {
        trajectory: { label: '1.7', scale: 0.34 },
        dwell: { label: '0.4', scale: 0.08 },
        entropy: { label: '0.29', scale: 0.29 },
        confidence: { label: '0.63', scale: 0.63 },
        likelyNext: { label: '0.44', scale: 0.44 },
        away: { label: '21s', scale: 0.18 },
      },
      payload: {
        state: '/product/alpha',
        event: 'attention_return',
        baselineMode: 'raw_markov_warming_up',
        hiddenDuration: 21000,
        confidence: 0.63,
        recommendedAction: 'shadow_mode_only',
      },
      code: `intent.on('attention_return', ({ hiddenDuration }) => {
  if (baselineReady) showWelcomeBack(hiddenDuration);
});`,
    },
  },
  {
    id: 'idle',
    intensity: 'Idle',
    label: 'Mentally Gone',
    summary: 'Tab open, user AFK.',
    detailTitle: 'Attention left even though the tab stayed open',
    event: 'user_idle',
    developerCheck: 'Inactivity: > 120s. Check payload.idleMs.',
    actionTitle: 'Reactivate',
    actionDescription:
      'Pulse the tab title or trigger a soft visual nudge to draw the eye back.',
    actionChip: 'Soft visual nudge',
    mathChip: 'Inactivity > 120s',
    codeLabel: 'reactivation',
    color: '#b5bfd3',
    rgb: '181, 191, 211',
    calibrated: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.34,
      metrics: {
        trajectory: { label: '0.6', scale: 0.12 },
        dwell: { label: '0.1', scale: 0.02 },
        entropy: { label: '0.11', scale: 0.11 },
        confidence: { label: '0.69', scale: 0.69 },
        likelyNext: { label: '0.34', scale: 0.34 },
        away: { label: '128s', scale: 0.71 },
      },
      payload: {
        state: '/checkout/review',
        event: 'user_idle',
        idleMs: 128000,
        confidence: 0.69,
        recommendedAction: 'pulse_title',
      },
      code: `intent.on('user_idle', ({ idleMs }) => {
  pulseTitle(idleMs);
});`,
    },
    raw: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.34,
      metrics: {
        trajectory: { label: '0.6', scale: 0.12 },
        dwell: { label: '0.1', scale: 0.02 },
        entropy: { label: '0.11', scale: 0.11 },
        confidence: { label: '0.69', scale: 0.69 },
        likelyNext: { label: '0.34', scale: 0.34 },
        away: { label: '128s', scale: 0.71 },
      },
      payload: {
        state: '/checkout/review',
        event: 'user_idle',
        baselineMode: 'raw_markov_warming_up',
        idleMs: 128000,
        recommendedAction: 'pulse_title',
      },
      code: `intent.on('user_idle', ({ idleMs }) => {
  pulseTitle(idleMs);
});`,
    },
  },
  {
    id: 'back',
    intensity: 'Resumed',
    label: 'Resumed',
    summary: 'User moves mouse after idle.',
    detailTitle: 'Attention is back, so resume instead of restarting the flow',
    event: 'user_resumed',
    developerCheck: 'Return from idle. Event fires with total payload.idleMs.',
    actionTitle: 'Welcome Back',
    actionDescription: 'Resume the UI state exactly where they left off.',
    actionChip: 'Restore UI state',
    mathChip: 'Resume from idle',
    codeLabel: 'resume state',
    color: '#89d1ff',
    rgb: '137, 209, 255',
    calibrated: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.41,
      metrics: {
        trajectory: { label: '0.8', scale: 0.16 },
        dwell: { label: '0.2', scale: 0.04 },
        entropy: { label: '0.09', scale: 0.09 },
        confidence: { label: '0.78', scale: 0.78 },
        likelyNext: { label: '0.41', scale: 0.41 },
        away: { label: '143s', scale: 0.79 },
      },
      payload: {
        state: '/checkout/review',
        event: 'user_resumed',
        idleMs: 143000,
        resumeInteraction: 'mousemove',
        confidence: 0.78,
        recommendedAction: 'restore_ui_state',
      },
      code: `intent.on('user_resumed', ({ idleMs }) => {
  restoreUiState(idleMs);
});`,
    },
    raw: {
      propensityLabel: 'Any',
      propensityChip: 'Propensity any',
      propensityBar: 0.41,
      metrics: {
        trajectory: { label: '0.8', scale: 0.16 },
        dwell: { label: '0.2', scale: 0.04 },
        entropy: { label: '0.09', scale: 0.09 },
        confidence: { label: '0.78', scale: 0.78 },
        likelyNext: { label: '0.41', scale: 0.41 },
        away: { label: '143s', scale: 0.79 },
      },
      payload: {
        state: '/checkout/review',
        event: 'user_resumed',
        baselineMode: 'raw_markov_warming_up',
        idleMs: 143000,
        resumeInteraction: 'mousemove',
        recommendedAction: 'restore_ui_state',
      },
      code: `intent.on('user_resumed', ({ idleMs }) => {
  restoreUiState(idleMs);
});`,
    },
  },
];

const BEHAVIORAL_TOPOGRAPHY_LOOKUP = Object.fromEntries(
  BEHAVIORAL_TOPOGRAPHY_STATES.map((state) => [state.id, state]),
);

const BEHAVIORAL_PLAYGROUND_SCENES = {
  low: {
    chapter: 'Chapter 01 • Conviction',
    heroTitle: 'Know when to stay out of the way.',
    heroSummary: 'A decisive buyer does not need a popup. The best experience is momentum.',
    stageEyebrow: 'When confidence is intact',
    stageTitle: 'Restraint is the intervention.',
    stageWhisper: 'No popup. No coupon. No friction added.',
  },
  mild: {
    chapter: 'Chapter 02 • Curiosity',
    heroTitle: 'Curiosity needs reassurance, not a discount.',
    heroSummary:
      'Exploration is still healthy intent. The right move is to confirm trust without collapsing your margin.',
    stageEyebrow: 'When browsing spreads across options',
    stageTitle: 'Nudge without interrupting the hunt.',
    stageWhisper: 'Social proof is enough. Save the offer for real resistance.',
  },
  high: {
    chapter: 'Chapter 03 • Friction',
    heroTitle: 'Relieve the tension before it becomes abandonment.',
    heroSummary:
      'The buyer is working too hard to justify the purchase. A light incentive can restore motion without cheapening the experience.',
    stageEyebrow: 'When hesitation gathers around a decision point',
    stageTitle: 'Give them one clean reason to continue.',
    stageWhisper: 'Free shipping beats blanket discounting when the buyer is close.',
  },
  critical: {
    chapter: 'Chapter 04 • Anxiety',
    heroTitle: 'Step in before confusion becomes a lost session.',
    heroSummary:
      'When the path breaks and confidence collapses, the product should feel instantly more supportive.',
    stageEyebrow: 'When the route no longer looks intentional',
    stageTitle: 'Rescue the session with human help.',
    stageWhisper: 'Open support, remove uncertainty, and keep the buyer from spinning.',
  },
  compound: {
    chapter: 'Chapter 05 • Hesitation',
    heroTitle: 'When two signals agree, move decisively.',
    heroSummary:
      'This is the highest-confidence moment to intervene. The engine is not guessing anymore; it is confirming a stall.',
    stageEyebrow: 'When friction and drift land together',
    stageTitle: 'Deploy the strongest offer with confidence.',
    stageWhisper: 'Best offer. Best timing. No wasted discount earlier in the journey.',
  },
  leaving: {
    chapter: 'Chapter 06 • Departure',
    heroTitle: 'Catch the decision at the edge of the tab.',
    heroSummary:
      'Exit intent is not a feeling. It is the final physical signal before the session disappears.',
    stageEyebrow: 'When the pointer leaves for browser chrome',
    stageTitle: 'Personalize the last chance.',
    stageWhisper: 'Use the likely next step to make the retention message feel specific.',
  },
  ghost: {
    chapter: 'Chapter 07 • Return',
    heroTitle: 'Welcome them back without making them start over.',
    heroSummary:
      'Attention left the page, but the decision is still alive. Re-entry should feel remembered.',
    stageEyebrow: 'When attention comes back after comparison shopping',
    stageTitle: 'Resume the story they were already in.',
    stageWhisper: 'Show the last product, the last step, and the next easiest action.',
  },
  idle: {
    chapter: 'Chapter 08 • Pause',
    heroTitle: 'A quiet nudge can be enough to reclaim attention.',
    heroSummary:
      'Not every lost moment is frustration. Sometimes the right move is simply to remind the eye to return.',
    stageEyebrow: 'When the tab stays open but attention leaves',
    stageTitle: 'Reactivate softly.',
    stageWhisper: 'Pulse the tab title or add motion, but do not restart the experience.',
  },
  back: {
    chapter: 'Chapter 09 • Resume',
    heroTitle: 'Pick up exactly where the buyer left you.',
    heroSummary:
      'The return should feel seamless. Restore context fast enough that the interruption barely matters.',
    stageEyebrow: 'When motion resumes after idle',
    stageTitle: 'Continuation beats re-introduction.',
    stageWhisper: 'Restore the UI state and keep the session feeling uninterrupted.',
  },
};

const MARKETING_CHEATSHEET = {
  mandateTitle: 'Propensity thresholds are not universal constants.',
  mandateSummary:
    'A 3-page checkout funnel and a 40-page discovery catalog have entirely different structural probabilities.',
  mandateDetail:
    'The thresholds below assume a calibrated baseline. If you are not using a pre-calculated Blueprint JSON, the engine defaults to raw Markov probabilities until it observes enough organic traffic. Always run PassiveIntent.calibrate() or inject a Blueprint for immediate accuracy.',
  emailSubject: 'PassiveIntent Behavioral Topography Matrix Cheat Sheet',
  emailIntro:
    'Sharing the PassiveIntent cheat sheet that maps engine math to psychological intent and the right Go-To-Market intervention.',
  whatsappIntro:
    'PassiveIntent cheat sheet: engine math -> psychological intent -> Go-To-Market action.',
  rows: [
    {
      id: 'low',
      state: 'Low',
      profileTitle: 'The Conviction Buyer',
      profileSummary: 'Decisive, linear path.',
      event: '(None)',
      developerCheck: 'Trajectory Z-Score: < 1.5. No anomalies detected.',
      propensity: '> 0.85',
      actionTitle: 'Protect Margin.',
      actionSummary: 'Suppress all popups and discount codes. Let them buy.',
    },
    {
      id: 'mild',
      state: 'Mild',
      profileTitle: 'The Window Shopper',
      profileSummary: 'Browsing, exploring options.',
      event: 'high_entropy',
      developerCheck: 'Normalized Entropy: > 0.75. Check payload.normalizedEntropy.',
      propensity: '0.40 - 0.84',
      actionTitle: 'Nudge.',
      actionSummary:
        'Do not discount yet. Show social proof such as "15 people bought this today."',
    },
    {
      id: 'high',
      state: 'High',
      profileTitle: 'Cognitive Friction',
      profileSummary: 'Stuck reading fine print.',
      event: 'dwell_time_anomaly',
      developerCheck:
        'Dwell Z-Score: > 2.5. Check payload.zScore > 0 to verify it is slow, not fast.',
      propensity: '0.15 - 0.39',
      actionTitle: 'Incentivize.',
      actionSummary: 'Trigger the margin-saving intervention. Fire a "Free Shipping" popup.',
    },
    {
      id: 'critical',
      state: 'Critical',
      profileTitle: 'Anxiety / Frustration',
      profileSummary: 'Looping, lost, or erratic.',
      event: 'trajectory_anomaly',
      developerCheck: 'Trajectory Z-Score: > 3.5. Check payload.confidence.',
      propensity: '< 0.15',
      actionTitle: 'Rescue.',
      actionSummary: 'Trigger an immediate customer support modal or live chat.',
    },
    {
      id: 'compound',
      state: 'Compound',
      profileTitle: 'Confirmed Hesitation',
      profileSummary: 'Frozen and confused.',
      event: 'hesitation_detected',
      developerCheck:
        'Correlation: trajectory and dwell triggered within 30s of each other.',
      propensity: '< 0.39',
      actionTitle: 'The Kill Shot.',
      actionSummary: 'Highest-confidence intervention. Fire your absolute best discount offer.',
    },
    {
      id: 'leaving',
      state: 'Leaving',
      profileTitle: 'Exit Intent',
      profileSummary: 'Mouse moving to close tab.',
      event: 'exit_intent',
      developerCheck:
        'Kinematics + math: mouseleave toward chrome plus likelyNext >= 0.4.',
      propensity: 'Any',
      actionTitle: 'Last Chance.',
      actionSummary:
        'Trigger a targeted retention overlay using payload.likelyNext to personalize the message.',
    },
    {
      id: 'ghost',
      state: 'Ghost',
      profileTitle: 'Attention Return',
      profileSummary: 'Tab hidden, then refocused.',
      event: 'attention_return',
      developerCheck: 'Time away: >= 15s. Check payload.hiddenDuration.',
      propensity: 'Any',
      actionTitle: 'Re-engage.',
      actionSummary: '"Welcome back! Still thinking about [Last Product]?"',
    },
    {
      id: 'idle',
      state: 'Idle',
      profileTitle: 'Mentally Gone',
      profileSummary: 'Tab open, user AFK.',
      event: 'user_idle',
      developerCheck: 'Inactivity: > 120s. Check payload.idleMs.',
      propensity: 'Any',
      actionTitle: 'Reactivate.',
      actionSummary: 'Pulse the tab title or trigger a soft visual nudge to draw the eye back.',
    },
    {
      id: 'back',
      state: 'Back',
      profileTitle: 'Resumed',
      profileSummary: 'User moves mouse after idle.',
      event: 'user_resumed',
      developerCheck: 'Return from idle: event fires with total payload.idleMs.',
      propensity: 'Any',
      actionTitle: 'Welcome Back.',
      actionSummary: 'Resume UI state where they left off.',
    },
  ],
};

function formatWholeNumber(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function parseFiniteMinimum(value, minimum) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(minimum, parsed) : minimum;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return replacements[character] ?? character;
  });
}

function renderNav() {
  const nav = document.getElementById('site-nav');
  if (!nav || nav.children.length > 0) return; // Skip if nav already has pre-rendered content
  nav.innerHTML = NAV_ITEMS.map((item) => `<a href="${item.href}">${item.label}</a>`).join('');
}

function getLinkAttributes(href) {
  return /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container || container.children.length > 0) return; // Skip if products already pre-rendered

  container.innerHTML = PRODUCTS.map(
    (product, index) => `
      <article class="product-card ${index === 0 ? 'product-card-featured-main' : ''}">
        <span class="product-status ${product.statusClass}">${product.status}</span>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div class="product-card-foot">
          ${product.chips.map((chip) => `<span class="product-chip">${chip}</span>`).join('')}
          ${product.warmChips.map((chip) => `<span class="product-chip warm">${chip}</span>`).join('')}
        </div>
      </article>
    `,
  ).join('');
}

function renderStartHere() {
  const container = document.getElementById('start-grid');
  if (!container || container.children.length > 0) return; // Skip if start here already pre-rendered

  container.innerHTML = START_HERE.map(
    (item) => `
      <article class="start-card start-card-compact">
        <span class="article-source">${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a class="start-link" href="${item.href}"${getLinkAttributes(item.href)}>${item.linkLabel}</a>
      </article>
    `,
  ).join('');
}

function renderIntegrations() {
  const available = document.getElementById('integrations-available');
  if (!available || available.children.length > 0) return; // Skip if integrations already pre-rendered

  available.innerHTML = INTEGRATIONS.available
    .map(
      (item) => `
      <article class="integration-item">
        <div class="integration-head">
          <h4>${item.title}</h4>
          <span class="integration-pill ${item.warm ? 'warm' : ''}">${item.status}</span>
        </div>
        <p>${item.description}</p>
        <a class="integration-link" href="${item.href}"${getLinkAttributes(item.href)}>${item.linkLabel}</a>
      </article>
    `,
    )
    .join('');
}

function renderArticles() {
  const container = document.getElementById('articles-grid');
  if (!container || container.children.length > 0) return; // Skip if articles already pre-rendered

  container.innerHTML = ARTICLES.map((article) => {
    const linkMarkup = article.live
      ? `<a class="article-link" href="${article.href}"${getLinkAttributes(article.href)}>${article.linkLabel}</a>`
      : `<span class="article-link article-link-disabled">${article.linkLabel}</span>`;

    return `
      <article class="article-card article-card-row">
        <div>
          <span class="article-source">${article.source}</span>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
        </div>
        ${linkMarkup}
      </article>
    `;
  }).join('');
}

function setupCommerceEstimator() {
  const trafficInput = document.getElementById('monthly-traffic');
  const trafficDisplay = document.getElementById('monthly-traffic-display');
  const aovInput = document.getElementById('average-order-value');
  const industrySelect = document.getElementById('industry-select');
  const output = document.getElementById('commerce-estimator-output');
  const annualUpside = document.getElementById('annual-upside');
  const friction = document.getElementById('industry-friction');
  const intervention = document.getElementById('industry-intervention');
  const form = document.getElementById('commerce-estimator-form');
  const emailInput = document.getElementById('commerce-email');
  const formNote = document.getElementById('commerce-form-note');

  if (
    !trafficInput ||
    !trafficDisplay ||
    !aovInput ||
    !industrySelect ||
    !output ||
    !annualUpside ||
    !friction ||
    !intervention ||
    !form ||
    !emailInput ||
    !formNote
  ) {
    return;
  }

  const syncEstimator = () => {
    const traffic = parseFiniteMinimum(trafficInput.value, 25000);
    const aov = parseFiniteMinimum(aovInput.value, 25);
    const profile =
      COMMERCE_ESTIMATOR_PROFILES[industrySelect.value] ?? COMMERCE_ESTIMATOR_PROFILES.apparel;
    const monthlyRescue = Math.round(traffic * aov * profile.factor);

    trafficDisplay.textContent = formatWholeNumber(traffic);
    output.textContent = `Estimated monthly recovery: ${formatCurrency(monthlyRescue)} in ${profile.label}.`;
    annualUpside.textContent = formatCurrency(monthlyRescue * 12);
    friction.textContent = profile.friction;
    intervention.textContent = profile.intervention;
  };

  trafficInput.addEventListener('input', syncEstimator);
  aovInput.addEventListener('input', syncEstimator);
  industrySelect.addEventListener('change', syncEstimator);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!(emailInput instanceof HTMLInputElement) || !emailInput.reportValidity()) return;

    const traffic = parseFiniteMinimum(trafficInput.value, 25000);
    const aov = parseFiniteMinimum(aovInput.value, 25);
    const profile =
      COMMERCE_ESTIMATOR_PROFILES[industrySelect.value] ?? COMMERCE_ESTIMATOR_PROFILES.apparel;
    const monthlyRescue = Math.round(traffic * aov * profile.factor);
    const subject = encodeURIComponent(
      `PassiveIntent shadow-mode request - ${profile.label} - ${emailInput.value}`,
    );
    const body = encodeURIComponent(
      [
        `Email: ${emailInput.value}`,
        `Industry: ${profile.label}`,
        `Monthly traffic: ${formatWholeNumber(traffic)}`,
        `AOV: ${formatCurrency(aov)}`,
        `Estimated monthly rescue: ${formatCurrency(monthlyRescue)}`,
        '',
        'Please send the 14-day shadow-mode integration snippet and next steps.',
      ].join('\n'),
    );

    formNote.textContent = 'Opening your email client with a prefilled shadow-mode request.';
    window.location.href = `mailto:support@passiveintent.dev?subject=${subject}&body=${body}`;
  });

  syncEstimator();
}

function setupCommercePlaybookTabs() {
  const tabs = Array.from(document.querySelectorAll('[data-playbook-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-playbook-panel]'));
  if (!tabs.length || !panels.length) return;

  const activateTab = (nextTab) => {
    const nextId = nextTab.dataset.playbookTab;
    tabs.forEach((tab) => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.playbookPanel !== nextId;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      const nextTab = tabs[nextIndex];
      nextTab.focus();
      activateTab(nextTab);
    });
  });

  activateTab(tabs[0]);
}

function setupReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  // Progressive enhancement: hide elements after JS loads so page is readable if JS fails.
  revealItems.forEach((item) => item.classList.add('reveal-hidden'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    // Keep oversized mobile sections eligible for reveal; tall panels like Art of Possible
    // can never hit a higher intersection ratio on smaller viewports.
    { threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupBehavioralPlayground() {
  const root = document.getElementById('behavioral-playground');
  if (!root) return;

  const modeButtons = Array.from(root.querySelectorAll('[data-calibration-mode]'));
  const storyButtons = Array.from(root.querySelectorAll('[data-story-state]'));
  const stateButtons = Array.from(root.querySelectorAll('.playground-state-button'));
  const autoplayButton = document.getElementById('playground-autoplay');
  const revealToggle = document.getElementById('playground-reveal-toggle');
  const revealPanel = document.getElementById('playground-reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = {
    mandateNote: document.getElementById('playground-mandate-note'),
    storyChapter: document.getElementById('playground-story-chapter'),
    heroTitle: document.getElementById('playground-hero-title'),
    heroSummary: document.getElementById('playground-hero-summary'),
    intensityBadge: document.getElementById('playground-intensity-badge'),
    eventBadge: document.getElementById('playground-event-badge'),
    stageEyebrow: document.getElementById('playground-stage-eyebrow'),
    stageTitle: document.getElementById('playground-stage-title'),
    profileTitle: document.getElementById('playground-profile-title'),
    profileSummary: document.getElementById('playground-profile-summary'),
    mathChip: document.getElementById('playground-math-chip'),
    actionChip: document.getElementById('playground-action-chip'),
    propensityChip: document.getElementById('playground-propensity-chip'),
    propensityLabel: document.getElementById('playground-propensity-label'),
    propensityFill: document.getElementById('playground-propensity-fill'),
    modeNote: document.getElementById('playground-mode-note'),
    actionTitle: document.getElementById('playground-action-title'),
    actionDescription: document.getElementById('playground-action-description'),
    stageWhisper: document.getElementById('playground-stage-whisper'),
    consoleStatus: document.getElementById('playground-console-status'),
    detailEvent: document.getElementById('playground-detail-event'),
    detailCheck: document.getElementById('playground-detail-check'),
    detailPsychology: document.getElementById('playground-detail-psychology'),
    detailWhy: document.getElementById('playground-detail-why'),
    payloadMode: document.getElementById('playground-payload-mode'),
    payload: document.getElementById('playground-payload'),
    codeLabel: document.getElementById('playground-code-label'),
    code: document.getElementById('playground-code'),
    metricTrajectory: document.getElementById('playground-metric-trajectory'),
    metricDwell: document.getElementById('playground-metric-dwell'),
    metricEntropy: document.getElementById('playground-metric-entropy'),
    metricConfidence: document.getElementById('playground-metric-confidence'),
    metricLikelyNext: document.getElementById('playground-metric-likely-next'),
    metricAway: document.getElementById('playground-metric-away'),
    barTrajectory: document.getElementById('playground-bar-trajectory'),
    barDwell: document.getElementById('playground-bar-dwell'),
    barEntropy: document.getElementById('playground-bar-entropy'),
    barConfidence: document.getElementById('playground-bar-confidence'),
    barLikelyNext: document.getElementById('playground-bar-likely-next'),
    barAway: document.getElementById('playground-bar-away'),
  };

  let activeStateId = 'low';
  let mode = 'calibrated';
  let autoplayTimer = null;
  let refreshTimer = null;
  let hasRendered = false;

  const syncReveal = (open) => {
    if (!revealToggle || !revealPanel) return;

    revealPanel.hidden = !open;
    revealPanel.classList.toggle('is-open', open);
    revealToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    revealToggle.textContent = open ? 'Hide decision model' : 'Reveal decision model';
  };

  const setBarScale = (element, scale) => {
    if (!element) return;
    element.style.transform = `scaleX(${clamp01(scale)})`;
  };

  const render = () => {
    const state = BEHAVIORAL_TOPOGRAPHY_LOOKUP[activeStateId];
    const stateMode = state?.[mode];
    const modeMeta = BEHAVIORAL_PLAYGROUND_MODES[mode];
    const scene = BEHAVIORAL_PLAYGROUND_SCENES[activeStateId] ?? BEHAVIORAL_PLAYGROUND_SCENES.low;
    if (!state || !stateMode || !modeMeta || !scene) return;

    root.style.setProperty('--playground-accent', state.color);
    root.style.setProperty('--playground-accent-rgb', state.rgb);

    if (hasRendered) {
      root.classList.remove('is-refreshing');
      window.clearTimeout(refreshTimer);
      window.requestAnimationFrame(() => {
        root.classList.add('is-refreshing');
        refreshTimer = window.setTimeout(() => root.classList.remove('is-refreshing'), 620);
      });
    }

    stateButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.state === activeStateId);
    });

    storyButtons.forEach((button) => {
      const active = button.dataset.storyState === activeStateId;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    modeButtons.forEach((button) => {
      const active = button.dataset.calibrationMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    elements.mandateNote.textContent = modeMeta.mandateNote;
    elements.storyChapter.textContent = scene.chapter;
    elements.heroTitle.textContent = scene.heroTitle;
    elements.heroSummary.textContent = scene.heroSummary;
    elements.intensityBadge.textContent = state.intensity;
    elements.eventBadge.textContent = state.event === '(None)' ? 'No event fired' : state.event;
    elements.stageEyebrow.textContent = scene.stageEyebrow;
    elements.stageTitle.textContent = scene.stageTitle;
    elements.profileTitle.textContent = state.label;
    elements.profileSummary.textContent = state.summary;
    elements.mathChip.textContent = state.mathChip;
    elements.actionChip.textContent = state.actionChip;
    elements.propensityChip.textContent = stateMode.propensityChip;
    elements.propensityLabel.textContent = stateMode.propensityLabel;
    elements.modeNote.textContent = modeMeta.modeNote;
    elements.actionTitle.textContent = state.actionTitle;
    elements.actionDescription.textContent = state.actionDescription;
    elements.stageWhisper.textContent = scene.stageWhisper;
    elements.consoleStatus.textContent = modeMeta.consoleStatus;
    elements.detailEvent.textContent = state.event;
    elements.detailCheck.textContent = state.developerCheck;
    elements.detailPsychology.textContent = state.detailTitle;
    elements.detailWhy.textContent = state.summary;
    elements.payloadMode.textContent = modeMeta.payloadMode;
    elements.payload.textContent = JSON.stringify(stateMode.payload, null, 2);
    elements.codeLabel.textContent = state.codeLabel;
    elements.code.textContent = stateMode.code;

    elements.metricTrajectory.textContent = stateMode.metrics.trajectory.label;
    elements.metricDwell.textContent = stateMode.metrics.dwell.label;
    elements.metricEntropy.textContent = stateMode.metrics.entropy.label;
    elements.metricConfidence.textContent = stateMode.metrics.confidence.label;
    elements.metricLikelyNext.textContent = stateMode.metrics.likelyNext.label;
    elements.metricAway.textContent = stateMode.metrics.away.label;

    setBarScale(elements.propensityFill, stateMode.propensityBar);
    setBarScale(elements.barTrajectory, stateMode.metrics.trajectory.scale);
    setBarScale(elements.barDwell, stateMode.metrics.dwell.scale);
    setBarScale(elements.barEntropy, stateMode.metrics.entropy.scale);
    setBarScale(elements.barConfidence, stateMode.metrics.confidence.scale);
    setBarScale(elements.barLikelyNext, stateMode.metrics.likelyNext.scale);
    setBarScale(elements.barAway, stateMode.metrics.away.scale);

    hasRendered = true;
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    if (autoplayButton) autoplayButton.setAttribute('aria-pressed', 'false');
  };

  const advanceState = () => {
    const currentIndex = BEHAVIORAL_TOPOGRAPHY_STATES.findIndex((state) => state.id === activeStateId);
    const nextIndex = (currentIndex + 1) % BEHAVIORAL_TOPOGRAPHY_STATES.length;
    activeStateId = BEHAVIORAL_TOPOGRAPHY_STATES[nextIndex].id;
    render();
  };

  const startAutoplay = () => {
    if (reducedMotion || autoplayTimer) return;
    autoplayTimer = window.setInterval(advanceState, 4200);
    if (autoplayButton) autoplayButton.setAttribute('aria-pressed', 'true');
  };

  stateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextState = button.dataset.state;
      if (!nextState || nextState === activeStateId) return;
      activeStateId = nextState;
      stopAutoplay();
      render();
    });
  });

  storyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextState = button.dataset.storyState;
      if (!nextState || nextState === activeStateId) return;
      activeStateId = nextState;
      stopAutoplay();
      render();
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextMode = button.dataset.calibrationMode;
      if (nextMode !== 'calibrated' && nextMode !== 'raw') return;
      mode = nextMode;
      render();
    });
  });

  if (autoplayButton) {
    if (reducedMotion) {
      autoplayButton.hidden = true;
    } else {
      autoplayButton.addEventListener('click', () => {
        if (autoplayTimer) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }
  }

  if (revealToggle && revealPanel) {
    revealToggle.addEventListener('click', () => {
      const expanded = revealToggle.getAttribute('aria-expanded') === 'true';
      syncReveal(!expanded);
    });

    syncReveal(false);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
  });

  render();
}

function setupMarketingCheatSheet() {
  const roots = Array.from(document.querySelectorAll('[data-cheatsheet-root]'));
  if (!roots.length) return;

  const canonicalHref =
    document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? window.location.href;
  const canonicalUrl = new URL(canonicalHref, window.location.href);
  const publicCheatSheetUrl = new URL('./cheatsheet.html', canonicalUrl).toString();
  const publicMarkdownUrl = new URL('./marketing-cheatsheet.md', canonicalUrl).toString();
  const localCheatSheetUrl = new URL('./cheatsheet.html', window.location.href);
  const printCheatSheetUrl = new URL(localCheatSheetUrl.toString());
  printCheatSheetUrl.searchParams.set('print', '1');
  const localMarkdownUrl = new URL('./marketing-cheatsheet.md', window.location.href).toString();

  const emailBody = [
    MARKETING_CHEATSHEET.emailIntro,
    '',
    `Printable sheet: ${publicCheatSheetUrl}`,
    `Markdown reference: ${publicMarkdownUrl}`,
    '',
    'Use this to correlate the math, the psychological state, and the recommended intervention.',
  ].join('\n');
  const whatsappText = `${MARKETING_CHEATSHEET.whatsappIntro}\n${publicCheatSheetUrl}`;

  const cardsMarkup = MARKETING_CHEATSHEET.rows.map(
    (row) => `
      <article class="cheatsheet-card cheatsheet-card-${row.id}">
        <div class="cheatsheet-card-head">
          <span class="cheatsheet-card-state">
            <span class="cheatsheet-card-tone" aria-hidden="true"></span>
            ${escapeHtml(row.state)}
          </span>
          <span class="cheatsheet-card-propensity">${escapeHtml(row.propensity)}</span>
        </div>
        <div class="cheatsheet-card-copy">
          <h3>${escapeHtml(row.profileTitle)}</h3>
          <p class="cheatsheet-card-summary">${escapeHtml(row.profileSummary)}</p>
        </div>
        <dl class="cheatsheet-card-list">
          <div>
            <dt>SDK event</dt>
            <dd>${escapeHtml(row.event)}</dd>
          </div>
          <div>
            <dt>Engine math + developer check</dt>
            <dd>${escapeHtml(row.developerCheck)}</dd>
          </div>
          <div>
            <dt>Propensity</dt>
            <dd>${escapeHtml(row.propensity)}</dd>
          </div>
          <div>
            <dt>Business action</dt>
            <dd><strong>${escapeHtml(row.actionTitle)}</strong> ${escapeHtml(row.actionSummary)}</dd>
          </div>
        </dl>
      </article>
    `,
  ).join('');

  roots.forEach((root) => {
    root.querySelectorAll('[data-cheatsheet-grid]').forEach((element) => {
      element.innerHTML = cardsMarkup;
    });

    root.querySelectorAll('[data-cheatsheet-mandate-title]').forEach((element) => {
      element.textContent = MARKETING_CHEATSHEET.mandateTitle;
    });

    root.querySelectorAll('[data-cheatsheet-mandate-summary]').forEach((element) => {
      element.textContent = MARKETING_CHEATSHEET.mandateSummary;
    });

    root.querySelectorAll('[data-cheatsheet-mandate-detail]').forEach((element) => {
      element.textContent = MARKETING_CHEATSHEET.mandateDetail;
    });

    root.querySelectorAll('[data-cheatsheet-page-link]').forEach((element) => {
      element.setAttribute('href', localCheatSheetUrl.toString());
    });

    root.querySelectorAll('[data-cheatsheet-markdown-link]').forEach((element) => {
      element.setAttribute('href', localMarkdownUrl);
    });

    root.querySelectorAll('[data-cheatsheet-email]').forEach((element) => {
      element.setAttribute(
        'href',
        `mailto:?subject=${encodeURIComponent(MARKETING_CHEATSHEET.emailSubject)}&body=${encodeURIComponent(emailBody)}`,
      );
    });

    root.querySelectorAll('[data-cheatsheet-whatsapp]').forEach((element) => {
      element.setAttribute(
        'href',
        `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
      );
    });

    root.querySelectorAll('[data-cheatsheet-print]').forEach((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault();

        if (document.body.classList.contains('cheatsheet-page')) {
          window.print();
          return;
        }

        const popup = window.open(printCheatSheetUrl.toString(), '_blank', 'noopener');
        if (!popup) window.location.href = printCheatSheetUrl.toString();
      });
    });
  });

  if (
    document.body.classList.contains('cheatsheet-page') &&
    new URLSearchParams(window.location.search).get('print') === '1'
  ) {
    window.setTimeout(() => window.print(), 220);
  }
}

function setupBackToTop() {
  const button = document.getElementById('back-to-top');
  const header = document.getElementById('site-header');
  if (!button || !header) return;

  const sync = () => {
    const scrolled = window.scrollY > 24;
    const showButton = window.scrollY > window.innerHeight * 0.8;
    header.classList.toggle('is-scrolled', scrolled);
    button.hidden = !showButton;
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

renderNav();
renderStartHere();
renderProducts();
renderIntegrations();
renderArticles();
setupCommerceEstimator();
setupCommercePlaybookTabs();
setupBehavioralPlayground();
setupMarketingCheatSheet();
setupReveal();
setupBackToTop();
setYear();
