# Diagnostics and limits

Stack diagnostics are structured results, not console prose. They have a stable code, `error` or `warning` severity, a one-based end-exclusive source range, a concise message, and an ordered `expected` list. Corrective help and related source ranges are included when useful.

## Processing and severity

Tools process encoding and tokens, grammar, identifiers and defaults, semantic limits, theme and icon resolution, layout, then rendering. Errors in the first four stages prevent rendering. Theme, icon, density, and layout-hint warnings can accompany a fallback SVG.

The Playground clears stale diagnostics after source edits. Selecting a result focuses its primary source; related information can point back to an earlier declaration.

## Complexity limits

| Item                        |                          Draft Stack 1.0 limit |
| --------------------------- | ---------------------------------------------: |
| Diagrams per document       |                                              1 |
| Nodes                       |                                        1 to 40 |
| Groups                      |                                        0 to 12 |
| Group nesting below diagram |                                       3 levels |
| Edges                       | 0 to the smaller of 80 or twice the node count |
| Node degree before warning  |                  12 incident edge declarations |

Exceeding a hard limit is `STK4003`. A node above the recommended degree remains valid but emits `STK4002`. Split large systems into focused diagrams rather than compressing an exhaustive graph.

## Portable diagnostic codes

| Code      | Severity | Meaning                                                                   |
| --------- | -------- | ------------------------------------------------------------------------- |
| `STK1001` | Error    | Input is not valid UTF-8                                                  |
| `STK1002` | Error    | A byte order mark is present                                              |
| `STK1003` | Error    | A string has an invalid escape or decoded value                           |
| `STK2001` | Error    | The declared language version is unsupported                              |
| `STK2002` | Error    | An unexpected token, declaration, property, value, or operator was found  |
| `STK2003` | Error    | Input ended before the current construct was complete                     |
| `STK3001` | Error    | An identifier is invalid                                                  |
| `STK3002` | Error    | An identifier is declared more than once                                  |
| `STK3003` | Error    | An edge references an unknown node                                        |
| `STK3004` | Error    | A group is used as an edge endpoint                                       |
| `STK3005` | Error    | An edge connects a node to itself                                         |
| `STK3006` | Error    | An exact duplicate edge is declared                                       |
| `STK3007` | Error    | A property occurs more than once in one block                             |
| `STK3008` | Error    | A title, label, or detail violates its text constraints                   |
| `STK3009` | Error    | A group has no descendant node                                            |
| `STK3010` | Error    | Group nesting exceeds the language limit                                  |
| `STK3011` | Error    | A layout reference is invalid in its scope                                |
| `STK3012` | Error    | A layout block or singleton layout statement is duplicated                |
| `STK3013` | Error    | An icon identifier is malformed                                           |
| `STK3014` | Error    | A diagram contains more than one theme statement                          |
| `STK4001` | Warning  | An order hint could not be satisfied                                      |
| `STK4002` | Warning  | A node exceeds the recommended incident-edge degree                       |
| `STK4003` | Error    | A diagram exceeds a language complexity limit                             |
| `STK5001` | Warning  | An icon is unavailable in the effective theme; its kind fallback was used |
| `STK6001` | Warning  | A requested non-core theme is unavailable; `default` was used             |

Code families reserve `STK1000` for encoding and lexical errors, `STK2000` for syntax, `STK3000` for names and semantics, `STK4000` for layout and complexity, `STK5000` for icons, and `STK6000` for themes. `STK9000` is for implementation failures, never a source mistake. Implementations may add diagnostics only under their own non-`STK` prefix.

## Recovery rules

A parser may recover to report independent errors together, but it cannot render a partial diagram as valid. Unknown declarations, properties, enum values, and operators are never ignored. This avoids successful-looking output that silently lost authored meaning.
