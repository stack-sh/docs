import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
