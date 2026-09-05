# Getting started

The fastest way to use Stack is the browser [Playground](https://stack-diagram.com/). It runs the formatter, validator, layout engine, and SVG renderer locally in WebAssembly; you do not need to install a command or send source to a rendering API.

## Install the native CLI

For terminal workflows and local automation, install the owner-maintained Homebrew formula with `brew install stack-sh/tap/stack`. It uses the canonical Stack CLI 0.4.0 release archive and supports Apple Silicon macOS plus glibc-based Linux on arm64 and x86_64 when the host meets Homebrew's current tier-1 requirements. Homebrew owns upgrades through `brew upgrade stack-sh/tap/stack`; uninstalling the formula leaves your Stack configuration and icon store in place. See the [CLI distribution contract](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#homebrew-installation) for the exact platform matrix, direct-install alternative, and recovery policy.

## Write your first document

Replace the editor content with this example:

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

- Read [Document and syntax](../language/syntax) for lexical rules and the complete grammar.
- Read [Nodes and groups](../language/nodes-and-groups) to model components and boundaries.
- Read [Edges and layout](../language/edges-and-layout) for relationships and placement intent.
- Read [Themes and icons](../language/themes-and-icons) before selecting a visual system or explicit icon.
