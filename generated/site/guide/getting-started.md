# Getting started

Choose one installer, then create your first SVG below. Prefer working in your terminal or with a [coding agent](./coding-agents)? Use the CLI. Want to try Stack without installing anything? Open the [Playground](https://stack-diagram.com/) and follow the browser example further down.

## Install the CLI

Stack CLI 0.5.2 supports macOS and glibc Linux on arm64 and x86_64. Prebuilt archives require macOS 13 or glibc 2.31 or newer; Windows and Alpine/musl are not supported. Choose one installer so different copies do not compete on `PATH`. The [distribution contract](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#supported-platform-matrix) owns the exact support matrix.

### Homebrew

Use an existing Homebrew installation on Apple Silicon macOS or supported Linux. Homebrew’s own tier-1 host requirements also apply.

```text
brew install stack-sh/tap/stack
```

### Cargo

Use Rust 1.85 or newer with a native linker: Xcode Command Line Tools on macOS, or a C compiler/linker on Linux. Make sure Cargo’s bin directory is on `PATH`. The package is `stack-diagram-cli`; the installed command is `stack`.

```text
cargo install stack-diagram-cli --version 0.5.2 --locked
```

### Aqua

At the root of a Git repository (the directory containing `.git`), save the following as `aqua.yaml`. If this is a new project, run `git init` first:

```yaml
checksum:
  enabled: true
  require_checksum: true
  supported_envs:
    - all
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 42702cda91a4156901b9a601bd143c43dcf05766
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli@v0.5.2
    registry: stack-sh
```

Save this narrowly scoped policy as `aqua-policy.yaml`, review it, then allow it and install with Aqua:

```yaml
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 'Version == "42702cda91a4156901b9a601bd143c43dcf05766"'
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli
    registry: stack-sh
    version: semver(">= 0.3.0")
```

```text
aqua policy allow
aqua update-checksum
aqua install
```

Commit `aqua.yaml`, `aqua-policy.yaml`, and the generated `aqua-checksums.json`. Aqua’s bin directory must be on `PATH`. The registry is pinned to an immutable revision; do not replace it with `main`.

### Direct download

With the [GitHub CLI](https://cli.github.com/) installed and authenticated, run this in a POSIX shell on a supported host. It downloads to a new temporary directory, verifies the checksum and exact tagged publisher identity before extraction, and refuses to replace an existing `~/.local/bin/stack`. The archive is ad-hoc signed on macOS, not notarized. Stop if any verification fails.

```text
(
  set -eu
  version=0.5.2
  case "$(uname -s)/$(uname -m)" in
    Darwin/arm64) target=aarch64-apple-darwin ;;
    Darwin/x86_64) target=x86_64-apple-darwin ;;
    Linux/aarch64) target=aarch64-unknown-linux-gnu ;;
    Linux/x86_64) target=x86_64-unknown-linux-gnu ;;
    *) echo "Unsupported platform" >&2; exit 1 ;;
  esac
  archive="stack-v${version}-${target}.tar.gz"
  download_dir=$(mktemp -d)
  cd "$download_dir"
  gh release download "v$version" --repo stack-sh/cli --pattern "$archive" --pattern "stack-v${version}-checksums.txt"
  awk -v archive="$archive" '$2 == archive { print }' "stack-v${version}-checksums.txt" > archive-checksum.txt
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum --check archive-checksum.txt
  else
    shasum -a 256 --check archive-checksum.txt
  fi
  gh attestation verify "$archive" --repo stack-sh/cli --signer-workflow stack-sh/cli/.github/workflows/release.yaml --source-ref "refs/tags/v$version" --deny-self-hosted-runners
  tar -xzf "$archive"
  mkdir -p "$HOME/.local/bin"
  test ! -e "$HOME/.local/bin/stack"
  install -m 0755 "stack-v${version}-${target}/stack" "$HOME/.local/bin/stack"
)
export PATH="$HOME/.local/bin:$PATH"
```

## Create your first SVG

In a new empty working directory, run the following. With Aqua, keep this directory inside the Git repository containing your `aqua.yaml`:

```sh
$ stack --version
$ stack init
$ stack check diagram.stack
$ stack render diagram.stack -o diagram.svg
```

Expected: `stack 0.5.2`, a new `diagram.stack`, no check errors, and a non-empty `diagram.svg`. Open the SVG in a browser or add it to your README. `stack init` protects existing files; use a fresh directory instead of overwriting your work.

Edit `diagram.stack` to describe your system, then repeat check and render. Format it when needed:

```sh
$ stack fmt diagram.stack
$ stack fmt --check diagram.stack
```

## Check your installation and add shell integration

Before relying on Stack in a project or coding-agent workflow, inspect the installation with two read-only commands:

```text
$ stack doctor
$ stack config path
```

`stack doctor` reports the CLI version, selected configuration path, configuration health, effective icon-store path, and installed known-provider packs. A missing default configuration or icon store is healthy; invalid or unreadable configured paths exit with status `2` and include a corrective action. `stack config path` prints the selected `config.yaml` path without creating or reading it.

Homebrew installs the matching completion and manual files automatically. Direct, Aqua, and Cargo users can generate the same deterministic files for their shell:

```text
$ stack completions bash
$ stack completions zsh
$ stack completions fish
$ stack manpage
```

These commands print to standard output and never edit shell startup files. Save the output in your shell's user-owned completion or manual directory by following the [shell integration guide](https://github.com/stack-sh/cli/blob/main/docs/completions.md). You can also read the offline manual without installing it:

```text
$ stack manpage > stack.1
$ man ./stack.1
```

## Write your first document

For the browser path, open the [Playground](https://stack-diagram.com/) and replace its editor content with this example. CLI users can save the same source as `diagram.stack` and repeat the check/render commands above:

```stack
stack 1.0

diagram "Checkout" {
  theme default

  node shopper "Shopper" {
    kind actor
  }

  group application "Application" {
    node web "Web app" {
      kind client
      detail "React"
    }

    node api "Checkout API" {
      kind service
      detail "Rust"
    }

    layout {
      direction right
      order [web, api]
    }
  }

  node orders "Orders" {
    kind database
    detail "PostgreSQL"
  }

  edge shopper -> web "HTTPS" {
    kind request
  }

  edge web -> api "JSON" {
    kind request
  }

  edge api -> orders "SQL" {
    kind data
  }

  layout {
    direction right
    order [shopper, application, orders]
  }
}
```

## Render and inspect

Select **Run** or press <kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>. The preview shows a standalone SVG. Select the preview to inspect it at a larger size, then use **Download SVG** when you want the file.

The source has four parts:

1. `stack 1.0` declares the language version.
2. `diagram` provides one title and contains the architecture.
3. `node` and `group` declare components and boundaries.
4. `edge` records relationships, while `layout` supplies constrained placement intent.

## Check and format

Use **Check** to run the complete validation and layout pipeline without replacing the SVG. Use **Format** to rewrite syntactically valid source into the canonical two-space form while preserving line comments and meaning.

If Stack finds a problem, the diagnostic shows its severity, stable code, location, source frame, expected values, and corrective help when available. Selecting a diagnostic focuses its source range.

## Choose what to learn next

- **Write with your coding agent:** install the optional [Stack skill](./coding-agents) and use the shared check/render workflow.
- **Find a starting point:** open a [live example](../examples/) in the Playground, then explore [themes and icons](../language/themes-and-icons).
- **Use your own setup:** [import provider icons](./provider-icons), then choose their local store through the [CLI configuration guide](https://github.com/stack-sh/cli/blob/main/docs/configuration.md). Configuration is a CLI contract; the browser uses explicit local pack import.
- **Look up the details:** use the [language reference](../language/syntax) and [diagnostics and limits](../reference/diagnostics-and-limits) as you model a larger system.

## Update or uninstall

Stack does not update itself. Use the installer that owns your binary. Configuration and imported icon packs remain in place when the binary is removed.

| Installer | Update | Uninstall |
| --- | --- | --- |
| Homebrew | `brew upgrade stack-sh/tap/stack` | `brew uninstall stack-sh/tap/stack` |
| Cargo | Run the Cargo install command above with the desired version. | `cargo uninstall stack-diagram-cli` |
| Aqua | `aqua update`, `aqua update-checksum`, `aqua install` | Run `aqua rm -m pl stack-sh,stack-sh/cli` while this configuration is present, then remove `stack-sh/cli` from `aqua.yaml`. Other projects using this package may reinstall it when needed. |
| Direct download | Verify a new release and replace only your directly installed binary. | Remove only the direct binary you installed (`~/.local/bin/stack`). |

For upgrade recovery and artifact verification, see [safe upgrades](https://github.com/stack-sh/cli/blob/main/docs/self-update.md) and [supply-chain verification](https://github.com/stack-sh/cli/blob/main/docs/supply-chain.md).
