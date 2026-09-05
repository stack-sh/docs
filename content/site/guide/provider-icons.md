# Provider icons

Stack includes a provider-neutral core icon catalog. AWS, Google Cloud, Azure, and common developer and collaboration artwork are available through provider packs stored in your user-managed icon store.

## Available provider catalog

The audited catalog contains 1,051 IDs: 305 AWS Architecture Icons, 45 Google Cloud product and category icons, 639 Azure service icons, and 62 curated tool icons. The tool catalog includes GitHub, GitHub Actions, Notion, Linear, Atlassian, Jira, Confluence, Docker, Kubernetes, Terraform, Datadog, Grafana, Sentry, and more.

Select a provider card to see its import command, then search or filter the complete catalog. Results are shown 100 at a time for comfortable use on smaller devices.

<ProviderCatalog locale="en" />

A provider pack supplies artwork. The node `kind` in Stack source continues to control semantic styling and layout.

## Quick start

Import each provider used by a diagram once. `--accept-terms` records your confirmation that you reviewed the linked provider and brand terms.

```sh
$ stack icons import gcp --accept-terms
$ stack icons import simple-icons --accept-terms
$ stack render architecture.stack -o architecture.svg
```

The CLI downloads the audited official archives, verifies their complete SHA-256 hashes, sanitizes the selected SVGs, and writes each processed provider pack to the shared icon store. Google Cloud product and category artwork is imported together by the single `gcp` command.

## Use provider icons in CLI

A Stack file can use multiple providers. This example combines Cloud Run from Google Cloud with GitHub from Simple Icons:

```stack
stack 1.0

diagram "Deploy from GitHub to Cloud Run" {
  node repository "GitHub" {
    kind external
    icon "simple-icons:github"
  }

  node service "Cloud Run" {
    kind service
    icon "gcp:cloud-run"
  }

  edge repository -> service "Deploy" {
    kind dependency
  }
}
```

After both imports, the standard render command discovers both packs:

```sh
$ stack render architecture.stack -o architecture.svg --notice architecture.NOTICE.md
```

## Shared icon store

The default icon store is `$XDG_CONFIG_HOME/stack/icons`. When `XDG_CONFIG_HOME` is unset, Stack uses `$HOME/.config/stack/icons`.

```text
icons/
  aws/
  gcp/
  azure/
  simple-icons/
```

Set a different shared location in `$XDG_CONFIG_HOME/stack/config.yaml` with an absolute path:

```yaml
default_icons_path: /absolute/path/to/stack-icons
```

The configured location is used by both `stack icons import` and `stack render`.

## Use provider icons in Playground

Open **Icons**, choose the `stack/icons` folder, and the Playground loads every recognized provider directory in that store. Search the loaded artwork and select an item to copy its ID into Stack source.

The selected packs are processed in the current browser tab. When a rendered diagram contains provider artwork, **Notice** beside the SVG download provides the source, terms, and used-icon record.

## Keep icons with a project

Use `-o` to place imported packs in a project directory that can be committed with the repository:

```sh
$ stack icons import gcp --accept-terms -o .stack-icons
$ stack icons import simple-icons --accept-terms -o .stack-icons
```

Pass that icon-store root with `--provider-pack` when rendering:

```sh
$ stack render architecture.stack \
  --provider-pack .stack-icons \
  -o architecture.svg \
  --notice architecture.NOTICE.md
```

## Find icon IDs

Search the catalog from the CLI or on this page:

```sh
$ stack icons list
$ stack icons list aws s3
$ stack icons list azure database
$ stack icons list simple-icons github
```

The CLI output contains `ID`, `PRODUCT`, `CATEGORY`, and recommended `KIND` columns. Namespaced IDs such as `gcp:cloud-run` and `simple-icons:github` select artwork from the corresponding pack.

## Verification, terms, and notices

The CLI catalog pins each official HTTPS archive URL, release, complete archive SHA-256, allowlisted entry path, terms URL, and review date. Import applies bounded archive and SVG sizes, sanitizes active and external SVG content, and writes each pack atomically.

Each pack includes `NOTICE.md`. `stack render --notice <PATH>` writes the exact pack revisions, source releases, terms URLs, attribution, non-endorsement text, and used icon IDs for a rendered artifact. The catalog links each provider's official source and terms, plus brand sources and guidelines for curated Simple Icons marks.
