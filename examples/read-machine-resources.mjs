import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { requireCapabilities, retrieveResource, sha256 } from '../scripts/machine-resources.mjs';

const local = process.argv.includes('--local');
async function read(url) {
  if (local) return readFile(new URL('../generated' + new URL(url).pathname, import.meta.url));
  assert.ok(url.startsWith('https://stack-diagram.com/machine/'));
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15_000), cache: 'no-cache' });
  assert.ok(response.ok, `Discovery unavailable: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
const discovery = JSON.parse((await read('https://stack-diagram.com/machine/index.json')).toString());
assert.equal(discovery.schemaVersion, '1.0');
const bytes = await read(discovery.current.url);
assert.equal(sha256(bytes), discovery.current.sha256, 'Manifest integrity mismatch');
const manifest = JSON.parse(bytes.toString());
requireCapabilities(manifest, 'engine', ['completion', 'hover']);
for (const id of ['packages/language/grammars/stack.tmLanguage.json', 'schemas/diagnostic.schema.json', 'examples/catalog.json']) {
  const resource = manifest.resources.find(resource => resource.id === id);
  assert.ok(resource, `Missing resource: ${id}`);
  JSON.parse((await retrieveResource(resource)).toString('utf8'));
  console.log(`Verified ${id}: ${resource.sha256}`);
}
console.log(`Manifest ${manifest.version}: Engine completion and hover supported. CLI JSON output is not advertised.`);
