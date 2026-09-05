# Edgeとlayout

Edgeはnode間のrelationshipを表します。Layout blockは座標やdrawing primitiveを公開せず、少量の配置intentを表します。

## Edge direction

Edgeは異なる2 nodeを接続します。Forward referenceはvalidですが、self-edgeとgroup endpointはinvalidです。

| Operator | Meaning                                            |
| -------- | -------------------------------------------------- |
| `->`     | 左nodeから右nodeへのdirected relationship          |
| `<->`    | 両方向の1つのsymmetric relationship                |
| `--`     | Directionがない、または意図的に未指定のassociation |

`<->`は独立してlabel可能な2 edgeの省略形ではありません。

## Edge kindとlabel

任意labelはprotocol、event、command、dataset、purposeを表す1〜40 Unicode scalarです。任意`kind`はlabelとは独立してrelationshipを分類し、defaultは`flow`です。

| Kind         | Intended meaning                                    |
| ------------ | --------------------------------------------------- |
| `flow`       | Generic runtimeまたはconceptual flow                |
| `request`    | Synchronous requestまたはcall                       |
| `event`      | Asynchronous messageまたはevent delivery            |
| `data`       | Data movement、replication、read、write             |
| `dependency` | Build-time、deployment-time、operational dependency |

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

異なるrelationshipなら同じnode間に複数edgeを置けます。同じendpoint、operator、label、effective kindのexact duplicateはinvalidです。`<->`と`--`のduplicate比較ではendpoint orderを無視します。

## Layout scope

Diagramまたはgroupには1つの`layout` blockを置けます。Group blockはそのdirect childだけ、diagram blockはdiagramのdirect childだけに作用します。`rank`と`order`は同じscopeの異なるdirect childを最低2つ参照します。

Layoutではdirect child groupを1 itemとして扱います。Descendant node同士のconnectionは所属するdirect-child item間のconnectionになるため、groupをedge endpointにしなくてもtop-level layoutでgroupを配置できます。

## Direction、rank、order

```stack
layout {
  direction right
  rank same [web, worker]
  order [web, worker, database]
}
```

- `direction right`は左から右、`direction down`は上から下のprogressionを優先します。Strong hintであり、全edgeの幾何方向を保証しません。Nested groupへinheritしません。
- `rank same [a, b]`はlisted direct childを同じlayout rankに置くconstraintです。同じscopeで1 childを2つのsame-rank statementに置けません。
- `order [a, b]`はrelative-order hintです。Right scopeでは上から下、down scopeでは左から右、automatic layoutではchosen cross-axisに沿います。他childは省略できます。

Rendererはcontainment、same-rank constraint、legibility、output boundを守るため`order`から外れることがあります。その場合、diagnostic-capable toolは`STK4001`を出します。

## Rendererが所有する判断

Stackには座標、dimension、port、path、color、font、line break、z-indexがありません。Rendererはoverlapを防ぎ、containmentとdirectionを保ち、labelを読みやすくし、node interiorを避けてedgeをrouteし、semantic contentをclipせずcanvasを拡張します。
