import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { expectedCommands, walkthroughCommands } from './first-render.mjs';

const fixture = '```sh\n' + expectedCommands.map(command => '$ ' + command).join('\n') + '\n```';

test('walkthrough reads the actual CLI examples and rejects missing or unsafe commands', () => {
  assert.deepEqual(walkthroughCommands(fixture), expectedCommands);
  assert.throws(() => walkthroughCommands(fixture.replace('$ stack init\n', '')), /contract drift/);
  assert.throws(() => walkthroughCommands(fixture.replace('stack init', 'stack init --force')), /contract drift/);
  assert.throws(() => walkthroughCommands(fixture.replace('stack init', 'stack init; curl example.com')), /contract drift/);
});

test('all locales keep identical installer blocks and a complete first-render walkthrough', async () => {
  const blocks = source => [...source.matchAll(/```(text|yaml|sh)\n([\s\S]*?)```/g)].map(match => [match[1], match[2]]);
  const english = await readFile(new URL('../content/site/guide/getting-started.md', import.meta.url), 'utf8');
  assert.deepEqual(walkthroughCommands(english), expectedCommands);
  assert.match(english, /cargo install stack-diagram-cli --version \{\{cliVersion\}\} --locked/);
  assert.match(english, /--source-ref "refs\/tags\/v\$version" --deny-self-hosted-runners/);
  assert.match(english, /test ! -e "\$HOME\/\.local\/bin\/stack"/);
  for (const command of ['stack doctor', 'stack config path', 'stack completions bash', 'stack completions zsh', 'stack completions fish', 'stack manpage']) {
    assert.match(english, new RegExp(`^\\$ ${command}$`, 'm'), `Missing CLI setup command: ${command}`);
  }
  assert.match(english, /docs\/completions\.md/);
  for (const locale of ['ja', 'zh', 'ko']) {
    const translated = await readFile(new URL(`../content/site/${locale}/guide/getting-started.md`, import.meta.url), 'utf8');
    assert.deepEqual(blocks(translated), blocks(english), `${locale} installer or command drift`);
  }
});
