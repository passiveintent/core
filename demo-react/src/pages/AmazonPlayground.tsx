/**
 * AmazonPlayground — An interactive e-commerce simulation that triggers
 * real PassiveIntent signals and shows business-friendly interventions.
 *
 * Every signal → proposed action mapping is visible to non-technical PMs.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntent } from '../IntentContext';
import type {
  HighEntropyPayload,
  DwellTimeAnomalyPayload,
  HesitationDetectedPayload,
  TrajectoryAnomalyPayload,
  AttentionReturnPayload,
  ExitIntentPayload,
} from '@passiveintent/core';

// ─── Product catalogue ────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  state: string; // engine state tracked for this product
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    emoji: '🎧',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 2341,
    state: '/product/headphones',
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    emoji: '⌨️',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 1893,
    state: '/product/keyboard',
  },
  {
    id: 'p3',
    name: 'USB-C Monitor',
    emoji: '🖥️',
    price: 349.99,
    originalPrice: 499.99,
    rating: 4.3,
    reviews: 876,
    state: '/product/monitor',
  },
  {
    id: 'p4',
    name: 'Ergonomic Mouse',
    emoji: '🖱️',
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.6,
    reviews: 3122,
    state: '/product/mouse',
  },
  {
    id: 'p5',
    name: 'Laptop Stand',
    emoji: '💻',
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.4,
    reviews: 1567,
    state: '/product/stand',
  },
  {
    id: 'p6',
    name: 'Webcam HD',
    emoji: '📷',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.2,
    reviews: 987,
    state: '/product/webcam',
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
    | 'guarantee';
  icon: string;
  title: string;
  body: string;
  trigger: string; // which signal caused this
}

let _interventionSeq = 0;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AmazonPlayground() {
  const { track, on } = useIntent();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=browsing, 1=cart, 2=payment
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Track page load
  useEffect(() => {
    track('/amazon/home');
  }, [track]);

  const pushIntervention = useCallback((iv: Omit<Intervention, 'id'>) => {
    setInterventions((prev) => [{ ...iv, id: ++_interventionSeq }, ...prev].slice(0, 8));
  }, []);

  const dismissIntervention = useCallback((id: number) => {
    setInterventions((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // ─── Wire up signals → interventions ─────────────────────────────────────

  useEffect(() => {
    const unsubs = [
      // Hesitation on price → Free Shipping
      on('dwell_time_anomaly', (p) => {
        const payload = p as DwellTimeAnomalyPayload;
        pushIntervention({
          type: 'free-shipping',
          icon: '🚚',
          title: 'Free Shipping on orders over $50!',
          body: `You paused on "${payload.state}" for ${Math.round(payload.dwellMs)}ms — z-score: ${payload.zScore.toFixed(1)}`,
          trigger: 'dwell_time_anomaly',
        });
      }),

      // High entropy (rage-clicks) → Open Zendesk
      on('high_entropy', (p) => {
        const payload = p as HighEntropyPayload;
        pushIntervention({
          type: 'zendesk',
          icon: '💬',
          title: 'Need help? Chat with us!',
          body: `Rapid navigation detected on "${payload.state}" — entropy: ${payload.normalizedEntropy.toFixed(2)}`,
          trigger: 'high_entropy',
        });
      }),

      // Trajectory anomaly → Compare side by side
      on('trajectory_anomaly', (p) => {
        const payload = p as TrajectoryAnomalyPayload;
        pushIntervention({
          type: 'compare',
          icon: '⚖️',
          title: 'Compare these products side by side?',
          body: `Unusual path ${payload.stateFrom} → ${payload.stateTo} (z-score: ${payload.zScore.toFixed(1)})`,
          trigger: 'trajectory_anomaly',
        });
      }),

      // Exit intent → 10% off
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

      // Attention return → Welcome back
      on('attention_return', (p) => {
        const payload = p as AttentionReturnPayload;
        const secs = Math.round(payload.hiddenDuration / 1000);
        pushIntervention({
          type: 'welcome-back',
          icon: '👋',
          title: 'Welcome back! Still interested?',
          body: `You were away for ${secs}s from "${payload.state}"`,
          trigger: 'attention_return',
        });
      }),

      // Hesitation detected → Money-back guarantee
      on('hesitation_detected', (p) => {
        const payload = p as HesitationDetectedPayload;
        pushIntervention({
          type: 'guarantee',
          icon: '🛡️',
          title: '100% money-back guarantee',
          body: `Hesitation on "${payload.state}" — dwell z: ${payload.dwellZScore.toFixed(1)}, trajectory z: ${payload.trajectoryZScore.toFixed(1)}`,
          trigger: 'hesitation_detected',
        });
      }),

      // User idle → Still shopping?
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

  // ─── Handlers ─────────────────────────────────────────────────────────────

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
      setCheckoutStep(1);
    },
    [track],
  );

  const goToPayment = useCallback(() => {
    track('/amazon/checkout/payment');
    setCheckoutStep(2);
  }, [track]);

  const simulateRageClicks = useCallback(() => {
    // Rapid state toggling to trigger high_entropy
    for (let i = 0; i < 6; i++) {
      const p = PRODUCTS[i % PRODUCTS.length];
      setTimeout(() => track(p.state), i * 60);
    }
  }, [track]);

  const backToBrowse = useCallback(() => {
    track('/amazon/home');
    setCheckoutStep(0);
    setSelectedProduct(null);
  }, [track]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="amazon-store">
      <div className="demo-header">
        <div className="hook-callout">🛒 Amazon-style Playground — Business Simulation</div>
        <h2 className="demo-title">E-Commerce Intent Playground</h2>
        <p className="demo-description">
          Browse products, hesitate on prices, rage-click, go idle, or switch tabs. Watch{' '}
          <strong>real PassiveIntent signals</strong> trigger business-friendly interventions like a
          Product Manager would configure them.
        </p>
      </div>

      {/* Simulation controls */}
      <div className="card">
        <div className="card-title">Quick Simulate</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>
          Trigger specific behaviors to see interventions:
        </p>
        <div className="btn-row">
          <button
            className="btn btn-secondary"
            onClick={() => {
              track('/amazon/home');
              track('/amazon/deals');
              track('/amazon/home');
              track('/amazon/deals');
            }}
          >
            🔄 Browse Back &amp; Forth
          </button>
          <button className="btn btn-danger" onClick={simulateRageClicks}>
            😤 Rage-Click Products
          </button>
          <button className="btn btn-secondary" onClick={() => track('/amazon/checkout/payment')}>
            💳 Jump to Payment
          </button>
          <button className="btn btn-green" onClick={backToBrowse}>
            🏠 Back to Browse
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8 }}>
          💡 Tip: Switch to another tab and return after 15s to trigger "Welcome Back". Move your
          mouse above the viewport for "Exit Intent".
        </p>
      </div>

      {/* Interventions */}
      {interventions.length > 0 && (
        <div className="card">
          <div className="card-title">🎯 Triggered Interventions ({interventions.length})</div>
          {interventions.map((iv) => (
            <div key={iv.id} className={`intervention intervention-${iv.type}`}>
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
              <button className="intervention-dismiss" onClick={() => dismissIntervention(iv.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Store content */}
      {checkoutStep === 0 && (
        <>
          {/* Product grid */}
          <div className="amazon-hero">
            <h2>🛍️ Today's Deals</h2>
            <p>Click products to browse. Hover on prices. Trigger real intent signals.</p>
          </div>
          <div className="amazon-grid">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className={`product-card${selectedProduct?.id === p.id ? ' active' : ''}`}
                onClick={() => selectProduct(p)}
              >
                <div className="product-img">{p.emoji}</div>
                <div className="product-name">{p.name}</div>
                <div>
                  <span className="product-price">${p.price.toFixed(2)}</span>
                  <span className="product-price-original">${p.originalPrice.toFixed(2)}</span>
                </div>
                <div className="product-rating">
                  {'★'.repeat(Math.floor(p.rating))}
                  {'☆'.repeat(5 - Math.floor(p.rating))} ({p.reviews.toLocaleString()})
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected product detail */}
          {selectedProduct && (
            <div className="checkout-section">
              <h3>
                {selectedProduct.emoji} {selectedProduct.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
                Viewing product detail page — your dwell time and navigation patterns are being
                tracked.
              </p>
              <div className="metrics-grid" style={{ marginBottom: 16 }}>
                <div className="metric-card">
                  <div className="metric-value" style={{ color: '#ff9900' }}>
                    ${selectedProduct.price.toFixed(2)}
                  </div>
                  <div className="metric-label">Current Price</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{selectedProduct.rating}</div>
                  <div className="metric-label">Rating</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">
                    {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                  </div>
                  <div className="metric-label">Discount</div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => addToCart(selectedProduct)}>
                🛒 Add to Cart
              </button>
            </div>
          )}
        </>
      )}

      {checkoutStep === 1 && (
        <div className="checkout-section">
          <h3>🛒 Your Cart ({cartItems.length} items)</h3>
          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#ff9900' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700 }}>
                  Total: ${cartItems.reduce((sum, it) => sum + it.price, 0).toFixed(2)}
                </span>
                <button className="btn btn-primary" onClick={goToPayment}>
                  Proceed to Payment →
                </button>
              </div>
            </>
          )}
          <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={backToBrowse}>
            ← Continue Shopping
          </button>
        </div>
      )}

      {checkoutStep === 2 && (
        <div className="checkout-section">
          <h3>💳 Payment</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Simulated checkout form — hover and pause here to trigger hesitation and dwell-time
            signals.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                style={{ width: '100%' }}
                readOnly
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Expiry</label>
                <input type="text" placeholder="12/28" readOnly />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>CVC</label>
                <input type="text" placeholder="123" readOnly />
              </div>
            </div>
            <button
              className="btn btn-green"
              onClick={() => {
                track('/amazon/thank-you');
                setCheckoutStep(0);
                setCartItems([]);
                setSelectedProduct(null);
              }}
            >
              ✅ Place Order (Simulated)
            </button>
          </div>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={() => {
              track('/amazon/cart');
              setCheckoutStep(1);
            }}
          >
            ← Back to Cart
          </button>
        </div>
      )}

      {/* Signal → Action mapping reference */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">📋 Signal → Business Action Mapping</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>User Behavior</th>
              <th>PassiveIntent Signal</th>
              <th>Proposed Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hovers on price, pauses 3s+</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  dwell_time_anomaly
                </code>
              </td>
              <td>🚚 Free Shipping tooltip</td>
            </tr>
            <tr>
              <td>Rage-clicks between products</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>high_entropy</code>
              </td>
              <td>💬 Open Zendesk chat</td>
            </tr>
            <tr>
              <td>Unusual navigation path</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  trajectory_anomaly
                </code>
              </td>
              <td>⚖️ Compare side-by-side</td>
            </tr>
            <tr>
              <td>Mouse to browser tabs</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>exit_intent</code>
              </td>
              <td>🏷️ 10% off overlay</td>
            </tr>
            <tr>
              <td>Tab away, return after 15s+</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  attention_return
                </code>
              </td>
              <td>👋 Welcome back banner</td>
            </tr>
            <tr>
              <td>Hesitates on checkout form</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  hesitation_detected
                </code>
              </td>
              <td>🛡️ Money-back guarantee</td>
            </tr>
            <tr>
              <td>Goes idle for 30s+</td>
              <td>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>user_idle</code>
              </td>
              <td>⏳ Still shopping? nudge</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
