import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { productCopy, productTokens } from './product-story.mjs';

test('canonical story has one product heading, three evidenced benefits, and both first-success paths', async () => {
  const story = JSON.parse(await readFile(new URL('../content/product-story.json', import.meta.url), 'utf8'));
  assert.equal(story.schemaVersion, '1.0');
  assert.equal(story.hero.name, 'Stack');
  assert.equal(story.features.length, 3);
  assert.equal(new Set(story.features.map(feature => feature.id)).size, 3);
  for (const feature of story.features) {
    assert.ok(feature.title.length > 0 && feature.title.length <= 40);
    assert.ok(feature.details.length > 0 && feature.details.length <= 220);
    assert.ok(feature.evidence.length > 0);
    for (const evidence of feature.evidence) assert.ok(evidence.startsWith('https://github.com/stack-sh/'));
  }
  assert.equal(story.hero.primaryAction.link, '/guide/getting-started');
  assert.equal(story.hero.secondaryAction.link, 'https://stack-diagram.com/');
  assert.match(story.firstSuccess.join('\n'), /npx skills add stack-sh\/cli/);
  assert.match(story.firstSuccess.join('\n'), /Playground/);
  assert.match(story.claimBoundaries.join('\n'), /matching engine versions/);
  assert.match(story.claimBoundaries.join('\n'), /runtime/);
});

test('localized homepage metadata keeps H1 product-only and exactly three matching benefits', async () => {
  const story = JSON.parse(await readFile(new URL('../content/product-story.json', import.meta.url), 'utf8'));
  const translations = JSON.parse(await readFile(new URL('../content/product-story-locales.json', import.meta.url), 'utf8'));
  for (const locale of ['en', 'ja', 'zh', 'ko']) {
    const copy = productCopy(story, translations, locale);
    assert.equal(copy.hero.name, 'Stack');
    assert.equal(copy.hero.text, undefined);
    assert.equal(copy.features.length, 3);
    assert.equal(copy.hero.actions[0].link, `${locale === 'en' ? '' : `/${locale}`}/guide/getting-started`);
    assert.equal(copy.hero.actions[1].link, 'https://stack-diagram.com/');
    assert.ok(copy.description.length > 0 && copy.description.length <= 160);
    const tokens = productTokens(copy);
    assert.ok(tokens.productBenefits.includes(copy.features[0].title));
    assert.equal(JSON.parse(tokens.productHome.split('\n')[1].slice(6)).name, 'Stack');
  }
  assert.throws(() => productCopy(story, translations, 'fr'), /Unknown/);
  const incomplete = structuredClone(translations);
  delete incomplete.ja.features['fast-local-rendering'];
  assert.throws(() => productCopy(story, incomplete, 'ja'), /inventory drift/);
  const empty = structuredClone(translations);
  empty.ko.hero.tagline = '';
  assert.throws(() => productCopy(story, empty, 'ko'), /Missing translated/);
});
