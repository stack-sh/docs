# Coding agents

Use Stack with a coding agent to keep architecture diagrams as reviewable source. The agent can read the language reference and run the CLI locally; a remote MCP server is not required.

## Install the skill

Install only the diagram skill with `npx skills add stack-sh/cli`. This installs into the current project; add `-g` only when you want a user-wide installation. Review the downloaded instructions before use. This installs instructions, not the Stack CLI. For a reproducible installation, clone the repository, check out a reviewed commit, then run `npx skills add /absolute/path/to/cli --skill stack-diagrams`. The installer does not accept a raw commit SHA as a remote branch.

[SKILL.md](https://github.com/stack-sh/cli/blob/main/skills/stack-diagrams/SKILL.md)

## Without installation

Copy this instruction into your agent and add the architecture requirements. The same prompt works without a skill-aware client, provided it can read HTTPS pages and execute local commands.

```text
Use Stack to create or edit the architecture described below. Read https://stack-diagram.com/docs/guide/agent-workflow.md and follow its local validation and safety workflow. Read the relevant language reference and examples as needed. Deliver editable .stack source and report verification results. Architecture requirements:
```

The full [agent workflow](./agent-workflow) is generated from the same source as the CLI skill. The canonical agent instructions are in English; copy them or let your agent read the Markdown URL above.

## Reference and updates

- [Examples](../examples/index)
- [Syntax](../language/syntax)
- [Diagnostics](../reference/diagnostics-and-limits)
- [Provider icons](./provider-icons)
- [Markdown index](https://stack-diagram.com/docs/llms.txt)
