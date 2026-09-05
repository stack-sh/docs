# Themeとicon

Themeはdiagram-levelでrendererが管理するvisual systemへのsymbolic referenceです。Iconはそのtheme内で解決するlogical nameです。どちらもdiagramの意味を変更しません。

## Themeを選ぶ

Diagram直下に最大1つの`theme` statementを置きます。

```stack
stack 1.0

diagram "Dark architecture" {
  theme dark

  node api "API"
}
```

省略時は`default`です。Draft Stack 1.0はcore catalogに次のthemeを要求します。

| Theme     | Intended use                                                 |
| --------- | ------------------------------------------------------------ |
| `default` | 一般的なarchitecture diagram向けのbalanced blue-gray surface |
| `light`   | Light document向けのwarm neutral surface                     |
| `dark`    | Dark canvas向けのhigh-contrast cool surface                  |

Sourceはidentifierを選ぶだけで、catalog package versionを選びません。Render metadataがcatalog versionとcontent revisionを記録します。

生成diagramのthemeとPlayground UIのlight/darkは独立しています。Themeはpalette、typography metric、surface、icon、connector、backgroundを変えられますが、node、group、edge、label、kind、direction、layout constraintを隠したり変更したりできません。

## Fallback behavior

3つのcore themeはrenderer必須resourceです。利用中catalogにないnon-core themeはwarning `STK6001`を出し、`default`でrenderします。Sourceにidentifierがあってもnetworkからthemeを取得しません。

Theme identifierは通常のStack identifier syntaxを使います。一度登録されたidentifierを、deprecation後も別themeへ再利用できません。

## Kind fallback icon

各themeは全node kindにfallbackを持ちます。`icon`を省略するとrendererがこれを使います。

| Node kind  | Current logical fallback icon |
| ---------- | ----------------------------- |
| `actor`    | `kind-actor`                  |
| `client`   | `kind-client`                 |
| `service`  | `kind-service`                |
| `function` | `kind-function`               |
| `worker`   | `kind-worker`                 |
| `database` | `kind-database`               |
| `cache`    | `kind-cache`                  |
| `queue`    | `kind-queue`                  |
| `storage`  | `kind-storage`                |
| `external` | `kind-external`               |

現在のopen core catalogは`default`、`light`、`dark`にこの10 fallback identifierを持ちます。`postgresql`、`aws`、`github`などのvendor iconはまだありません。通常はsemanticな`kind`を選び、`icon`を省略してください。

## 明示icon

明示iconはquoted logical identifierです。

```stack
stack 1.0

diagram "Explicit icon" {
  node gateway "Public API" {
    kind service
    icon "api"
  }
}
```

Iconはnodeを装飾するだけで、`service` kind、identity、label、accessible descriptionを変えません。Themeごとに色やartworkを調整できますが、同じidentifierは同じlogical subjectを表します。

## First-party icon catalog

Free core catalogは、次のprovider-neutralな明示iconを`default`、`light`、`dark`に収録しています。

| ID              | Stable subject                    | 主な用途                         |
| --------------- | --------------------------------- | -------------------------------- |
| `api`           | Application programming interface | Public / internal API            |
| `web`           | Web application                   | Browser向けWeb experience        |
| `mobile`        | Mobile application                | iOS / Android client             |
| `desktop`       | Desktop application               | Native desktop client            |
| `server`        | Server host                       | Virtual machine / physical host  |
| `container`     | Application container             | Containerized workload           |
| `cluster`       | Compute cluster                   | Orchestrated compute group       |
| `cloud`         | Cloud environment                 | Provider-neutralなcloud boundary |
| `scheduler`     | Scheduled execution               | Cron job / scheduled work        |
| `webhook`       | Webhook endpoint                  | Inbound / outbound callback      |
| `identity`      | Identity and access               | Authentication / authorization   |
| `observability` | Observability system              | Metrics / logs / traces          |
| `gateway`       | Network gateway                   | Public / private networkの入口   |
| `load-balancer` | Load balancer                     | Trafficの分散                    |
| `dns`           | Domain name service               | Hostname / service discovery     |
| `cdn`           | Content delivery network          | Edgeでのcontent delivery         |
| `firewall`      | Network firewall                  | Network access boundary          |
| `network`       | Network topology                  | 一般的なnetwork / subnet         |
| `event`         | Discrete event                    | 個別のdomain / system event      |
| `stream`        | Event stream                      | 継続的なevent / data flow        |
| `search`        | Search service                    | Indexing / query system          |
| `analytics`     | Analytics system                  | Reporting / data analysis        |
| `repository`    | Source code repository            | Source code / version control    |
| `pipeline`      | Delivery pipeline                 | Build / test / deploy flow       |
| `secret`        | Secret or credential              | Secret / key / credential        |
| `document`      | Document or knowledge base        | Documentation / knowledge        |
| `task`          | Task or issue tracker             | Task / ticket / issue tracking   |
| `chat`          | Chat or messaging tool            | Team chat / messaging            |
| `email`         | Email delivery                    | Email delivery / inbox           |
| `ai`            | Artificial intelligence system    | AI model / inference service     |

下のpreviewをlight / darkへ切り替えると、実際のoutputを比較できます。各imageは公開`@stack-sh/engine@0.7.0`がlocalでrenderし、DocumentationにTheme SVG assetを複製していません。Syntaxの行を選ぶとコピーできます。

<IconCatalog locale="ja" />

Semanticな`kind`と明示iconは独立して選びます。たとえば`icon "web"`は`client`にも`service`にも使えますが、そのnodeの意味は変更しません。

## 未収録iconとvendor icon

Core catalogは現在、`postgresql`、`aws`、`github`、`docker`などのvendor / project markを収録していません。Effective themeにauthored icon identifierがなければ、node kindのfallbackでrenderを続け、warning `STK5001`を出します。

上表のprovider-neutral iconを選ぶか、kind fallbackだけで役割が伝わる場合は`icon`を省略してください。Vendor markを別catalogへ収録するには、asset単位のlicense、redistribution、trademark reviewが必要です。

## Catalogとasset safety

Public `stack-sh/theme` catalogがpalette、deterministic font metric、node-kind visual、connector、icon metadata、SVG byte、provenance、redistribution permissionを所有します。Catalog assetはrendererへbundleし、authored identifierをfile pathやURLとして扱いません。

SVG validationはscript、event handler、nested SVG、unsafe reference、data/network URL、style attribute、allowlist外のelement/attributeを拒否します。Iconだけを意味の唯一の手掛かりにせず、labelとnon-color distinctionも維持します。
