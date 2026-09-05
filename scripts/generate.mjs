import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

export function renderGuidance(workflow, metadata, release) {
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
  assert.match(release.revision, /^[a-f0-9]{40}$/);
  assert.equal(release.repository, 'stack-sh/cli');
  assert.match(metadata.name, /^[a-z][a-z0-9-]{0,63}$/);
  assert.equal(metadata.license, 'Apache-2.0');
  assert.equal(typeof metadata.description, 'string');
  assert.ok(metadata.description.length > 0);
  // JSON-quoted strings are valid YAML scalar values, including colons and newlines.
  const frontmatter = ['---', ...Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`), '---', ''].join('\n');
  const rendered = workflow.replaceAll('{{cliVersion}}', release.version).trimEnd() + '\n';
  assert.ok(!/\{\{[^}]+\}\}/.test(rendered), 'Unknown template token');
  const notice = '<!-- Generated from stack-sh/docs/content/agent-workflow.md. Do not edit. -->\n\n';
  return {
    'skills/stack-diagrams/SKILL.md': frontmatter + '\n' + notice + rendered,
    'guide/agent-workflow.md': notice + rendered,
  };
}

async function filePaths(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const paths = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Symlink not allowed in generated content: ${relative}`);
    if (entry.isDirectory()) paths.push(...await filePaths(path.join(directory, entry.name), relative));
    else paths.push(relative);
  }
  return paths.sort();
}

export async function generate(directory = root, check = false) {
  const workflow = await readFile(path.join(directory, 'content/agent-workflow.md'), 'utf8');
  const metadata = JSON.parse(await readFile(path.join(directory, 'content/skill-metadata.json'), 'utf8'));
  const release = JSON.parse(await readFile(path.join(directory, 'content/cli-release.json'), 'utf8'));
  const outputs = renderGuidance(workflow, metadata, release);
  const manifest = {
    schemaVersion: '1.0',
    cli: release,
    files: Object.entries(outputs).map(([file, content]) => ({
      path: file,
      sha256: createHash('sha256').update(content).digest('hex'),
    })),
  };
  outputs['manifest.json'] = JSON.stringify(manifest, null, 2) + '\n';
  const outputDirectory = path.join(directory, 'generated');
  const expected = Object.keys(outputs).sort();
  const existing = await filePaths(outputDirectory);
  const obsolete = existing.filter(file => !expected.includes(file));
  assert.deepEqual(obsolete, [], 'Remove obsolete generated files explicitly before generating');
  if (check) assert.deepEqual(existing, expected, 'Generated file inventory drift');
  for (const [file, content] of Object.entries(outputs)) {
    const target = path.join(outputDirectory, file);
    if (check) assert.equal(await readFile(target, 'utf8'), content, `Generated content drift: ${file}`);
    else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
  }
  return outputs;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported');
  await generate(root, process.argv.includes('--check'));
}
