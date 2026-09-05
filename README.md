# Stack documentation sources

Canonical user documentation and generated agent guidance for Stack architecture diagrams.

## Ownership

Edit the shared agent workflow in `content/agent-workflow.md`. Both the installable
skill and the human-readable workflow are generated from this one source. Skill
discovery metadata lives in `content/skill-metadata.json`, and published CLI
identity lives in `content/cli-release.json`.

Language syntax, schemas, and canonical examples remain owned by
[stack-sh/specification](https://github.com/stack-sh/specification).
[stack-sh/cli](https://github.com/stack-sh/cli) owns native command behavior and the
`npx skills add stack-sh/cli` installation entry point.
[stack-sh/web](https://github.com/stack-sh/web) owns the playground and deployment
at [stack-diagram.com/docs](https://stack-diagram.com/docs).

## Generate and verify

Node.js 22 or newer is required. There are no generation dependencies or install scripts.

```sh
npm run generate
npm test
npm run check
```

Commit source and generated changes together. Do not edit `generated/` directly.
Check mode rejects modified, missing, or unexpected generated files. Generation
does not silently delete old files. The manifest records SHA-256 values and the
published CLI revision; hashes prove byte integrity, not publisher identity.

Consumers must pin a reviewed, merged commit and verify its manifest and files.
The CLI's source revision is distinct from the documentation revision: updating
instructions does not publish a new CLI binary. Recheck capability statements
against the released binary's help when updating the release lock; changing a
version string alone does not prove a feature is available.

## Migration status

Shared workflow generation is available here. CLI and Web consumption, the full
multilingual guide migration, and automated consumer freshness checks are still
being integrated. Existing public documentation and skill installation remain
available from their current repositories until those consumer changes land.
