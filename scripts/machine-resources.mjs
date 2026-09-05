import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';

export async function generateMachineResources(root) {
  const lock = JSON.parse(await readFile(path.join(root, 'content/machine-resources-v1.json'), 'utf8'));
  const schema = await readFile(path.join(root, 'content/machine-manifest-v1.schema.json'), 'utf8');
  const base = 'https://stack-diagram.com/machine/v1.0.0/';
  const diagnostics = json({ schemaVersion: '1.0', languageVersion: '1.0', source: lock.resources.find(resource => resource.path === 'SPECIFICATION.md').url, diagnostics: lock.diagnostics });
  const resource = (id, name, bytes) => ({ id, url: base + name, sha256: sha256(bytes), bytes: Buffer.byteLength(bytes) });
  const manifest = {
    schemaVersion: '1.0', version: '1.0.0', languageVersion: '1.0',
    requiredReaderFeatures: ['sha256', 'immutable-resources'],
    implementations: [
      { id: 'cli', version: '0.4.0', repository: 'stack-sh/cli', revision: '7f4066884f7902d4c582d45184f3a9019fe59bf7', capabilities: ['check', 'format', 'render', 'lsp'] },
      { id: 'engine', version: '0.7.0', repository: 'stack-sh/engine', revision: lock.engineRevision, capabilities: ['check', 'format', 'render', 'completion', 'hover'] },
      { id: 'compiler', version: '0.1.0', repository: 'stack-sh/compiler', revision: lock.compilerRevision, capabilities: ['compile', 'diagnostics', 'completion', 'hover', 'document-symbols'] },
    ],
    resources: [
      ...lock.resources.map(({ id, url, sha256, bytes, repository, revision, path }) => ({ id, url, sha256, bytes, source: { repository, revision, path } })),
      resource('diagnostic-catalog', 'diagnostics.json', diagnostics),
      resource('manifest-schema', 'manifest.schema.json', schema),
    ],
  };
  const manifestBytes = json(manifest);
  return {
    'machine/v1.0.0/manifest.json': manifestBytes,
    'machine/v1.0.0/manifest.schema.json': schema,
    'machine/v1.0.0/diagnostics.json': diagnostics,
    'machine/index.json': json({ schemaVersion: '1.0', current: { version: '1.0.0', url: base + 'manifest.json', sha256: sha256(manifestBytes) } }),
  };
}

export function requireCapabilities(manifest, implementationId, capabilities, readerFeatures = ['sha256', 'immutable-resources']) {
  assert.equal(manifest.schemaVersion, '1.0', 'Unsupported manifest schema');
  for (const feature of manifest.requiredReaderFeatures) assert.ok(readerFeatures.includes(feature), `Unsupported reader feature: ${feature}`);
  const implementation = manifest.implementations.find(item => item.id === implementationId);
  assert.ok(implementation, `Unknown implementation: ${implementationId}`);
  for (const capability of capabilities) assert.ok(implementation.capabilities.includes(capability), `Unsupported capability: ${implementationId}/${capability}`);
  return implementation;
}

export async function retrieveResource(resource, fetchResource = fetch) {
  const url = new URL(resource.url);
  assert.equal(url.protocol, 'https:');
  assert.ok(['raw.githubusercontent.com', 'stack-diagram.com'].includes(url.hostname), 'Unexpected resource origin');
  if (url.hostname === 'raw.githubusercontent.com') assert.match(url.pathname, /^\/stack-sh\/[a-z-]+\/[a-f0-9]{40}\//);
  else assert.ok(url.pathname.startsWith('/machine/v1.0.0/'));
  const response = await fetchResource(resource.url, { signal: AbortSignal.timeout(15_000), redirect: 'error' });
  assert.ok(response.ok, `Machine resource unavailable: ${resource.id} HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length, resource.bytes, `Resource size mismatch: ${resource.id}`);
  assert.equal(sha256(bytes), resource.sha256, `Resource integrity mismatch: ${resource.id}`);
  return bytes;
}
