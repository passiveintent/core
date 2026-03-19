/**
 * AmazonPlayground — Premium e-commerce showcase.
 * Tab-based layout with auto-play cinematic intro + all 8 simulation buttons
 * in a compact toolbar. No long scroll — Signal Map and Testing Guide live in tabs.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import { timerAdapter, lifecycleAdapter } from '../adapters';
import { useToast } from '../components/Toast';
import PageHeader from '../components/PageHeader';
import ShowcaseTabs from '../components/ShowcaseTabs';
import ProofBar from '../components/ProofBar';
import { useSimGuard } from '../hooks/useSimGuard';
import type {
  HighEntropyPayload,
  DwellTimeAnomalyPayload,
  HesitationDetectedPayload,
  TrajectoryAnomalyPayload,
  AttentionReturnPayload,
  ExitIntentPayload,
} from '@passiveintent/react';

/** Yield to the browser so React can flush a render. */
const yieldFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

// ─── Product catalogue ────────────────────────────────────────────────────────

type Vertical = 'apparel' | 'electronics' | 'furniture' | 'beauty';

interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  state: string;
  vertical: Vertical;
  tag: string;
}

const PRODUCTS: Product[] = [
  // Apparel
  {
    id: 'a1',
    name: 'Alpine Chelsea Boot',
    emoji: '👢',
    price: 198,
    originalPrice: 248,
    rating: 4.6,
    reviews: 2341,
    state: '/product/boot',
    vertical: 'apparel',
    tag: 'High-AOV footwear',
  },
  {
    id: 'a2',
    name: 'Merino Crew Sweater',
    emoji: '🧥',
    price: 129,
    originalPrice: 169,
    rating: 4.8,
    reviews: 1893,
    state: '/product/sweater',
    vertical: 'apparel',
    tag: 'Premium knitwear',
  },
  // Electronics
  {
    id: 'e1',
    name: 'Wireless Headphones Pro',
    emoji: '🎧',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 3421,
    state: '/product/headphones',
    vertical: 'electronics',
    tag: 'Spec comparison bait',
  },
  {
    id: 'e2',
    name: 'USB-C Monitor 4K',
    emoji: '🖥️',
    price: 549,
    originalPrice: 699,
    rating: 4.3,
    reviews: 876,
    state: '/product/monitor',
    vertical: 'electronics',
    tag: 'High-AOV gadget',
  },
  // Furniture
  {
    id: 'f1',
    name: 'Modular Sectional Sofa',
    emoji: '🛋️',
    price: 1499,
    originalPrice: 1899,
    rating: 4.4,
    reviews: 512,
    state: '/product/sofa',
    vertical: 'furniture',
    tag: 'Room-fit uncertainty',
  },
  {
    id: 'f2',
    name: 'Oak Writing Desk',
    emoji: '🪑',
    price: 649,
    originalPrice: 849,
    rating: 4.7,
    reviews: 1024,
    state: '/product/desk',
    vertical: 'furniture',
    tag: 'Measurement hesitation',
  },
  // Beauty
  {
    id: 'b1',
    name: 'Vitamin C Serum Bundle',
    emoji: '✨',
    price: 89,
    originalPrice: 119,
    rating: 4.9,
    reviews: 4821,
    state: '/product/serum',
    vertical: 'beauty',
    tag: 'Regimen doubt',
  },
  {
    id: 'b2',
    name: 'Barrier Repair Cream',
    emoji: '🧴',
    price: 64,
    originalPrice: 84,
    rating: 4.6,
    reviews: 2310,
    state: '/product/cream',
    vertical: 'beauty',
    tag: 'Bundle fragility',
  },
];

// ─── Intervention types ───────────────────────────────────────────────────────

interface Intervention {
  id: number;
  type:
    | 'free-shipping'
    | 'discount'
    | 'welcome-back'
    | 'zendesk'
    | 'idle'
    | 'compare'
    | 'guarantee'
    | 'cancel-sub';
  icon: string;
  title: string;
  body: string;
  trigger: string;
}

type StoreTab = 'store' | 'verticals' | 'signals' | 'guide';

const STORE_TABS = [
  { key: 'store' as StoreTab, label: 'Store' },
  { key: 'verticals' as StoreTab, label: 'Vertical Playbooks' },
  { key: 'signals' as StoreTab, label: 'Signal Map' },
  { key: 'guide' as StoreTab, label: 'Testing Guide' },
];

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<Vertical | 'all', string> = {
  all: '🛒',
  apparel: '👗',
  electronics: '⚡',
  furniture: '🛋',
  beauty: '✨',
};

const CATEGORY_LABELS: Record<Vertical | 'all', string> = {
  all: 'All Departments',
  apparel: 'Apparel',
  electronics: 'Electronics',
  furniture: 'Furniture',
  beauty: 'Beauty',
};

const VERTICAL_ORDER: Vertical[] = ['apparel', 'electronics', 'furniture', 'beauty'];

interface VerticalPlaybook {
  tabLabel: string;
  tabSub: string;
  eyebrow: string;
  title: string;
  summary: string;
  focusProductId: string;
  primarySignal: string;
  primaryResponse: string;
  demoCta: string;
  chips: string[];
  journey: Array<{
    label: string;
    title: string;
    body: string;
  }>;
  principles: Array<{
    label: string;
    body: string;
  }>;
}

const VERTICAL_PLAYBOOKS: Record<Vertical, VerticalPlaybook> = {
  apparel: {
    tabLabel: 'Apparel',
    tabSub: 'Fit reassurance',
    eyebrow: 'Apparel, Footwear & Denim',
    title: 'Remove fit doubt before it turns into a quiet bounce.',
    summary:
      'A premium shopper does not need a loud promo. They need confidence that choosing between sizes is low-risk and reversible.',
    focusProductId: 'a1',
    primarySignal: 'hesitation_detected',
    primaryResponse: 'Fit reassurance + free returns',
    demoCta: 'Simulate fit hesitation',
    chips: ['Fit doubt', 'Return assurance', 'Confidence-first'],
    journey: [
      {
        label: 'Customer moment',
        title: 'Caught between adjacent sizes.',
        body: 'The shopper pauses on a high-AOV item and oscillates between neighboring options instead of committing.',
      },
      {
        label: 'PassiveIntent sees',
        title: 'Hover jitter and policy dwell.',
        body: 'Repeated focus around size controls paired with longer return-policy attention signals latent fit anxiety.',
      },
      {
        label: 'Best response',
        title: 'Offer graceful reversibility.',
        body: 'Lead with free returns and fit reassurance so the brand feels helpful, not needy.',
      },
    ],
    principles: [
      {
        label: 'Tone',
        body: 'Confidence over urgency. The experience should feel like clienteling, not conversion pressure.',
      },
      {
        label: 'Timing',
        body: 'Intervene while the size choice is still active so doubt does not become abandonment.',
      },
      {
        label: 'Why it works',
        body: 'You preserve margin because reassurance solves the friction without teaching users to wait for discounts.',
      },
    ],
  },
  electronics: {
    tabLabel: 'Electronics',
    tabSub: 'Guided compare',
    eyebrow: 'Electronics & Gadgets',
    title: 'Turn spec fatigue into guided confidence.',
    summary:
      'Complex comparison should feel clarifying, not exhausting. The goal is to reduce cognitive load without dumbing down the product.',
    focusProductId: 'e1',
    primarySignal: 'trajectory_anomaly',
    primaryResponse: 'Guided compare + expert assist',
    demoCta: 'Simulate spec fatigue',
    chips: ['Spec fatigue', 'Expert assist', 'Decision clarity'],
    journey: [
      {
        label: 'Customer moment',
        title: 'Comparison turns into paralysis.',
        body: 'The shopper bounces between premium SKUs, reading specs longer but feeling less certain with each pass.',
      },
      {
        label: 'PassiveIntent sees',
        title: 'Long dwell with erratic comparison paths.',
        body: 'Repeated table scans and atypical jumps between detail states suggest information overload rather than healthy research.',
      },
      {
        label: 'Best response',
        title: 'Offer a concise guided compare.',
        body: 'Surface the two or three specs that actually separate the decision, then invite expert help only if needed.',
      },
    ],
    principles: [
      {
        label: 'Tone',
        body: 'Editorial, not salesy. The product page should feel curated, almost like a keynote slide.',
      },
      {
        label: 'Timing',
        body: 'Reveal assistance after fatigue appears, not at first load, so the page still feels confident and clean.',
      },
      {
        label: 'Why it works',
        body: 'Reducing decision complexity keeps premium electronics feeling considered instead of overwhelming.',
      },
    ],
  },
  furniture: {
    tabLabel: 'Furniture',
    tabSub: 'Room-fit rescue',
    eyebrow: 'Premium Furniture & Home',
    title: 'Catch the measurement exit before the shopper disappears.',
    summary:
      'Furniture is lost in the pause before the exit. Great playbooks make room-fit uncertainty feel supported and easy to resume later.',
    focusProductId: 'f1',
    primarySignal: 'attention_return',
    primaryResponse: 'Save setup + preserve today’s price',
    demoCta: 'Simulate room-fit exit',
    chips: ['Room-fit doubt', 'Save state', 'Price confidence'],
    journey: [
      {
        label: 'Customer moment',
        title: 'Leaves to measure the room.',
        body: 'The shopper wants the product, but the buying flow breaks the instant they have to validate fit in the real world.',
      },
      {
        label: 'PassiveIntent sees',
        title: 'Trajectory drift before exit.',
        body: 'Movement toward sizing details, dimensions, and abrupt navigation changes often appears before explicit exit intent.',
      },
      {
        label: 'Best response',
        title: 'Preserve continuity, not pressure.',
        body: 'Offer to save the setup, lock today’s price, and make the return path effortless when the shopper comes back.',
      },
    ],
    principles: [
      {
        label: 'Tone',
        body: 'Calm and architectural. The brand should feel certain, like a good design consultant.',
      },
      {
        label: 'Timing',
        body: 'Assist during the uncertainty window, before the shopper fully leaves the decision context.',
      },
      {
        label: 'Why it works',
        body: 'You retain intent without forcing the decision into a moment when the shopper still needs offline validation.',
      },
    ],
  },
  beauty: {
    tabLabel: 'Beauty',
    tabSub: 'Routine integrity',
    eyebrow: 'Beauty & Skincare',
    title: 'Keep the regimen together without sounding promotional.',
    summary:
      'Beauty journeys break when the shopper loses confidence in the full routine. The intervention has to feel like expert care, not a bundle trick.',
    focusProductId: 'b1',
    primarySignal: 'hesitation_detected',
    primaryResponse: 'Routine reassurance + gift-with-care',
    demoCta: 'Simulate regimen doubt',
    chips: ['Routine doubt', 'Bundle stability', 'Gift-with-care'],
    journey: [
      {
        label: 'Customer moment',
        title: 'The hero product stays, the routine wobbles.',
        body: 'Interest remains high, but hesitation forms around the supporting products that complete the regimen.',
      },
      {
        label: 'PassiveIntent sees',
        title: 'Jitter around remove and compare actions.',
        body: 'Subtle hesitation around bundle composition reveals uncertainty about whether the complete routine is worth it.',
      },
      {
        label: 'Best response',
        title: 'Reward commitment with care.',
        body: 'Use a tasteful gift or compatibility cue to keep the bundle coherent without cheapening the brand.',
      },
    ],
    principles: [
      {
        label: 'Tone',
        body: 'Consultative and polished. Think beauty advisor, not cart recovery bot.',
      },
      {
        label: 'Timing',
        body: 'Respond once fragility appears in the bundle, while the shopper still feels agency over the routine.',
      },
      {
        label: 'Why it works',
        body: 'The intervention protects basket size while reinforcing trust in the regimen itself.',
      },
    ],
  },
};

function getPlaybookFocusProduct(vertical: Vertical) {
  return (
    PRODUCTS.find((product) => product.id === VERTICAL_PLAYBOOKS[vertical].focusProductId) ??
    PRODUCTS.find((product) => product.vertical === vertical) ??
    PRODUCTS[0]
  );
}

const PLAYBOOK_HESITATION_PATHS: Record<Vertical, { dwell: string; resolve: string }> = {
  apparel: {
    dwell: '/amazon/help/size-guide',
    resolve: '/amazon/help/returns',
  },
  electronics: {
    dwell: '/amazon/compare/specs',
    resolve: '/amazon/help/compatibility',
  },
  furniture: {
    dwell: '/amazon/help/room-measurements',
    resolve: '/amazon/help/delivery',
  },
  beauty: {
    dwell: '/amazon/help/routine-builder',
    resolve: '/amazon/help/ingredient-faq',
  },
};

function renderVerticalVisual(vertical: Vertical) {
  switch (vertical) {
    case 'apparel':
      return (
        <div className="showcase-vertical-screen">
          <span className="showcase-vertical-screen-label">Sizing anxiety pattern</span>
          <div className="showcase-size-grid">
            <span>8</span>
            <span>8.5</span>
            <span className="is-live">9</span>
            <span className="is-live-alt">10</span>
          </div>
          <div className="showcase-vertical-toast">
            <span className="showcase-modal-kicker">Intervention</span>
            <strong>Unsure about the fit? Free returns if you order today.</strong>
          </div>
        </div>
      );
    case 'electronics':
      return (
        <div className="showcase-vertical-screen">
          <span className="showcase-vertical-screen-label">Comparison overload</span>
          <div className="showcase-spec-table">
            <div>
              <span>Battery</span>
              <strong>18h / 24h</strong>
            </div>
            <div>
              <span>Camera</span>
              <strong>48MP / 64MP</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>191g / 208g</strong>
            </div>
          </div>
          <div className="showcase-vertical-toast">
            <span className="showcase-modal-kicker">Intervention</span>
            <strong>Compare specs live with a product expert right now.</strong>
          </div>
        </div>
      );
    case 'furniture':
      return (
        <div className="showcase-vertical-screen">
          <span className="showcase-vertical-screen-label">Room-fit uncertainty</span>
          <div className="showcase-dimension-card">
            <div>
              <span>Sectional width</span>
              <strong>96 in</strong>
            </div>
            <div>
              <span>Doorway clearance</span>
              <strong>34 in</strong>
            </div>
          </div>
          <div className="showcase-vertical-toast">
            <span className="showcase-modal-kicker">Intervention</span>
            <strong>Need to measure? Email this setup and keep today&apos;s price.</strong>
          </div>
        </div>
      );
    case 'beauty':
      return (
        <div className="showcase-vertical-screen">
          <span className="showcase-vertical-screen-label">Bundle doubt</span>
          <div className="showcase-bundle-stack">
            <div>
              <span>Vitamin C Serum</span>
              <strong>Keep</strong>
            </div>
            <div>
              <span>Barrier Cream</span>
              <strong>Keep</strong>
            </div>
            <div>
              <span>Travel Cleanser</span>
              <strong className="showcase-bundle-free">Free</strong>
            </div>
          </div>
          <div className="showcase-vertical-toast">
            <span className="showcase-modal-kicker">Intervention</span>
            <strong>Keep the bundle together and we&apos;ll add a free travel cleanser.</strong>
          </div>
        </div>
      );
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AmazonPlayground() {
  const { track, on, incrementCounter, resetCounter } = usePassiveIntent();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=browsing, 1=cart, 2=payment
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [prevExpanded, setPrevExpanded] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StoreTab>('store');
  const [verticalFilter, setVerticalFilter] = useState<Vertical | 'all'>('all');
  const [activeVerticalPlaybook, setActiveVerticalPlaybook] = useState<Vertical>('apparel');
  const [autoPlayDone, setAutoPlayDone] = useState(false);
  const runGuarded = useSimGuard();
  const interventionSeqRef = useRef(0);
  const mountedRef = useRef(false);
  const { toast } = useToast();

  // ─── Derived state ────────────────────────────────────────────────────────

  const groupedProducts = useMemo(() => {
    return VERTICAL_ORDER.filter((v) => verticalFilter === 'all' || v === verticalFilter).map(
      (v) => ({
        vertical: v,
        products: PRODUCTS.filter((p) => p.vertical === v),
      }),
    );
  }, [verticalFilter]);

  const orderTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems],
  );

  const activeIntervention = interventions[0] ?? null;
  const previousInterventions = interventions.slice(1);
  const activePlaybook = VERTICAL_PLAYBOOKS[activeVerticalPlaybook];
  const activePlaybookProduct = getPlaybookFocusProduct(activeVerticalPlaybook);
  const promoteSignals = Boolean(activeIntervention);

  const rightPanelMode: 'detail' | 'cart' | 'checkout' | 'overview' =
    checkoutStep === 2
      ? 'checkout'
      : checkoutStep === 1
        ? 'cart'
        : selectedProduct
          ? 'detail'
          : 'overview';
  const promoteContextPanel = promoteSignals || rightPanelMode !== 'overview';

  // Track page load
  useEffect(() => {
    track('/amazon/home');
  }, [track]);

  const pushIntervention = useCallback((iv: Omit<Intervention, 'id'>) => {
    setInterventions((prev) => [{ ...iv, id: ++interventionSeqRef.current }, ...prev].slice(0, 8));
  }, []);

  const dismissIntervention = useCallback((id: number) => {
    setInterventions((prev) => prev.filter((i) => i.id !== id));
  }, []);

  useEffect(() => {
    if (interventions.length <= 1) {
      setPrevExpanded(false);
    }
  }, [interventions.length]);

  // ─── Wire up signals → interventions ─────────────────────────────────────

  useEffect(() => {
    const unsubs = [
      on('dwell_time_anomaly', (p) => {
        const payload = p as DwellTimeAnomalyPayload;
        pushIntervention({
          type: 'free-shipping',
          icon: '🚚',
          title: 'Free Shipping on orders over $50!',
          body: `Paused on "${payload.state}" — z-score: ${payload.zScore.toFixed(1)} (n=${payload.sampleSize})`,
          trigger: 'dwell_time_anomaly',
        });
      }),
      on('high_entropy', (p) => {
        const payload = p as HighEntropyPayload;
        pushIntervention({
          type: 'zendesk',
          icon: '💬',
          title: 'Need help? Chat with us!',
          body: `Rapid navigation on "${payload.state}" — entropy: ${payload.normalizedEntropy.toFixed(2)}`,
          trigger: 'high_entropy',
        });
      }),
      on('trajectory_anomaly', (p) => {
        const payload = p as TrajectoryAnomalyPayload;
        pushIntervention({
          type: 'compare',
          icon: '⚖️',
          title: 'Compare these products side by side?',
          body: `Unusual path ${payload.stateFrom} → ${payload.stateTo} (z-score: ${payload.zScore.toFixed(1)}, n=${payload.sampleSize})`,
          trigger: 'trajectory_anomaly',
        });
      }),
      on('exit_intent', (p) => {
        const payload = p as ExitIntentPayload;
        pushIntervention({
          type: 'discount',
          icon: '🏷️',
          title: "Wait — here's 10% off your order!",
          body: `Exit intent from "${payload.state}" — likely next: ${payload.likelyNext ?? 'unknown'}`,
          trigger: 'exit_intent',
        });
      }),
      on('attention_return', (p) => {
        const payload = p as AttentionReturnPayload;
        const secs = Math.round(payload.hiddenDuration / 1000);
        pushIntervention({
          type: 'welcome-back',
          icon: '👋',
          title: 'Welcome back! Still interested?',
          body: `Away for ${secs}s from "${payload.state}"`,
          trigger: 'attention_return',
        });
      }),
      on('hesitation_detected', (p) => {
        const payload = p as HesitationDetectedPayload;
        if (payload.state.includes('cancel')) {
          pushIntervention({
            type: 'cancel-sub',
            icon: '🚫',
            title: "We'd hate to see you go — 3 months free!",
            body: `Hesitation on "${payload.state}" — dwell z: ${payload.dwellZScore.toFixed(1)}, traj z: ${payload.trajectoryZScore.toFixed(1)}`,
            trigger: 'hesitation_detected',
          });
        } else {
          pushIntervention({
            type: 'guarantee',
            icon: '🛡️',
            title: '100% money-back guarantee',
            body: `Hesitation on "${payload.state}" — dwell z: ${payload.dwellZScore.toFixed(1)}, traj z: ${payload.trajectoryZScore.toFixed(1)}`,
            trigger: 'hesitation_detected',
          });
        }
      }),
      on('user_idle', () => {
        pushIntervention({
          type: 'idle',
          icon: '⏳',
          title: 'Still shopping?',
          body: "You've been idle. We saved your cart!",
          trigger: 'user_idle',
        });
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [on, pushIntervention]);

  // ─── Auto-play cinematic intro ────────────────────────────────────────────

  const runAutoPlay = useCallback(async () => {
    await runGuarded(async () => {
      setSimulating(true);
      setSimStatus('Auto-play: browsing store…');
      try {
        // Browse a few products
        for (const p of PRODUCTS.slice(0, 3)) {
          track(p.state);
          setSelectedProduct(p);
          timerAdapter.fastForward(5500);
          await yieldFrame();
        }
        // Return to home and browse back-and-forth
        setSimStatus('Auto-play: comparison shopping…');
        const path = [
          '/amazon/home',
          PRODUCTS[0].state,
          '/amazon/home',
          PRODUCTS[2].state,
          '/amazon/home',
        ];
        for (const s of path) {
          track(s);
          timerAdapter.fastForward(4000);
          await yieldFrame();
        }
        timerAdapter.resetOffset();
      } finally {
        setSimulating(false);
        setSimStatus(null);
        setAutoPlayDone(true);
      }
    });
  }, [runGuarded, track]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const t = setTimeout(() => runAutoPlay(), 600);
    return () => clearTimeout(t);
  }, [runAutoPlay]);

  // ─── Simulation handlers ──────────────────────────────────────────────────

  const simulateRageClicks = useCallback(
    () =>
      runGuarded(async () => {
        setSimulating(true);
        setSimStatus('Simulating rage clicks…');
        try {
          const hub = '/amazon/home';
          for (let round = 0; round < 3; round++) {
            for (const p of PRODUCTS) {
              timerAdapter.fastForward(100);
              track(hub);
              timerAdapter.fastForward(100);
              track(p.state);
            }
            await yieldFrame();
          }
        } finally {
          timerAdapter.resetOffset();
          setSimulating(false);
          setSimStatus(null);
          toast('😤 Rage clicks → high_entropy', 'warning');
        }
      }),
    [runGuarded, track, toast],
  );

  const simulateBrowseBackForth = useCallback(
    () =>
      runGuarded(async () => {
        setSimulating(true);
        setSimStatus('Simulating browse back & forth…');
        try {
          const states = [
            '/amazon/home',
            '/amazon/deals',
            '/product/headphones',
            '/amazon/home',
            '/product/keyboard',
            '/amazon/deals',
            '/amazon/home',
            '/product/monitor',
            '/amazon/home',
          ];
          for (let i = 0; i < states.length; i++) {
            timerAdapter.fastForward(5000);
            track(states[i]);
            if (i % 3 === 2) await yieldFrame();
          }
        } finally {
          timerAdapter.resetOffset();
          setSimulating(false);
          setSimStatus(null);
          toast('🔄 Browse done → dwell / trajectory anomaly', 'info');
        }
      }),
    [runGuarded, track, toast],
  );

  const simulateExitIntent = useCallback(() => {
    lifecycleAdapter.triggerExitIntent();
    setSimStatus('Exit Intent fired!');
    setTimeout(() => setSimStatus(null), 1500);
    toast('🚪 exit_intent fired', 'info');
  }, [toast]);

  const simulateTabSwitch = useCallback(() => {
    lifecycleAdapter.triggerPause();
    setSimStatus('Tab away — returning in 2s…');
    setTimeout(() => {
      lifecycleAdapter.triggerResume();
      setSimStatus(null);
      toast('👁 attention_return fired', 'info');
    }, 2000);
  }, [toast]);

  const simulateBotActivity = useCallback(
    () =>
      runGuarded(async () => {
        setSimulating(true);
        setSimStatus('Simulating bot activity…');
        try {
          for (let round = 0; round < 3; round++) {
            for (const p of PRODUCTS) {
              track(p.state);
            }
            track('/amazon/home');
            track('/amazon/deals');
            track('/amazon/cart');
            await yieldFrame();
          }
        } finally {
          timerAdapter.resetOffset();
          setSimulating(false);
          setSimStatus(null);
          toast('🤖 Bot sim done → bot_detected', 'warning');
        }
      }),
    [runGuarded, track, toast],
  );

  const simulateCancelSubscription = useCallback(
    () =>
      runGuarded(async () => {
        setSimulating(true);
        setSimStatus('Simulating cancel subscription flow…');
        try {
          const cancelPath = [
            '/account/settings',
            '/account/cancel-subscription',
            '/account/cancel-subscription',
            '/account/cancel-subscription/reason',
            '/account/cancel-subscription',
            '/account/cancel-subscription/confirm',
            '/account/cancel-subscription',
            '/account/cancel-subscription/confirm',
          ];
          for (let i = 0; i < cancelPath.length; i++) {
            timerAdapter.fastForward(4000);
            track(cancelPath[i]);
            if (i % 3 === 2) await yieldFrame();
          }
        } finally {
          timerAdapter.resetOffset();
          setSimulating(false);
          setSimStatus(null);
          toast('🚫 Cancel sim done → hesitation_detected', 'warning');
        }
      }),
    [runGuarded, track, toast],
  );

  const goToPayment = useCallback(() => {
    track('/amazon/checkout/payment');
    setCheckoutStep(2);
  }, [track]);

  // ─── Store handlers ───────────────────────────────────────────────────────

  const selectProduct = useCallback(
    (product: Product) => {
      track(product.state);
      setSelectedProduct(product);
      setCheckoutStep(0);
    },
    [track],
  );

  const addToCart = useCallback(
    (product: Product) => {
      track('/amazon/cart');
      setCartItems((prev) => [...prev, product]);
      incrementCounter('cart-items', 1);
      setCheckoutStep(1);
    },
    [incrementCounter, track],
  );

  const backToBrowse = useCallback(() => {
    track('/amazon/home');
    setCheckoutStep(0);
    setSelectedProduct(null);
  }, [track]);

  const openPlaybookInStore = useCallback(
    (vertical: Vertical) => {
      const focusProduct = getPlaybookFocusProduct(vertical);
      setActiveVerticalPlaybook(vertical);
      setActiveTab('store');
      setVerticalFilter(vertical);
      setCheckoutStep(0);
      setSelectedProduct(focusProduct);
      track(focusProduct.state);
    },
    [track],
  );

  const simulateProductHesitation = useCallback(
    (vertical: Vertical = activeVerticalPlaybook) =>
      runGuarded(async () => {
        const focusProduct = getPlaybookFocusProduct(vertical);
        const hesitationPath = PLAYBOOK_HESITATION_PATHS[vertical];
        setSimulating(true);
        setSimStatus(
          `Simulating ${VERTICAL_PLAYBOOKS[vertical].tabLabel.toLowerCase()} hesitation…`,
        );
        try {
          setActiveVerticalPlaybook(vertical);
          setActiveTab('store');
          setVerticalFilter(vertical);
          setCheckoutStep(0);
          setSelectedProduct(focusProduct);

          for (let i = 0; i < 4; i++) {
            track('/amazon/home');
            timerAdapter.fastForward(1400);
            track(focusProduct.state);
            timerAdapter.fastForward(2200);
            track('/amazon/home');
            timerAdapter.fastForward(1600);
            if (i % 2 === 1) await yieldFrame();
          }

          track(hesitationPath.dwell);
          timerAdapter.fastForward(7 * 60 * 1000);
          track(hesitationPath.resolve);
          timerAdapter.fastForward(4500);
          track(focusProduct.state);
          await yieldFrame();
        } finally {
          timerAdapter.resetOffset();
          setSimulating(false);
          setSimStatus(null);
          toast('🤔 Hesitation → hesitation_detected', 'warning');
        }
      }),
    [activeVerticalPlaybook, runGuarded, track, toast],
  );

  const runPlaybookDemo = useCallback(
    (vertical: Vertical) => {
      switch (vertical) {
        case 'apparel':
        case 'beauty':
          void simulateProductHesitation(vertical);
          break;
        case 'electronics':
          openPlaybookInStore(vertical);
          void simulateBrowseBackForth();
          break;
        case 'furniture':
          openPlaybookInStore(vertical);
          simulateTabSwitch();
          break;
      }
    },
    [openPlaybookInStore, simulateBrowseBackForth, simulateProductHesitation, simulateTabSwitch],
  );

  const commerceContextSection = (
    <div className={`amazon-right-section${!promoteSignals ? ' amazon-right-section--focus' : ''}`}>
      {rightPanelMode === 'overview' && (
        <>
          <p className="amazon-right-panel-title">Store Snapshot</p>
          <div className="amazon-right-metrics">
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val">{PRODUCTS.length}</span>
              <span className="amazon-right-metric-lbl">Products</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val">{cartItems.length}</span>
              <span className="amazon-right-metric-lbl">In Cart</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val amazon-right-metric-val--sm">
                {autoPlayDone ? 'Ready' : 'Running'}
              </span>
              <span className="amazon-right-metric-lbl">Auto-play</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val amazon-right-metric-val--sm">
                {activeIntervention ? 'Live' : 'Armed'}
              </span>
              <span className="amazon-right-metric-lbl">Signals</span>
            </div>
          </div>
          <p className="amazon-right-copy">
            Select a product or run a simulation. The rail now promotes the currently important
            state instead of treating it like secondary metadata.
          </p>
        </>
      )}

      {rightPanelMode === 'detail' && selectedProduct && (
        <div className="amazon-right-detail">
          <div className="amazon-right-detail-head">
            <div>
              <p className="amazon-right-panel-title">Product Detail</p>
              <h3>{selectedProduct.name}</h3>
            </div>
            <span className="badge badge-blue">Focus</span>
          </div>
          <div className="amazon-right-detail-thumb">{selectedProduct.emoji}</div>
          <span
            className={`product-vertical-tag product-vertical-tag-${selectedProduct.vertical} amazon-right-detail-tag`}
          >
            {selectedProduct.tag}
          </span>
          <div className="amazon-right-metrics">
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val">${selectedProduct.price.toFixed(2)}</span>
              <span className="amazon-right-metric-lbl">Price</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val">{selectedProduct.rating}★</span>
              <span className="amazon-right-metric-lbl">Rating</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val">
                {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
              </span>
              <span className="amazon-right-metric-lbl">Discount</span>
            </div>
            <div className="amazon-right-metric">
              <span className="amazon-right-metric-val amazon-right-metric-val--sm">
                {selectedProduct.reviews.toLocaleString()}
              </span>
              <span className="amazon-right-metric-lbl">Reviews</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() => addToCart(selectedProduct)}
          >
            🛒 Add to Cart
          </button>
        </div>
      )}

      {rightPanelMode === 'cart' && (
        <>
          <div className="amazon-right-detail-head">
            <div>
              <p className="amazon-right-panel-title">Cart Summary</p>
              <strong className="amazon-right-focus-copy">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} ready for checkout
              </strong>
            </div>
            <span className="badge badge-blue">Focus</span>
          </div>
          {cartItems.map((item, i) => (
            <div key={`rc-${item.id}-${i}`} className="amazon-right-cart-row">
              <span>{item.emoji}</span>
              <span className="arc-name">{item.name}</span>
              <span className="arc-price">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="arc-total">Total: ${orderTotal.toFixed(2)}</div>
          <button type="button" className="btn btn-primary btn-full btn-mt" onClick={goToPayment}>
            Proceed to Payment →
          </button>
        </>
      )}

      {rightPanelMode === 'checkout' && (
        <>
          <div className="amazon-right-detail-head">
            <div>
              <p className="amazon-right-panel-title">Order Summary</p>
              <strong className="amazon-right-focus-copy">
                Keep the summary visible while hesitation signals surface.
              </strong>
            </div>
            <span className="badge badge-blue">Focus</span>
          </div>
          {cartItems.map((item, i) => (
            <div key={`summary-${item.id}-${i}`} className="amazon-right-cart-row">
              <span>{item.emoji}</span>
              <span className="arc-name">{item.name}</span>
              <span className="arc-price">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="arc-total">Total: ${orderTotal.toFixed(2)}</div>
          <div className="amazon-right-note">
            <span>Live demo cue</span>
            <strong>Slow down on payment to surface hesitation-driven interventions.</strong>
          </div>
        </>
      )}
    </div>
  );

  const liveInterventionSection = (
    <div
      className={`amazon-right-section amazon-right-section--signals${promoteSignals ? ' amazon-right-section--focus amazon-right-section--signals-live' : ''}`}
    >
      <div className="amazon-right-section-head">
        <div>
          <p className="amazon-right-panel-title">Live Interventions</p>
          <p className="amazon-right-section-copy">
            When intent changes, the intervention moves to the top of the rail so the team can see
            the decision moment in context.
          </p>
        </div>
        <span className={`badge ${activeIntervention ? 'badge-purple' : 'badge-blue'}`}>
          {activeIntervention ? `${interventions.length} live` : 'Standby'}
        </span>
      </div>

      {!activeIntervention ? (
        <p className="amazon-ea-empty">
          Browse products, hesitate, or run a simulation and the newest intervention will appear
          here.
        </p>
      ) : (
        <>
          <div className="amazon-right-live-banner">
            <span className="amazon-right-live-dot" />
            Signal detected on live session
          </div>
          <div className={`intervention intervention-${activeIntervention.type}`}>
            <span className="intervention-icon">{activeIntervention.icon}</span>
            <div className="intervention-body">
              <h4>{activeIntervention.title}</h4>
              <p>{activeIntervention.body}</p>
              <span
                className="badge badge-purple"
                style={{ marginTop: 4, display: 'inline-block', fontSize: 10 }}
              >
                Signal: {activeIntervention.trigger}
              </span>
            </div>
            <button
              type="button"
              className="intervention-dismiss"
              onClick={() => dismissIntervention(activeIntervention.id)}
            >
              ✕
            </button>
          </div>

          {previousInterventions.length > 0 && (
            <div className="interventions-history">
              <button
                type="button"
                className="btn btn-ghost btn-sm interventions-history-toggle"
                onClick={() => setPrevExpanded((expanded) => !expanded)}
              >
                {prevExpanded
                  ? 'Hide previous notifications'
                  : `Show ${previousInterventions.length} previous notification${previousInterventions.length > 1 ? 's' : ''}`}
              </button>
              {prevExpanded &&
                previousInterventions.map((iv) => (
                  <div
                    key={iv.id}
                    className={`intervention intervention-${iv.type} intervention-prev`}
                  >
                    <span className="intervention-icon">{iv.icon}</span>
                    <div className="intervention-body">
                      <h4>{iv.title}</h4>
                      <p>{iv.body}</p>
                      <span
                        className="badge badge-purple"
                        style={{ marginTop: 4, display: 'inline-block', fontSize: 10 }}
                      >
                        Signal: {iv.trigger}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="intervention-dismiss"
                      onClick={() => dismissIntervention(iv.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="showcase-page amazon-store">
      <PageHeader
        hook="usePassiveIntent() — dwell · entropy · trajectory · exit · attention · hesitation"
        title="E-Commerce Rescue"
        description={
          <>
            A live e-commerce simulation where <strong>real PassiveIntent signals</strong> trigger
            business-friendly interventions. Browse, hesitate, rage-click, or switch tabs to see the
            engine fire — signal to intervention in <strong>under 2ms, entirely on-device</strong>.
          </>
        }
      />

      {/* Simulation toolbar — labeled buttons */}
      <div className="showcase-toolbar">
        <div className="showcase-toolbar-buttons">
          {[
            {
              emoji: '🔄',
              label: 'Browse',
              fn: simulateBrowseBackForth,
              title:
                'Back-and-forth browsing with 5s dwell → dwell_time_anomaly, trajectory_anomaly',
            },
            {
              emoji: '😤',
              label: 'Rage Clicks',
              fn: simulateRageClicks,
              title: 'Rapid product switching (100ms) → high_entropy',
            },
            {
              emoji: '🤔',
              label: 'Hesitation',
              fn: () => simulateProductHesitation(),
              title: 'Prime and trigger hesitation_detected on the active product playbook',
            },
            {
              emoji: '🚪',
              label: 'Exit Intent',
              fn: simulateExitIntent,
              title: 'Trigger exit intent → exit_intent',
            },
            {
              emoji: '👁',
              label: 'Tab Away',
              fn: simulateTabSwitch,
              title: 'Tab away 2s then return → attention_return',
            },
            {
              emoji: '💳',
              label: 'Payment',
              fn: goToPayment,
              title: 'Go to payment page — linger to trigger hesitation_detected',
            },
            {
              emoji: '🚫',
              label: 'Cancel Flow',
              fn: simulateCancelSubscription,
              title: 'Hesitant cancel flow → hesitation_detected',
            },
            {
              emoji: '🤖',
              label: 'Bot Sim',
              fn: simulateBotActivity,
              title: 'Zero-dwell rapid navigation → bot_detected',
            },
            { emoji: '🏠', label: 'Reset', fn: backToBrowse, title: 'Return to product browse' },
          ].map(({ emoji, label, fn, title }) => (
            <button
              key={label}
              type="button"
              className="showcase-toolbar-btn"
              onClick={fn}
              disabled={simulating}
              title={title}
            >
              {emoji} <span className="toolbar-btn-label">{label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {simStatus && <span className="showcase-toolbar-status">⏳ {simStatus}</span>}
          {!simStatus && !autoPlayDone && (
            <span className="showcase-autoplay-badge">Auto-play running</span>
          )}
          {!simStatus && autoPlayDone && interventions.length === 0 && (
            <span className="showcase-toolbar-status">
              Interact or tap a button to trigger signals
            </span>
          )}
        </div>
      </div>

      {/* Tab bar + panels */}
      <ShowcaseTabs tabs={STORE_TABS} active={activeTab} onChange={setActiveTab}>
        {activeTab === 'store' && (
          <div
            className={`showcase-store-grid${checkoutStep > 0 ? ' showcase-store-grid--checkout' : ''}${promoteContextPanel ? ' showcase-store-grid--focus-top' : ''}`}
          >
            {checkoutStep === 0 && (
              <div className="amazon-sidebar">
                <div className="amazon-sidebar-section-label">Department</div>
                <ul className="amazon-category-list">
                  {(['all', 'apparel', 'electronics', 'furniture', 'beauty'] as const).map((v) => (
                    <li key={v}>
                      <button
                        type="button"
                        className={`amazon-category-item${verticalFilter === v ? ' active' : ''}`}
                        onClick={() => setVerticalFilter(v)}
                      >
                        {CATEGORY_ICONS[v]} {CATEGORY_LABELS[v]}
                      </button>
                    </li>
                  ))}
                </ul>
                {cartItems.length > 0 && (
                  <>
                    <div className="amazon-sidebar-divider" />
                    <div className="amazon-sidebar-cart">
                      <span className="amazon-sidebar-cart-count">
                        🛒 {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setCheckoutStep(1)}
                      >
                        View Cart →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="showcase-store-main">
              {checkoutStep === 0 && (
                <div className="amazon-main-panel">
                  <div className="amazon-main-head">
                    <div>
                      <span className="amazon-main-kicker">Live storefront</span>
                      <h3 className="amazon-main-title">
                        {verticalFilter === 'all'
                          ? 'Browse the full catalog'
                          : `${CATEGORY_LABELS[verticalFilter]} storefront`}
                      </h3>
                      <p className="amazon-main-copy">
                        Click products naturally or use the simulation toolbar. Signals are computed
                        live and interventions now dock into the layout instead of covering it.
                      </p>
                    </div>
                    <div className="amazon-main-stats">
                      <span className="amazon-main-stat">
                        {groupedProducts.reduce((count, group) => count + group.products.length, 0)}{' '}
                        products
                      </span>
                      <span className="amazon-main-stat">{cartItems.length} in cart</span>
                      <span className="amazon-main-stat">
                        {activeIntervention ? 'Signals live' : 'Signals armed'}
                      </span>
                    </div>
                  </div>

                  <div className="store-vertical-filter amazon-inline-filters">
                    {(['all', 'apparel', 'electronics', 'furniture', 'beauty'] as const).map(
                      (v) => (
                        <button
                          key={`inline-${v}`}
                          type="button"
                          className={`store-vertical-chip${verticalFilter === v ? ' active' : ''}`}
                          onClick={() => setVerticalFilter(v)}
                        >
                          {CATEGORY_ICONS[v]} {CATEGORY_LABELS[v]}
                        </button>
                      ),
                    )}
                  </div>

                  <div className="amazon-product-list">
                    {groupedProducts.map(({ vertical, products }) => (
                      <React.Fragment key={vertical}>
                        {verticalFilter === 'all' && (
                          <div className="amazon-category-header">
                            {CATEGORY_ICONS[vertical]} {CATEGORY_LABELS[vertical]}
                          </div>
                        )}
                        {products.map((p) => (
                          <div
                            key={p.id}
                            className={`amazon-product-row${selectedProduct?.id === p.id ? ' active' : ''}`}
                            onClick={() => selectProduct(p)}
                          >
                            <div className="apr-thumb">{p.emoji}</div>
                            <div className="apr-info">
                              <div className="apr-name">{p.name}</div>
                              <div className="apr-meta">
                                <span
                                  className={`product-vertical-tag product-vertical-tag-${p.vertical}`}
                                >
                                  {p.tag}
                                </span>
                                <div className="apr-rating">
                                  <span className="apr-stars">
                                    {'★'.repeat(Math.floor(p.rating))}
                                  </span>
                                  <span className="apr-review-count">
                                    ({p.reviews.toLocaleString()})
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="apr-price-col">
                              <div className="apr-price">
                                <span className="product-price">${p.price.toFixed(2)}</span>
                                <span className="product-price-original">
                                  ${p.originalPrice.toFixed(2)}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm apr-atc"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(p);
                                }}
                              >
                                + Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {checkoutStep === 1 && (
                <div className="amazon-main-panel">
                  <div className="checkout-progress" aria-label="Checkout progress">
                    <span className="checkout-step checkout-step-active">Cart</span>
                    <span className="checkout-step">Payment</span>
                    <span className="checkout-step">Confirm</span>
                  </div>

                  <div className="checkout-section">
                    <h3>
                      🛒 Your Cart{' '}
                      <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>
                        ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
                      </span>
                    </h3>
                    {cartItems.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        Your cart is empty.
                      </p>
                    ) : (
                      <>
                        {cartItems.map((item, i) => (
                          <div key={`${item.id}-${i}`} className="checkout-item">
                            <span className="checkout-item-emoji">{item.emoji}</span>
                            <span className="checkout-item-name">{item.name}</span>
                            <span className="checkout-item-price">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="checkout-total-row">
                          <span className="checkout-total-label">Order Total</span>
                          <span className="checkout-total-amount">${orderTotal.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="checkout-actions">
                      <button type="button" className="btn btn-primary" onClick={goToPayment}>
                        Proceed to Payment →
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={backToBrowse}>
                        ← Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="amazon-main-panel">
                  <div className="checkout-progress" aria-label="Checkout progress">
                    <span className="checkout-step checkout-step-complete">Cart</span>
                    <span className="checkout-step checkout-step-active">Payment</span>
                    <span className="checkout-step">Confirm</span>
                  </div>

                  <div className="checkout-section checkout-section-payment">
                    <h3>💳 Payment</h3>
                    <p className="payment-hint">
                      Hover and pause over these fields to trigger hesitation and dwell-time
                      signals. The order summary stays visible in the rail so the form no longer
                      feels stranded.
                    </p>
                    <div className="payment-form">
                      <div className="payment-field">
                        <label htmlFor="cc-number">Card Number</label>
                        <input
                          id="cc-number"
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          readOnly
                        />
                      </div>
                      <div className="payment-row">
                        <div className="payment-field">
                          <label htmlFor="cc-expiry">Expiry</label>
                          <input id="cc-expiry" type="text" placeholder="12/28" readOnly />
                        </div>
                        <div className="payment-field">
                          <label htmlFor="cc-cvc">CVC</label>
                          <input id="cc-cvc" type="text" placeholder="123" readOnly />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-green"
                        onClick={() => {
                          track('/amazon/thank-you');
                          resetCounter('cart-items');
                          setCheckoutStep(0);
                          setCartItems([]);
                          setSelectedProduct(null);
                          toast('✅ Order placed!', 'success');
                        }}
                      >
                        ✅ Place Order (Simulated)
                      </button>
                    </div>
                    <div className="checkout-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          track('/amazon/cart');
                          setCheckoutStep(1);
                        }}
                      >
                        ← Back to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="amazon-right-panel">
              {promoteSignals ? (
                <>
                  {liveInterventionSection}
                  {commerceContextSection}
                </>
              ) : (
                <>
                  {commerceContextSection}
                  {liveInterventionSection}
                </>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'verticals' && (
          <div className="showcase-verticals">
            <div className="showcase-vertical-hero">
              <div className="showcase-vertical-hero-copy">
                <span className="showcase-vertical-hero-kicker">Designed playbooks</span>
                <h3 className="showcase-vertical-hero-title">
                  Interventions that feel product-grade, not promotional.
                </h3>
                <p className="showcase-vertical-hero-text">
                  Each vertical should feel like it was designed by the product team itself:
                  minimal, confident, and deeply aware of the customer moment it is rescuing. Use
                  the playbook cards below to open the matching storefront or run the mapped demo.
                </p>
              </div>

              <div
                className="showcase-vertical-tabs"
                role="tablist"
                aria-label="Industry verticals"
              >
                {VERTICAL_ORDER.map((vertical) => (
                  <button
                    key={vertical}
                    type="button"
                    role="tab"
                    aria-selected={Boolean(activeVerticalPlaybook === vertical)}
                    className={`showcase-vertical-tab${activeVerticalPlaybook === vertical ? ' active' : ''}`}
                    onClick={() => setActiveVerticalPlaybook(vertical)}
                  >
                    <span className="showcase-vertical-tab-label">
                      {CATEGORY_ICONS[vertical]} {VERTICAL_PLAYBOOKS[vertical].tabLabel}
                    </span>
                    <span className="showcase-vertical-tab-sub">
                      {VERTICAL_PLAYBOOKS[vertical].tabSub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="showcase-vertical-stage">
              <div className="showcase-vertical-story">
                <span className="showcase-vertical-eyebrow">{activePlaybook.eyebrow}</span>
                <h3 className="showcase-vertical-stage-title">{activePlaybook.title}</h3>
                <p className="showcase-vertical-stage-copy">{activePlaybook.summary}</p>
                <div className="showcase-vertical-chips">
                  {activePlaybook.chips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
                <div className="showcase-vertical-map">
                  <button
                    type="button"
                    className="showcase-vertical-map-card"
                    onClick={() => openPlaybookInStore(activeVerticalPlaybook)}
                  >
                    <span>Focus Product</span>
                    <strong>{activePlaybookProduct.name}</strong>
                    <p>Open the matching storefront state.</p>
                  </button>
                  <button
                    type="button"
                    className="showcase-vertical-map-card"
                    onClick={() => runPlaybookDemo(activeVerticalPlaybook)}
                  >
                    <span>Primary Signal</span>
                    <strong>{activePlaybook.primarySignal}</strong>
                    <p>{activePlaybook.demoCta}</p>
                  </button>
                  <button
                    type="button"
                    className="showcase-vertical-map-card"
                    onClick={() => setActiveTab('signals')}
                  >
                    <span>Business Response</span>
                    <strong>{activePlaybook.primaryResponse}</strong>
                    <p>Inspect the mapped intervention logic.</p>
                  </button>
                </div>
                <div className="showcase-vertical-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => openPlaybookInStore(activeVerticalPlaybook)}
                  >
                    Open in Store
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => runPlaybookDemo(activeVerticalPlaybook)}
                  >
                    {activePlaybook.demoCta}
                  </button>
                </div>
              </div>

              <div className="showcase-vertical-canvas">
                {renderVerticalVisual(activeVerticalPlaybook)}
              </div>
            </div>

            <div className="showcase-vertical-journey">
              {activePlaybook.journey.map((step) => (
                <article key={step.label} className="showcase-vertical-journey-card">
                  <span>{step.label}</span>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>

            <div className="showcase-vertical-principles">
              {activePlaybook.principles.map((principle) => (
                <article key={principle.label} className="showcase-vertical-principle-card">
                  <span>{principle.label}</span>
                  <p>{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <table className="showcase-signal-table">
            <thead>
              <tr>
                <th>User Behavior</th>
                <th>Signal</th>
                <th>Intervention</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  b: 'Hovers on price, pauses 3s+',
                  s: 'dwell_time_anomaly',
                  a: '🚚 Free Shipping tooltip',
                },
                { b: 'Rage-clicks between products', s: 'high_entropy', a: '💬 Open Zendesk chat' },
                {
                  b: 'Unusual navigation path',
                  s: 'trajectory_anomaly',
                  a: '⚖️ Compare side-by-side',
                },
                { b: 'Mouse to browser tabs', s: 'exit_intent', a: '🏷️ 10% off overlay' },
                {
                  b: 'Tab away, return after 15s+',
                  s: 'attention_return',
                  a: '👋 Welcome back banner',
                },
                {
                  b: 'Hesitates on checkout form',
                  s: 'hesitation_detected',
                  a: '🛡️ Money-back guarantee',
                },
                { b: 'Goes idle for 30s+', s: 'user_idle', a: '⏳ Still shopping? nudge' },
                {
                  b: 'Hesitates on cancel page',
                  s: 'hesitation_detected',
                  a: '🚫 "3 months free" offer',
                },
              ].map((r) => (
                <tr key={r.s + r.b}>
                  <td>{r.b}</td>
                  <td>
                    <code className="signal-code">{r.s}</code>
                  </td>
                  <td>{r.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'guide' && (
          <div>
            <div className="alert alert-info alert-sm">
              <strong>📊 Probabilistic engine, not hardcoded rules.</strong> Signals are derived
              from live Markov chain math, Shannon entropy, and z-scores. Warm-up needed — signals
              may not fire immediately.
            </div>
            <div className="manual-guide">
              <ul className="manual-guide-list">
                {[
                  {
                    sig: 'exit_intent',
                    title: 'Exit Intent',
                    steps:
                      'Move your mouse above the browser viewport toward the tab bar. The mouseleave event fires the signal. You should see the 10% off overlay.',
                  },
                  {
                    sig: 'attention_return',
                    title: 'Tab Away & Return',
                    steps:
                      'Switch to another tab, wait 2+ seconds, then switch back. The Page Visibility API fires "Welcome back!" on return.',
                  },
                  {
                    sig: 'dwell_time_anomaly',
                    title: 'Dwell Time Anomaly',
                    steps:
                      'Click a product, wait 5+ seconds, click another, wait again. After 3–4 products, abnormally long pauses trigger the "Free Shipping" tooltip.',
                  },
                  {
                    sig: 'high_entropy',
                    title: 'Rage Clicks',
                    steps:
                      'Rapidly click between many product cards (15+ quick clicks). High Shannon entropy triggers "Need help? Chat with us!"',
                  },
                  {
                    sig: 'trajectory_anomaly',
                    title: 'Unusual Navigation',
                    steps:
                      'Click a product, go back, jump to a completely different product, go back, jump to payment. Unusual transitions trigger "Compare side by side?"',
                  },
                  {
                    sig: 'user_idle',
                    title: 'Idle Detection',
                    steps:
                      'Stop all mouse and keyboard activity for 30+ seconds. The engine detects inactivity and shows "Still shopping?"',
                  },
                  {
                    sig: 'hesitation_detected',
                    title: 'Checkout Hesitation',
                    steps:
                      'Add to Cart → Proceed to Payment, hover over form fields and pause 5+ seconds. Navigate back and forth between cart and payment.',
                  },
                ].map((g) => (
                  <li key={g.sig}>
                    <span className="guide-signal">{g.sig}</span>
                    <strong>{g.title}</strong>
                    <div className="guide-steps">{g.steps}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </ShowcaseTabs>

      <ProofBar />
    </div>
  );
}
