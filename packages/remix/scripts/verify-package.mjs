/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { mkdtempSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const tempRoot = mkdtempSync(join(tmpdir(), 'passiveintent-remix-pack-'));

let tarballPath = '';
try {
  const tarballName = execSync('npm pack --silent', { encoding: 'utf-8' }).trim();
  tarballPath = join(process.cwd(), tarballName);
  const consumerDir = join(tempRoot, 'consumer');

  mkdirSync(consumerDir, { recursive: true });
  writeFileSync(
    join(consumerDir, 'package.json'),
    JSON.stringify({ name: 'consumer-smoke', version: '1.0.0', type: 'module' }, null, 2),
  );

  execSync(`npm install --silent "${tarballPath}"`, { cwd: consumerDir, stdio: 'inherit' });

  // Smoke-test the server entry point (the "node" export condition).
  // We only import server-safe exports — no React, no DOM globals.
  // createIntentClientLoader is intentionally excluded: it references
  // @remix-run/server-runtime types and would require Remix to be installed.
  const smoke = `
import { MemoryStorageAdapter } from '@passiveintent/remix';

const adapter = new MemoryStorageAdapter();
if (typeof adapter.getItem !== 'function' || typeof adapter.setItem !== 'function') {
  throw new Error('MemoryStorageAdapter is missing expected methods');
}

adapter.setItem('smoke', 'ok');
if (adapter.getItem('smoke') !== 'ok') {
  throw new Error('MemoryStorageAdapter round-trip failed');
}

console.log('package smoke test passed');
`;

  const smokeFilePath = join(consumerDir, 'smoke-test.mjs');
  writeFileSync(smokeFilePath, smoke);
  execSync(`node ${smokeFilePath}`, { cwd: consumerDir, stdio: 'inherit' });

  console.log('verify-package: success');
} finally {
  try {
    if (tarballPath) unlinkSync(tarballPath);
  } catch {
    // ignore cleanup errors
  }
  rmSync(tempRoot, { recursive: true, force: true });
}
