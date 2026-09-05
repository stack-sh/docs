import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { auditConsumers, compareConsumer, readPinnedManifest } from './consumer-freshness.mjs';

const skill = 'generated skill';
const hash = value => createHash('sha256').update(value).digest('hex');
const manifest = { schemaVersion: '1.0', cli: { version: '0.4.0', revision: 'a'.repeat(40) }, files: [
  { path: 'skills/stack-diagrams/SKILL.md', sha256: hash(skill) },
  { path: 'site/index.md', sha256: 'b'.repeat(64) },
] };

test('compares relevant content rather than requiring equal source commits', () => {
  compareConsumer(manifest, structuredClone(manifest), 'web');
  const pageChange = structuredClone(manifest);
  pageChange.files[1].sha256 = 'c'.repeat(64);
  compareConsumer(manifest, pageChange, 'cli');
  for (const kind of ['web', 'production']) assert.throws(() => compareConsumer(manifest, pageChange, kind), /stale/);
});

test('rejects missing resources, stale CLI identity, and unsupported schema', () => {
  for (const changed of [
    { ...manifest, files: manifest.files.slice(0, 1) },
    { ...manifest, cli: { ...manifest.cli, version: '0.3.0' } },
    { ...manifest, schemaVersion: '2.0' },
  ]) assert.throws(() => compareConsumer(manifest, changed, 'web'));
});

test('verifies pinned manifest integrity and rejects mutable revisions', async () => {
  const bytes = Buffer.from(JSON.stringify(manifest));
  const lock = { repository: 'stack-sh/docs', revision: 'a'.repeat(40), manifestSha256: hash(bytes) };
  assert.deepEqual(await readPinnedManifest(lock, async () => bytes), manifest);
  await assert.rejects(readPinnedManifest({ ...lock, revision: 'main' }, async () => bytes));
  await assert.rejects(readPinnedManifest(lock, async () => Buffer.from('altered')), /integrity/);
});

test('checks actual installed skill bytes and reports stale production separately', async () => {
  const bytes = Buffer.from(JSON.stringify(manifest));
  const lock = Buffer.from(JSON.stringify({ repository: 'stack-sh/docs', revision: 'a'.repeat(40), manifestSha256: hash(bytes) }));
  const fetchBytes = async url => url.endsWith('/generated/manifest.json') ? bytes : url.endsWith('/SKILL.md') ? Buffer.from(skill) : lock;
  await auditConsumers(manifest, fetchBytes);
  await assert.rejects(auditConsumers(manifest, async url => url.endsWith('/SKILL.md') ? Buffer.from('hand edited') : fetchBytes(url)), /CLI skill differs/);
  await assert.rejects(auditConsumers(manifest, async url => {
    if (url === 'https://stack-diagram.com/docs-source.json') throw new Error('deployment missing');
    return fetchBytes(url);
  }), /production: deployment missing/);
});
