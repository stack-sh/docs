# Document and syntax

Stack source is intentionally small. This page covers the complete lexical structure and grammar for draft Stack 1.0.

## Document structure

A document is one UTF-8 `.stack` file with no byte order mark. LF and CRLF line endings have the same meaning. The first non-comment token is a version directive, followed by exactly one diagram and no trailing declarations.

```stack
// One file, one diagram.
stack 1.0

diagram "Example" {
  node api "API"
}
```

The diagram title is required, contains 1 to 80 Unicode scalar values, and cannot begin or end with Unicode whitespace. A diagram must contain at least one node.

## Comments and whitespace

Spaces, tabs, and line endings separate tokens but do not otherwise affect meaning. A line comment starts with `//` and ends at the line ending. Comments are allowed wherever whitespace is allowed. Block comments are not supported.

Formatting is not semantic, but the canonical formatter emits a consistent representation described in [Canonical formatting](./formatting).

## Identifiers

Node, group, theme, and reference identifiers match:

```text
[a-z][a-z0-9_-]*
```

They contain 1 to 64 ASCII characters, are case-sensitive, and are not displayed. Nodes and groups share one global namespace. Keywords are contextual and may technically appear where an identifier is expected, but avoid identifiers that make declarations hard to read.

Icon identifiers are quoted strings whose decoded value matches `[a-z0-9][a-z0-9-]*`, also with 1 to 64 ASCII characters. They are resolved inside the effective theme.

## Strings

Strings use double quotes and may contain Unicode directly. Only three escape forms exist:

| Escape   | Meaning           |
| -------- | ----------------- |
| `\"`     | Double quote      |
| `\\`     | Backslash         |
| `\uXXXX` | Unicode code unit |

Decoded strings cannot contain line breaks, tabs, control characters, or unpaired surrogates. Titles, labels, and details cannot begin or end with Unicode whitespace. Strings are plain text; Markdown and HTML are never interpreted.

## Complete grammar

```text
document          = version-directive, diagram-declaration, EOF ;
version-directive = "stack", integer, ".", integer ;
diagram-declaration
                  = "diagram", string, "{", { diagram-member }, "}" ;
diagram-member    = node-declaration | group-declaration | edge-declaration
                  | theme-statement | layout-block ;
theme-statement   = "theme", identifier ;
group-declaration = "group", identifier, string, "{", { group-member }, "}" ;
group-member      = node-declaration | group-declaration | layout-block ;
node-declaration  = "node", identifier, string, [ node-block ] ;
node-block        = "{", node-property, { node-property }, "}" ;
node-property     = "kind", node-kind | "icon", string | "detail", string ;
node-kind         = "actor" | "client" | "service" | "function" | "worker"
                  | "database" | "cache" | "queue" | "storage" | "external" ;
edge-declaration  = "edge", identifier, edge-operator, identifier,
                    [ string ], [ edge-block ] ;
edge-operator     = "->" | "<->" | "--" ;
edge-block        = "{", edge-property, { edge-property }, "}" ;
edge-property     = "kind", edge-kind ;
edge-kind         = "flow" | "request" | "event" | "data" | "dependency" ;
layout-block      = "layout", "{", layout-statement,
                    { layout-statement }, "}" ;
layout-statement  = direction-statement | rank-statement | order-statement ;
direction-statement
                  = "direction", ( "right" | "down" ) ;
rank-statement    = "rank", "same", identifier-list ;
order-statement   = "order", identifier-list ;
identifier-list   = "[", identifier, ",", identifier,
                    { ",", identifier }, "]" ;
integer           = "0" | nonzero-digit, { digit } ;
```

## Contextual keywords

Stack 1.0 recognizes these words in their grammatical positions:

```text
stack diagram group node edge theme layout kind icon detail direction
rank same order right down actor client service function worker
database cache queue storage external flow request event data dependency
```

Unknown declarations, properties, enum values, and operators are errors. Tools do not silently ignore syntax that could create a plausible but incorrect diagram.
