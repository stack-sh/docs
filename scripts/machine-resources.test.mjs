import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';
import { requireCapabilities, retrieveResource, sha256 } from './machine-resources.mjs';
import { assertImmutable } from './check-machine-immutability.mjs';

const manifest = JSON.parse(await readFile(new URL('../generated/machine/v1.0.0/manifest.json', import.meta.url), 'utf8'));
const schema = JSON.parse(await readFile(new URL('../content/machine-manifest-v1.schema.json', import.meta.url), 'utf8'));

test('published versions cannot change or disappear, but new versions may be added', () => {
  const previous = new Map([['v1/file', Buffer.from('original')]]);
  assertImmutable(previous, new Map([...previous, ['v2/file', Buffer.from('next')]]));
  assert.throws(() => assertImmutable(previous, new Map()), /removed/);
  assert.throws(() => assertImmutable(previous, new Map([['v1/file', Buffer.from('changed')]])), /changed/);
});

test('manifest schema rejects malformed hashes and unsupported envelopes', () => {
  const validator = new Ajv2020({ strict: true }).compile(schema);
  assert.ok(validator(manifest));
  const changed = structuredClone(manifest);
  changed.resources[0].sha256 = 'not-a-hash';
  assert.equal(validator(changed), false);
  assert.equal(validator({ ...manifest, schemaVersion: '2.0' }), false);
});

test('client detects unsupported reader and implementation capabilities', () => {
  requireCapabilities(manifest, 'engine', ['completion', 'hover']);
  requireCapabilities(manifest, 'cli', ['check', 'render']);
  assert.throws(() => requireCapabilities(manifest, 'cli', ['check-json']), /Unsupported capability/);
  assert.throws(() => requireCapabilities(manifest, 'engine', ['document-symbols']), /Unsupported capability/);
  assert.throws(() => requireCapabilities(manifest, 'cli', [], []), /Unsupported reader feature/);
});

test('resource consumer rejects tampering, missing content, mutable URLs, and unexpected hosts', async () => {
  const bytes = Buffer.from('valid');
  const item = { id: 'test', url: 'https://raw.githubusercontent.com/stack-sh/specification/' + 'a'.repeat(40) + '/SPECIFICATION.md', bytes: bytes.length, sha256: sha256(bytes) };
  assert.deepEqual(await retrieveResource(item, async () => new Response(bytes)), bytes);
  await assert.rejects(retrieveResource(item, async () => new Response('other')), /integrity/);
  await assert.rejects(retrieveResource(item, async () => new Response('', { status: 404 })), /HTTP 404/);
  await assert.rejects(retrieveResource({ ...item, url: item.url.replace('a'.repeat(40), 'main') }));
  await assert.rejects(retrieveResource({ ...item, url: 'https://example.com/resource' }));
});
