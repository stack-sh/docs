# Edges and layout

Edges describe relationships between nodes. Layout blocks express a small amount of placement intent without exposing coordinates or drawing primitives.

## Edge direction

An edge connects two distinct nodes. Forward references are valid, while self-edges and group endpoints are invalid.

| Operator | Meaning                                                        |
| -------- | -------------------------------------------------------------- |
| `->`     | Directed relationship from the left node to the right node     |
| `<->`    | One symmetric relationship in both directions                  |
| `--`     | Association with absent or intentionally unspecified direction |

`<->` is one relationship, not shorthand for two independently labeled edges.

## Edge kinds and labels

An optional label names a protocol, event, command, dataset, or purpose and contains 1 to 40 Unicode scalar values. An optional `kind` describes the relationship independently of that label. The default is `flow`.

| Kind         | Intended meaning                                       |
| ------------ | ------------------------------------------------------ |
| `flow`       | Generic runtime or conceptual flow                     |
| `request`    | Synchronous request or call                            |
| `event`      | Asynchronous message or event delivery                 |
| `data`       | Data movement, replication, reads, or writes           |
| `dependency` | Build-time, deployment-time, or operational dependency |

```stack
stack 1.0

diagram "Relationships" {
  node web "Web app" {
    kind client
  }

  node api "API"
  node queue "Events" {
    kind queue
  }

  edge web -> api "HTTPS" {
    kind request
  }

  edge api -> queue "OrderPlaced" {
    kind event
  }
}
```

Multiple edges between the same nodes are valid when they express distinct relationships. An exact duplicate with the same endpoints, operator, label, and effective kind is invalid. Endpoint order is ignored when comparing `<->` and `--` duplicates.

## Layout scope

A diagram or group may contain one `layout` block. A group block affects only its direct child nodes and groups. A diagram block affects only direct children of the diagram. `rank` and `order` references must name at least two distinct direct children in that scope.

For layout, a direct child group acts as one item. Connections between descendant nodes induce connections between their containing direct-child items, so a top-level layout can arrange groups even though groups are not edge endpoints.

## Direction, rank, and order

```stack
layout {
  direction right
  rank same [web, worker]
  order [web, worker, database]
}
```

- `direction right` prefers left-to-right progression; `direction down` prefers top-to-bottom progression. It is a strong hint, not a promise that every edge points geometrically that way. Nested groups do not inherit it.
- `rank same [a, b]` is a constraint: listed direct children must share a layout rank. A child cannot appear in two same-rank statements in one scope.
- `order [a, b]` is a relative-order hint. It is top-to-bottom for a right-directed scope, left-to-right for a down-directed scope, and follows the chosen cross-axis in automatic layout. Other children may be omitted.

The renderer may depart from `order` to preserve containment, same-rank constraints, legibility, or output bounds. Diagnostic-capable tools should emit `STK4001` when an authored order cannot be satisfied.

## Renderer-owned decisions

Stack exposes no coordinates, dimensions, ports, paths, colors, fonts, line breaks, or z-index. The renderer prevents overlaps, preserves containment and direction, keeps labels legible, routes edges outside node interiors, and expands the canvas rather than clipping semantic content.
