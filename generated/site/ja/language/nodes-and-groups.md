# Nodeとgroup

Nodeは参照可能なarchitectural entity、groupはlabel付きcontainment boundaryです。この2つでdiagram内のcomponentとscopeを記述します。

## Node

Nodeにはglobally uniqueなidentifierとvisible labelが必要です。Identifierはedgeとlayoutから参照しますがrenderされません。Labelは1〜60 Unicode scalarです。

```stack
stack 1.0

diagram "Node example" {
  node api "Public API" {
    kind service
    detail "Order orchestration"
  }
}
```

別entityなら同じvisible labelを持てますが、位置に頼らず理解できるlabelを推奨します。Node blockでは`kind`、`icon`、`detail`を重複できません。

## Node kind

`kind`は粗いarchitectural meaningを表し、themeが管理するshapeとfallback iconを選びます。Defaultは`service`です。

| Kind       | Intended meaning                                  |
| ---------- | ------------------------------------------------- |
| `actor`    | Person、role、team、autonomous participant        |
| `client`   | Browser、mobile/desktop app、deviceなどのclient   |
| `service`  | Long-running app、API、gateway、general component |
| `function` | On-demandまたはserverless compute unit            |
| `worker`   | Background processorまたはscheduled job           |
| `database` | Durableでquery可能なdatastore                     |
| `cache`    | 内容を破棄・再生成できるdatastore                 |
| `queue`    | Async delivery用queue、stream、bus、broker        |
| `storage`  | Blob、object、file、archive storage               |
| `external` | Architectureのcontrol boundary外のsystem          |

Kindはvendor shapeではなくsemantic categoryです。Hosted PostgreSQLも`database`で、technology名は`detail`に書きます。

## Labelとdetail

`detail`は任意のvisibleな2行目で、1〜80 Unicode scalarです。`"Next.js"`、`"PostgreSQL 17"`、`"Order orchestration"`のように1 technologyまたは短いresponsibilityを書きます。すべてのrenderで表示され、tooltipだけにはなりません。

Labelとdetailはplain textです。明示`icon`はnodeを装飾しますが、kind、identity、accessible labelを変えません。[Themeとicon](./themes-and-icons)も参照してください。

## Group

Groupにはglobally uniqueなidentifier、1〜60 Unicode scalarのlabel、最低1つのdescendant nodeが必要です。Node、nested group、1つのlayout blockを含められます。

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

Nestingはdiagram下3 levelまでです。Nodeは最も近いgroupと全ancestor groupに属します。Declarationは再利用できないため、2つの別groupには所属できません。

Edgeは必ずdiagram scopeで宣言し、endpointにはnodeだけを使えます。Groupはimplicit nodeやrelationshipを作りません。Labelでsystem、domain、network、deployment area、teamなどの意味を示します。Containmentだけでruntime isolation、security、ownership、deployment semanticsを意味しません。
