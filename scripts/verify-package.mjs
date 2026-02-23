import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const tempRoot = mkdtempSync(join(tmpdir(), 'edge-signal-pack-'));

try {
  const tarballName = execSync('npm pack --silent', { encoding: 'utf-8' }).trim();
  const tarballPath = join(process.cwd(), tarballName);
  const consumerDir = join(tempRoot, 'consumer');

  execSync(`mkdir -p "${consumerDir}"`);
  writeFileSync(
    join(consumerDir, 'package.json'),
    JSON.stringify({ name: 'consumer-smoke', version: '1.0.0', type: 'module' }, null, 2),
  );

  execSync(`npm install --silent "${tarballPath}"`, { cwd: consumerDir, stdio: 'inherit' });

  const smoke = `
import { IntentManager, MarkovGraph, BloomFilter } from 'edge-signal';
const g = new MarkovGraph();
g.incrementTransition('home', 'search');
const b = new BloomFilter();
b.add('home');
const m = new IntentManager({ storageKey: 'smoke-test', botProtection: false });
m.track('home');
m.track('search');
if (!b.check('home') || g.getProbability('home', 'search') <= 0) {
  throw new Error('Package smoke validation failed');
}
console.log('package smoke test passed');
`;

  execSync('node --input-type=module', {
    cwd: consumerDir,
    input: smoke,
    stdio: 'inherit',
  });

  console.log('verify-package: success');
} finally {
  try {
    execSync('rm -f edge-signal-*.tgz');
  } catch {
    // ignore cleanup errors
  }
  rmSync(tempRoot, { recursive: true, force: true });
}
