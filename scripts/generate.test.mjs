import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { generate, renderGuidance } from './generate.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'stack-docs-generation-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(path.join(root, 'content'), path.join(directory, 'content'), { recursive: true });
  return directory;
}

test('one shared instruction change updates skill and guide with deterministic output', async t => {
  const directory = await fixture(t);
  const before = await generate(directory);
  const sourcePath = path.join(directory, 'content/agent-workflow.md');
  const source = await readFile(sourcePath, 'utf8');
  await writeFile(sourcePath, source + '\nKeep the existing diagram title.\n');
  const after = await generate(directory);
  for (const file of ['skills/stack-diagrams/SKILL.md', 'guide/agent-workflow.md', ...['', 'ja/', 'zh/', 'ko/'].map(locale => `site/${locale}guide/agent-workflow.md`)]) {
    assert.notEqual(before[file], after[file]);
    assert.ok(after[file].includes('Keep the existing diagram title.'));
  }
  assert.deepEqual(await generate(directory), after);
  await generate(directory, true);
});

test('release lock updates all rendered version references', async t => {
  const directory = await fixture(t);
  const releasePath = path.join(directory, 'content/cli-release.json');
  const release = JSON.parse(await readFile(releasePath, 'utf8'));
  release.version = '9.8.7';
  await writeFile(releasePath, JSON.stringify(release));
  const outputs = await generate(directory);
  for (const file of ['skills/stack-diagrams/SKILL.md', 'guide/agent-workflow.md', ...['', 'ja/', 'zh/', 'ko/'].map(locale => `site/${locale}guide/getting-started.md`)]) {
    assert.ok(outputs[file].includes('9.8.7'));
    assert.ok(!outputs[file].includes('0.4.0'));
  }
});

test('canonical story changes reach the home and introduction without duplicating copy', async t => {
  const directory = await fixture(t);
  const storyPath = path.join(directory, 'content/product-story.json');
  const story = JSON.parse(await readFile(storyPath, 'utf8'));
  story.features[0].title = 'Updated canonical benefit';
  story.hero.tagline = 'A revised tagline.';
  await writeFile(storyPath, JSON.stringify(story));
  const outputs = await generate(directory);
  assert.ok(outputs['site/index.md'].includes('A revised tagline.'));
  assert.ok(outputs['site/index.md'].includes('Updated canonical benefit'));
  assert.ok(outputs['site/guide/what-is-stack.md'].includes('Updated canonical benefit'));
  for (const locale of ['ja', 'zh', 'ko']) assert.ok(!outputs[`site/${locale}/index.md`].includes('Updated canonical benefit'));
  await generate(directory, true);
});

test('check rejects modified, missing, and unexpected generated files', async t => {
  const directory = await fixture(t);
  await generate(directory);
  const target = path.join(directory, 'generated/guide/agent-workflow.md');
  await writeFile(target, 'manual edit');
  await assert.rejects(generate(directory, true), /Generated content drift/);
  await generate(directory);
  await rm(target);
  await assert.rejects(generate(directory, true), /inventory drift/);
  await generate(directory);
  await writeFile(path.join(directory, 'generated/unexpected.md'), 'old output');
  await assert.rejects(generate(directory, true), /obsolete generated files/);
});

test('unknown tokens and mutable provider revisions fail closed', () => {
  const metadata = { name: 'stack-diagrams', description: 'Create Stack diagrams.', license: 'Apache-2.0' };
  const release = { repository: 'stack-sh/cli', revision: 'a'.repeat(40), version: '0.4.0' };
  assert.throws(() => renderGuidance('{{missing}}', metadata, release), /Unknown template token/);
  assert.throws(() => renderGuidance('content', metadata, { ...release, revision: 'main' }));
});

test('all four locales expose the same page set and shared copyable instruction', async t => {
  const directory = await fixture(t);
  const outputs = await generate(directory);
  const locales = ['', 'ja/', 'zh/', 'ko/'];
  const englishPages = Object.keys(outputs).filter(file => file.startsWith('site/') && !/^site\/(ja|zh|ko)\//.test(file)).map(file => file.slice(5)).sort();
  assert.equal(englishPages.length, 15);
  const prompt = (await readFile(path.join(directory, 'content/agent-prompt.txt'), 'utf8')).trimEnd();
  for (const locale of locales) {
    for (const page of englishPages) assert.ok(outputs[`site/${locale}${page}`], `Missing ${locale}${page}`);
    assert.ok(outputs[`site/${locale}guide/coding-agents.md`].includes(prompt));
    assert.equal(outputs[`site/${locale}guide/agent-workflow.md`].replace(/^\$ /gm, ''), outputs['guide/agent-workflow.md']);
    const gettingStarted = outputs[`site/${locale}guide/getting-started.md`];
    for (const destination of ['./coding-agents', '../examples/', './provider-icons', '../language/syntax', '../reference/diagnostics-and-limits', 'https://github.com/stack-sh/cli/blob/main/docs/configuration.md']) {
      assert.ok(gettingStarted.includes(`](${destination})`), `Missing next step: ${locale}${destination}`);
    }
  }
  assert.equal(Object.keys(outputs).filter(file => file.startsWith('site/')).length, 60);
});
