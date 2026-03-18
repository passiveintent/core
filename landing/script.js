const NAV_ITEMS = [
  { href: './ecommerce/index.html', label: 'E-Commerce' },
  { href: '#why-different', label: 'Why' },
  { href: '#how', label: 'How' },
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
    const traffic = Math.max(25000, Number(trafficInput.value || 0));
    const aov = Math.max(25, Number(aovInput.value || 0));
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

    const traffic = Math.max(25000, Number(trafficInput.value || 0));
    const aov = Math.max(25, Number(aovInput.value || 0));
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
setupReveal();
setupBackToTop();
setYear();
