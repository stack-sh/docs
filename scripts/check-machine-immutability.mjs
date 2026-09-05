import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function assertImmutable(previous, current) {
  for (const [file, bytes] of previous) {
    assert.ok(current.has(file), `Published machine resource removed: ${file}`);
    assert.deepEqual(current.get(file), bytes, `Published machine resource changed: ${file}; publish a new version`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const revision = process.env.MACHINE_BASE_REVISION;
  assert.match(revision ?? '', /^[a-f0-9]{40}$/);
  assert.notEqual(revision, '0'.repeat(40));
  const paths = execFileSync('git', ['ls-tree', '-r', '--name-only', revision, 'generated/machine'], { encoding: 'utf8' }).split('\n').filter(file => /^generated\/machine\/v\d+\.\d+\.\d+\//.test(file));
  const previous = new Map();
  const current = new Map();
  for (const file of paths) {
    previous.set(file, execFileSync('git', ['show', `${revision}:${file}`]));
    try { current.set(file, await readFile(file)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  assertImmutable(previous, current);
  console.log(`Preserved ${paths.length} previously published machine resources.`);
}
