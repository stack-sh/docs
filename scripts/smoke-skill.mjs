import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const binary = process.env.STACK_CLI_BIN;
assert.ok(binary && path.isAbsolute(binary), 'STACK_CLI_BIN must be an absolute binary path');
const release = JSON.parse(await readFile(new URL('../content/cli-release.json', import.meta.url), 'utf8'));
const skill = await readFile(new URL('../generated/skills/stack-diagrams/SKILL.md', import.meta.url), 'utf8');
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stack-docs-skill-smoke-'));
try {
  const run = args => execute(binary, args, { cwd: temporary, env: { ...process.env, XDG_CONFIG_HOME: path.join(temporary, 'config') }, timeout: 30_000 });
  assert.equal((await run(['--version'])).stdout, `stack ${release.version}\n`);
  await run(['init', '-o', 'architecture.stack']);
  const commands = [...skill.matchAll(/```sh\n([\s\S]*?)```/g)].flatMap(match => match[1].trim().split('\n'));
  assert.ok(commands.length >= 4);
  for (const command of commands) {
    const [program, ...args] = command.trim().split(/\s+/);
    assert.equal(program, 'stack');
    assert.ok(['check', 'fmt', 'render'].includes(args[0]), 'Only local validation commands are allowed in the smoke workflow');
    const result = await run(args);
    assert.equal(result.stderr, '', `Unexpected diagnostic from ${command}`);
  }
  const svg = await readFile(path.join(temporary, 'architecture.svg'), 'utf8');
  assert.match(svg, /<svg\b/);
  assert.match(svg, /<\/svg>/);
  await run(['fmt', '--check', 'architecture.stack']);
  console.log(`Executed ${commands.length} generated skill commands against published CLI ${release.version}.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
