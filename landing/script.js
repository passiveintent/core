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

const MARKETING_CHEATSHEET = {
  emailSubject: 'PassiveIntent Behavioral Topography Matrix Cheat Sheet',
  emailIntro:
    'Sharing the PassiveIntent cheat sheet that maps engine math to psychological intent and the right go-to-market intervention.',
  whatsappIntro:
    'PassiveIntent cheat sheet: engine math -> psychological intent -> go-to-market action.',
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
    { threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
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

  roots.forEach((root) => {
    root.querySelectorAll('[data-cheatsheet-page-link]').forEach((element) => {
      element.setAttribute('href', localCheatSheetUrl.toString());
    });

    root.querySelectorAll('[data-cheatsheet-markdown-link]').forEach((element) => {
      if (!element.getAttribute('href').endsWith('.html')) {
        element.setAttribute('href', localMarkdownUrl);
      }
    });

    root.querySelectorAll('[data-cheatsheet-email]').forEach((element) => {
      element.setAttribute(
        'href',
        `mailto:?subject=${encodeURIComponent(MARKETING_CHEATSHEET.emailSubject)}&body=${encodeURIComponent(emailBody)}`,
      );
    });

    root.querySelectorAll('[data-cheatsheet-whatsapp]').forEach((element) => {
      element.setAttribute('href', `https://wa.me/?text=${encodeURIComponent(whatsappText)}`);
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

function init() {
  setupCommerceEstimator();
  setupCommercePlaybookTabs();
  setupMarketingCheatSheet();
  setupReveal();
  setupBackToTop();
  setYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
