/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BrowserStorageAdapter,
  BrowserTimerAdapter,
  IntentManager,
  MemoryStorageAdapter,
} from '../dist/src/index.js';

class ManualTimerAdapter {
  constructor() {
    this.time = 0;
    this.tasks = [];
    this.nextId = 1;
  }

  now() {
    return this.time;
  }

  setTimeout(fn, delay) {
    const id = this.nextId++;
    this.tasks.push({ id, at: this.time + delay, fn });
    return id;
  }

  clearTimeout(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  advance(ms) {
    this.time += ms;
    const due = this.tasks.filter((t) => t.at <= this.time);
    this.tasks = this.tasks.filter((t) => t.at > this.time);
    due.forEach((t) => t.fn());
  }
}

test('BrowserStorageAdapter gracefully degrades when window/localStorage are unavailable', () => {
  const originalWindow = globalThis.window;
  try {
    // Simulate SSR/non-browser runtime.
    delete globalThis.window;

    const adapter = new BrowserStorageAdapter();
    assert.equal(adapter.getItem('missing'), null);
    assert.doesNotThrow(() => adapter.setItem('k', 'v'));
    assert.doesNotThrow(() => adapter.removeItem('k'));
  } finally {
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    }
  }
});

test('BrowserStorageAdapter: removeItem() removes a namespaced key from localStorage', () => {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  try {
    const adapter = new BrowserStorageAdapter();
    adapter.setItem('my-key', 'my-value');
    assert.equal(adapter.getItem('my-key'), 'my-value');
    adapter.removeItem('my-key');
    assert.equal(adapter.getItem('my-key'), null, 'value must be absent after removeItem');
    // Confirm the namespaced key (not the bare key) was removed.
    assert.equal(store.has('passiveintent:my-key'), false);
    assert.equal(store.has('my-key'), false);
  } finally {
    delete globalThis.window;
  }
});

test('BrowserStorageAdapter: getItem() migrates legacy unprefixed key to namespaced key on first read', () => {
  const store = new Map();
  // Simulate an old SDK installation that wrote the key without a namespace prefix.
  store.set('intent-key', 'legacy-value');
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  try {
    const adapter = new BrowserStorageAdapter();
    // First read must fall back to the unprefixed key and return the value.
    assert.equal(adapter.getItem('intent-key'), 'legacy-value');
    // The value must now be stored under the namespaced key.
    assert.equal(store.get('passiveintent:intent-key'), 'legacy-value', 'value must be migrated to namespaced key');
    // The legacy unprefixed key must be removed.
    assert.equal(store.has('intent-key'), false, 'legacy key must be deleted after migration');
    // Subsequent reads must hit the namespaced key directly.
    assert.equal(adapter.getItem('intent-key'), 'legacy-value');
  } finally {
    delete globalThis.window;
  }
});

test('BrowserStorageAdapter: getItem() does NOT migrate legacy key for custom namespaces', () => {
  const store = new Map();
  store.set('intent-key', 'legacy-value');
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  try {
    const adapter = new BrowserStorageAdapter('my-mfe:');
    // Custom-namespace adapter must not touch the unprefixed key.
    assert.equal(adapter.getItem('intent-key'), null);
    assert.equal(store.has('intent-key'), true, 'legacy key must remain untouched');
  } finally {
    delete globalThis.window;
  }
});

test('BrowserStorageAdapter: custom namespace prefixes keys independently from the default namespace', () => {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  try {
    const def = new BrowserStorageAdapter();
    const mfe = new BrowserStorageAdapter('checkout:');
    def.setItem('state', 'global');
    mfe.setItem('state', 'checkout');
    // Each adapter must only see its own namespaced value.
    assert.equal(def.getItem('state'), 'global');
    assert.equal(mfe.getItem('state'), 'checkout');
    // Underlying keys must be stored with the correct prefixes.
    assert.equal(store.get('passiveintent:state'), 'global');
    assert.equal(store.get('checkout:state'), 'checkout');
  } finally {
    delete globalThis.window;
  }
});

test('BrowserTimerAdapter works with platform timers and monotonic fallback', () => {
  const timer = new BrowserTimerAdapter();
  let fired = false;
  const id = timer.setTimeout(() => {
    fired = true;
  }, 1);

  assert.ok(id !== undefined);
  assert.equal(typeof timer.now(), 'number');
  timer.clearTimeout(id);
  assert.equal(fired, false);
});

test('IntentManager runs with custom storage+manual timer adapters (runtime matrix compatibility)', () => {
  const timer = new ManualTimerAdapter();
  const storage = new MemoryStorageAdapter();

  const manager = new IntentManager({
    storageKey: 'compat-matrix',
    storage,
    timer,
    persistDebounceMs: 10,
    botProtection: false,
  });

  manager.track('home');
  manager.track('search');

  // Aggressive sync persist: storage is written immediately on track(), even
  // though a debounce is configured. The debounce only applies to the async
  // coalescing path; the synchronous persist always runs first.
  assert.ok(
    storage.getItem('compat-matrix'),
    'storage must be written synchronously after track()',
  );
  timer.advance(11);
  assert.ok(storage.getItem('compat-matrix'));
});
