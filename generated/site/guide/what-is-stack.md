# What is Stack?

Stack is a small declarative language for static software architecture and technology-stack diagrams. You describe components, boundaries, and relationships in a UTF-8 `.stack` file. A renderer decides coordinates, spacing, routes, typography, and visual treatment.

This split keeps the source concise, reviewable, and useful in version control. It also lets the same document be formatted, checked, and rendered by conforming tools without turning the file into drawing instructions.

## The basic model

Every document contains a language version and exactly one diagram. A diagram contains nodes, optional groups, edges, an optional theme, and optional layout intent.

```stack
stack 1.0

diagram "Service architecture" {
  node client "Web app" {
    kind client
  }

  node api "API" {
    kind service
    detail "Order orchestration"
  }

  edge client -> api "HTTPS" {
    kind request
  }
}
```

The document says that a client calls a service. It does not say where either box sits or how an arrow bends.

## What Stack optimizes for

- **Beautiful by default:** Describe the system, not every box. Automatic layout and coordinated themes keep your diagrams polished without manual positioning or styling.
- **Consistent everywhere:** Move between your coding agent, terminal, and browser. The shared engine keeps the same source, theme, and icon packs consistent across workflows.
- **Fast, local rendering:** Edit, render, and repeat without a rendering server. Keep your source on your device and export standalone SVG without scripts or external assets.

Consistency assumes matching engine versions and the same source, theme, and icon packs. Rendering stays local; installing tools, loading the website, and explicitly importing provider icons can require network access. See [versioning and safety](../reference/versioning-and-safety) for the exact boundaries.

## What Stack is not

Stack 1.0 is not a general graph language, pixel-perfect canvas, infrastructure definition, or executable programming language. It has no variables, imports, macros, conditionals, CSS, coordinates, arbitrary URLs, or embedded HTML. It is not a sequence, state-machine, class, ER, or complete UML notation.

Use several focused diagrams for a large system. A single Stack document deliberately has readability limits rather than unlimited elements.

## Processing model

A tool decodes and parses the document, resolves identifiers and defaults, validates semantics, resolves the theme and icons, solves layout, and finally renders. Source errors stop rendering. Missing optional theme or icon resources and unsatisfied layout hints are warnings, so the engine can still return a fallback diagram.

The [language pages](../language/syntax) explain every author-facing construct. The [versioning and safety reference](../reference/versioning-and-safety) explains compatibility and trust boundaries.
