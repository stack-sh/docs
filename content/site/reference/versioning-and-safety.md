# Versioning and safety

Draft Stack 1.0 separates the source language, implementation, theme catalog, and package versions. Understanding that boundary makes documents portable and rendered output reproducible.

## Language version

Every document starts with a `major.minor` directive:

```stack
stack 1.0

diagram "Versioned source" {
  node api "API"
}
```

This is the minimum language grammar and semantics required by the document, not an engine or theme version. A renderer supporting `M.N` accepts the same major with a minor less than or equal to `N`, rejects a different major, and rejects a higher minor unless it explicitly supports it. It never guesses unknown future syntax.

Specification releases use semantic versioning. A major release may change the language incompatibly; a minor adds backwards-compatible capabilities; a patch clarifies wording or fixes errata without changing valid source meaning. The document omits a patch number for that reason.

## Renderer and catalog identity

Normal engine results include the engine version, authored language version, theme catalog version, and catalog content revision. The source `theme` statement selects a symbolic identifier only. It does not pin a package release or fetch remote data.

Exact pixel output is not a language compatibility promise. Theme metrics, renderer versions, fonts, and canvas decisions may change positions while preserving nodes, groups, relationships, labels, kinds, and constraints.

## Safe source boundary

Stack strings are plain text. Source cannot contain executable code, arbitrary HTML or Markdown, CSS, SVG, imports, macros, file paths, or network URLs. The engine escapes authored text and emits standalone SVG with embedded validated catalog icons, local marker references, and accessible title and description metadata.

Rendered SVG contains no script, event handler, arbitrary external reference, host font measurement, or runtime I/O. Missing icon and theme names select bundled fallbacks rather than resolving paths or contacting a registry.

## Current delivery status

- The browser Playground is the supported public experience.
- Public `@stack-sh/engine` provides the typed WebAssembly `format`, `check`, and `render` operations used by the Playground.
- Public `@stack-sh/language` provides the shared TextMate grammar and language metadata used for editor highlighting.
- Public [`stack-sh/cli`](https://github.com/stack-sh/cli) provides native `format`, `check`, `render`, and provider-icon store operations.

The normative language contract remains in [`stack-sh/specification`](https://github.com/stack-sh/specification). The public theme catalog is in [`stack-sh/theme`](https://github.com/stack-sh/theme), and engine behavior is in [`stack-sh/engine`](https://github.com/stack-sh/engine).
