# Contributing to Stack documentation

Canonical user documentation and generated agent guidance for Stack architecture diagrams.

## Ownership

See [machine resource distribution](./MACHINE_RESOURCES.md) for the versioned
schema, grammar, diagnostics, examples, capability manifest, and consumer example.

Edit the shared agent workflow in `content/agent-workflow.md`. Both the installable
skill and the human-readable workflow are generated from this one source. Skill
discovery metadata lives in `content/skill-metadata.json`, and published CLI
identity lives in `content/cli-release.json`.

The canonical four-locale site sources live in `content/site/`. Preserve route
parity across English, Japanese, Chinese, and Korean pages when changing the site
inventory. Four generated `guide/agent-workflow.md` pages expose the canonical
English instructions used by the skill; the localized coding-agent guides explain
this and share one copyable prompt from `content/agent-prompt.txt`. This avoids
hand-maintaining the validation workflow both in a guide and a skill.
`{{cliVersion}}` comes from the release lock.

The English product story lives in `content/product-story.json`; Japanese,
Chinese, and Korean UI copy lives in `content/product-story-locales.json`, keyed
by the canonical benefit IDs. `{{productHome}}` generates homepage metadata and
`{{productBenefits}}` generates the introduction's benefit list. Update those
sources rather than copying marketing text into page templates. The homepage
has only `hero.name` as its H1, a separate tagline, and a `description` field
for page metadata and the website's supporting hero paragraph. The website
owns rendering that paragraph; no example SVG is generated here.

`generated/site/` contains complete Markdown inputs for the website. Website
presentation, images, VitePress configuration, and deployment are not owned here.

Language syntax, schemas, and canonical examples remain owned by
[stack-sh/specification](https://github.com/stack-sh/specification).
[stack-sh/cli](https://github.com/stack-sh/cli) owns native command behavior and the
`npx skills add stack-sh/cli` installation entry point.
[stack-sh/web](https://github.com/stack-sh/web) owns the playground and deployment
at [stack-diagram.com/docs](https://stack-diagram.com/docs).

## Generate and verify

Node.js 22 or newer is required. Generation uses only Node.js built-ins and has no
install scripts. Tests and machine conformance checks require the pinned development
dependencies; install them with `npm ci --ignore-scripts` first.

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

## Keep the published CLI reference current

Run `npm run release:sync` after a stable CLI release. It resolves the published
tag to its exact commit, updates `content/cli-release.json`, and regenerates all
version declarations. Review changed capabilities and run tests and the verified
release binary smoke before opening a PR. After merging, update both consumer
Docs pins and verify the website deployment and CLI skill installation.

`npm run release:check` and the read-only daily freshness workflow reject a newer
unrecorded stable release or a retargeted tag. They do not publish, install a CLI,
or merge changes. Scheduled runs can be delayed and GitHub notification settings
control failure notifications. Web additionally audits the release it deploys.

Site shell examples receive a generated `$ ` prompt; the installable skill keeps
executable command lines without prompts. The canonical source remains shared.

## Consumer freshness

`npm run consumers:check` compares the current generated content with the CLI and
Web main-branch pins and the website's public `/docs-source.json` deployment
provenance. It verifies every pinned manifest hash and the actual CLI skill bytes.
Equivalent content at an older commit is accepted; a website-only edit does not
require a pointless CLI skill update. Website production provenance identifies the
deployed source; it is not a substitute for checking rendered pages after release.

The read-only Consumer freshness workflow runs after Docs main changes, daily,
and on manual dispatch. A source change may intentionally fail this audit until
the required consumer PRs and Web deployment finish. Update the affected pins,
run consumer tests, merge and deploy, then rerun the audit. It never grants write
permissions or silently auto-merges consumer updates.

## Consumer ownership

CLI consumes a reviewed Docs revision through `skills/docs-source.json`; Web uses
`scripts/docs-source.json`. Both verify the manifest hash and generated file bytes.
Do not edit the generated CLI skill or website Markdown inputs in those repositories.
Edit the original content here, then update only the affected consumer pins through
reviewed PRs. Equivalent generated content does not require a pin-only update.

The website preserves the original four-locale routes and provides the machine
discovery endpoint. Its language, example, link, and build gates must continue to
pass. Source generation and deployment provenance alone do not prove rendered-site
compatibility: check public HTML/Markdown, agent discovery, and the consumer example
after deployment, then rerun the consumer freshness audit.
