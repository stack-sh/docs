import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
export const expectedCommands = [
  'stack --version',
  'stack init',
  'stack check diagram.stack',
  'stack render diagram.stack -o diagram.svg',
  'stack fmt diagram.stack',
  'stack fmt --check diagram.stack',
];

export function walkthroughCommands(source) {
  const commands = [...source.matchAll(/```sh\n([\s\S]*?)```/g)]
    .flatMap(match => match[1].trim().split('\n'))
    .map(line => {
      assert.ok(line.startsWith('$ '), 'CLI examples need a copyable prompt');
      return line.slice(2);
    });
  // Execute only the documented local walkthrough, never installer or shell text.
  assert.deepEqual(commands, expectedCommands, 'First-render command contract drift');
  return commands;
}

export async function verifyWalkthrough(binary, directory = root) {
  assert.ok(binary && path.isAbsolute(binary), 'STACK_CLI_BIN must be an absolute path');
  const release = JSON.parse(await readFile(path.join(directory, 'content/cli-release.json'), 'utf8'));
  for (const locale of ['', 'ja/', 'zh/', 'ko/']) {
    const source = await readFile(path.join(directory, `generated/site/${locale}guide/getting-started.md`), 'utf8');
    const commands = walkthroughCommands(source);
    const temporary = await mkdtemp(path.join(os.tmpdir(), 'stack-first-render-'));
    try {
      const env = { ...process.env, XDG_CONFIG_HOME: path.join(temporary, 'config'), XDG_DATA_HOME: path.join(temporary, 'data'), XDG_CACHE_HOME: path.join(temporary, 'cache') };
      for (const command of commands) {
        const [, ...args] = command.split(' ');
        const result = await execute(binary, args, { cwd: temporary, env, timeout: 30_000 });
        if (args[0] === '--version') assert.equal(result.stdout, `stack ${release.version}\n`);
        assert.doesNotMatch(result.stderr, /error\[/, command);
      }
      const svg = await readFile(path.join(temporary, 'diagram.svg'), 'utf8');
      assert.match(svg, /<svg\b/);
      assert.match(svg, /<\/svg>/);
      assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\son\w+=/i);
      console.log(`Verified ${locale || 'en/'}first render against published CLI ${release.version}.`);
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyWalkthrough(process.env.STACK_CLI_BIN);
}
