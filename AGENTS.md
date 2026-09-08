# Repository guide

This repository owns shared user documentation and agent guidance. Write repository content, code comments, commits, and pull requests in English; translated documentation keeps its target language.

Edit sources under `content/`, not files under `generated/`. Run `npm run generate`, `npm run check`, and `npm test`. Commit generated changes together with their sources. Keep generation deterministic and offline.

Language syntax, schemas, and canonical examples belong to `stack-sh/specification`. CLI-specific contracts belong to `stack-sh/cli`. Link to those owners instead of creating competing contracts here.

Preserve the public documentation URLs and the `npx skills add stack-sh/cli` installation entry point. Consumer updates must pin a merged provider commit and validate generated content before publication. Use topic branches and pull requests; never push implementation directly to main. Write pull request titles and bodies in English, and follow `.github/pull_request_template.md` without removing or renaming its sections.
