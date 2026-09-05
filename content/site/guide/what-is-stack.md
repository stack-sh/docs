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

- **Concise authoring:** useful diagrams need little more than named nodes and edges.
- **Predictable generation:** each concept has one constrained representation that people and language models can produce reliably.
- **Semantic source:** a document records topology and intent, not pixels.
- **Polished output:** the renderer owns a coherent visual system.
- **Actionable errors:** diagnostics point to source ranges and can include expected values, corrective help, and related declarations.
- **Safe embedding:** source cannot execute code, fetch arbitrary assets, or inject HTML or SVG.

## What Stack is not

Stack 1.0 is not a general graph language, pixel-perfect canvas, infrastructure definition, or executable programming language. It has no variables, imports, macros, conditionals, CSS, coordinates, arbitrary URLs, or embedded HTML. It is not a sequence, state-machine, class, ER, or complete UML notation.

Use several focused diagrams for a large system. A single Stack document deliberately has readability limits rather than unlimited elements.

## Processing model

A tool decodes and parses the document, resolves identifiers and defaults, validates semantics, resolves the theme and icons, solves layout, and finally renders. Source errors stop rendering. Missing optional theme or icon resources and unsatisfied layout hints are warnings, so the engine can still return a fallback diagram.

The [language pages](../language/syntax) explain every author-facing construct. The [versioning and safety reference](../reference/versioning-and-safety) explains compatibility and trust boundaries.
