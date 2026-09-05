# Nodes and groups

Nodes are addressable architectural entities. Groups are labeled containment boundaries. Together they describe the components and scopes visible in a diagram.

## Nodes

A node requires a globally unique identifier and a visible label. The identifier is used by edges and layout statements but is never rendered. A label contains 1 to 60 Unicode scalar values.

```stack
stack 1.0

diagram "Node example" {
  node api "Public API" {
    kind service
    detail "Order orchestration"
  }
}
```

Two nodes may share a visible label when they are distinct entities, though labels should remain understandable without relying on position. A node block cannot repeat `kind`, `icon`, or `detail`.

## Node kinds

`kind` provides coarse architectural meaning. It also selects a theme-controlled shape and fallback icon. The default is `service`.

| Kind       | Intended meaning                                             |
| ---------- | ------------------------------------------------------------ |
| `actor`    | Person, role, team, or autonomous participant                |
| `client`   | Browser, mobile app, desktop app, device, or other client    |
| `service`  | Long-running application, API, gateway, or general component |
| `function` | On-demand or serverless compute unit                         |
| `worker`   | Background processor or scheduled job                        |
| `database` | Durable, queryable datastore                                 |
| `cache`    | Datastore whose contents are disposable or derived           |
| `queue`    | Queue, stream, bus, or broker for asynchronous delivery      |
| `storage`  | Blob, object, file, or archival storage                      |
| `external` | System outside the architecture's control boundary           |

Kinds are semantic categories, not vendor shapes. A hosted PostgreSQL instance is still a `database`; name the technology in `detail`.

## Labels and details

`detail` is an optional visible second line of 1 to 80 Unicode scalar values. Use it for one technology or a short responsibility, such as `"Next.js"`, `"PostgreSQL 17"`, or `"Order orchestration"`. It remains visible in every rendered diagram and is never reduced to tooltip-only content.

Labels and details are plain text, not Markdown or HTML. An explicit `icon` decorates the node but does not change its kind, identity, or accessible label. See [Themes and icons](./themes-and-icons).

## Groups

A group has a globally unique identifier, a label of 1 to 60 Unicode scalar values, and at least one descendant node. It may contain nodes, nested groups, and one layout block.

```stack
stack 1.0

diagram "Boundaries" {
  group platform "Platform" {
    group data "Data layer" {
      node primary "Primary database" {
        kind database
      }
    }
  }
}
```

Group nesting can reach three levels below the diagram. A node belongs to its nearest group and all ancestor groups. Because declarations cannot be reused, a node cannot belong to two separate groups.

Edges are always declared at diagram scope, and only nodes can be edge endpoints. A group does not create an implicit node or relationship. Its label explains whether the boundary represents a system, domain, network, deployment area, team, or another concern; containment alone does not imply runtime isolation, security, ownership, or deployment semantics.
