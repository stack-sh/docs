import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import init, { check, render, completion, hover } from '@stack-sh/engine';
import { requireCapabilities, retrieveResource, sha256 } from './machine-resources.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'generated/machine/v1.0.0/manifest.json'), 'utf8'));
const schema = JSON.parse(await readFile(path.join(root, 'generated/machine/v1.0.0/manifest.schema.json'), 'utf8'));
// Draft 2020-12 needs its own Ajv class: https://ajv.js.org/json-schema.html#draft-2020-12-breaking
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateManifest = ajv.compile(schema);
assert.ok(validateManifest(manifest), ajv.errorsText(validateManifest.errors));
assert.equal(new Set(manifest.resources.map(resource => resource.id)).size, manifest.resources.length);
const bytesById = new Map();
for (let i = 0; i < manifest.resources.length; i += 8) {
  await Promise.all(manifest.resources.slice(i, i + 8).map(async resource => {
    const bytes = resource.url.startsWith('https://stack-diagram.com/')
      ? await readFile(path.join(root, 'generated', new URL(resource.url).pathname.slice(1)))
      : await retrieveResource(resource);
    assert.equal(bytes.length, resource.bytes);
    assert.equal(sha256(bytes), resource.sha256);
    bytesById.set(resource.id, bytes);
  }));
}
const resource = id => {
  const bytes = bytesById.get(id);
  assert.ok(bytes, `Missing resource: ${id}`);
  return bytes;
};
const json = id => JSON.parse(resource(id).toString('utf8'));
const sourceUrl = id => manifest.resources.find(item => item.id === id).url;
for (const entry of manifest.resources.filter(item => item.id.startsWith('schemas/'))) ajv.addSchema(json(entry.id), entry.url);
const validate = (id, value) => {
  const validator = ajv.getSchema(sourceUrl(id));
  assert.ok(validator(value), `${id}: ${ajv.errorsText(validator.errors)}`);
};

const portable = [...resource('SPECIFICATION.md').toString('utf8').matchAll(/^\| `(STK\d{4})` \| (Error|Warning) \| (.+) \|$/gm)].map(m => ({ code: m[1], severity: m[2].toLowerCase(), meaning: m[3] }));
assert.ok(portable.length > 0);
assert.deepEqual(json('diagnostic-catalog').diagnostics, portable, 'Generated diagnostic catalog differs from the canonical specification');

requireCapabilities(manifest, 'engine', ['check', 'render', 'completion', 'hover']);
await init({ module_or_path: await readFile(path.join(root, 'node_modules/@stack-sh/engine/dist/stack_engine_bg.wasm')) });
const catalog = json('examples/catalog.json');
validate('schemas/example-catalog.schema.json', catalog);
for (const example of catalog.examples) {
  const result = render(resource(`examples/${example.source}`));
  assert.ok(result.svg, `Example did not render: ${example.id}`);
  assert.equal(result.diagnostics.filter(d => d.severity === 'error').length, 0);
  for (const diagnostic of result.diagnostics) validate('schemas/diagnostic.schema.json', diagnostic);
}
let diagnosticCases = 0;
let intelligenceCases = 0;
for (const entry of manifest.resources) {
  if (entry.id.endsWith('/expected.ir.json')) validate('schemas/normalized-ir.schema.json', json(entry.id));
  if (entry.id.endsWith('/expected.diagnostics.json')) {
    const expected = json(entry.id);
    validate('schemas/diagnostic-expectations.schema.json', expected);
    const source = resource(entry.id.replace('expected.diagnostics.json', 'source.stack'));
    const result = check(source);
    for (const diagnostic of result.diagnostics) validate('schemas/diagnostic.schema.json', diagnostic);
    const actual = result.diagnostics.filter(d => d.code.startsWith('STK'));
    assert.equal(actual.length, expected.diagnostics.length, entry.id);
    expected.diagnostics.forEach((item, i) => {
      for (const key of Object.keys(item)) assert.deepEqual(actual[i][key], item[key], `${entry.id}: ${key}`);
    });
    diagnosticCases++;
  }
  if (entry.id.startsWith('conformance/language-intelligence/') && entry.id.endsWith('/fixture.json')) {
    const fixture = json(entry.id);
    const source = resource(entry.id.replace('fixture.json', fixture.source)).toString('utf8');
    for (const operation of fixture.operations) {
      validate('schemas/language-intelligence.schema.json', operation.request);
      validate('schemas/language-intelligence.schema.json', operation.response);
      const request = operation.request;
      if (!['completion', 'hover'].includes(request.feature)) continue;
      if (request.feature === 'completion' && request.completionCatalog.icons.length) continue;
      const result = request.feature === 'completion' ? completion(source, request.documentVersion, request.position) : hover(source, request.documentVersion, request.position);
      const envelope = { ...result, kind: 'response', feature: request.feature };
      validate('schemas/language-intelligence.schema.json', envelope);
      assert.deepEqual(envelope, operation.response, `${entry.id}/${operation.id}`);
      intelligenceCases++;
    }
  }
}
assert.ok(diagnosticCases > 0 && intelligenceCases > 0);
console.log(`Verified ${manifest.resources.length} resource hashes, ${portable.length} portable diagnostics, ${catalog.examples.length} rendered examples, ${diagnosticCases} diagnostic fixtures, and ${intelligenceCases} live WASM intelligence fixtures.`);
