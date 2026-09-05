# Stackとは

Stackは、software architectureとtechnology stackの静的なdiagramを記述するための小さなdeclarative languageです。UTF-8の`.stack` fileにcomponent、boundary、relationshipを書き、座標、余白、route、typography、visual treatmentはrendererが決めます。

この分離により、sourceは簡潔でreviewしやすく、version controlにも適します。同じdocumentを、drawing instructionへ変えずにformat・check・renderできます。

## 基本モデル

各documentにはlanguage versionとちょうど1つのdiagramがあります。Diagramにはnode、任意のgroup・edge・theme・layout intentを記述します。

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

このsourceはclientがserviceを呼ぶことを表します。Boxの位置やarrowの曲がり方は指定しません。

## Stackが重視すること

- **簡潔なauthoring:** 名前付きnodeとedgeだけで有用なdiagramを書けます。
- **予測可能な生成:** 人とlanguage modelが同じconceptを安定して記述できます。
- **Semantic source:** Pixelではなくtopologyとintentを記録します。
- **整ったoutput:** 一貫したvisual systemをrendererが所有します。
- **修正可能なerror:** Diagnosticはsource range、expected value、help、related declarationを示せます。
- **安全な埋め込み:** Sourceはcode実行、任意asset取得、HTML/SVG注入ができません。

## Stackではないもの

Stack 1.0はgeneral graph language、pixel-perfect canvas、infrastructure definition、実行可能なprogramming languageではありません。Variable、import、macro、condition、CSS、座標、任意URL、埋め込みHTMLはありません。Sequence、state machine、class、ER、完全なUML notationも対象外です。

大規模systemは1枚に詰めず、複数の焦点を絞ったdiagramに分けます。Stackには可読性を守るための上限があります。

## Processing model

Toolはdecode / parse、identifierとdefaultの解決、semantic validation、theme / icon解決、layout、renderの順に処理します。Source errorはrenderを停止します。Optional theme / iconの欠落や満たせないlayout hintはwarningとなり、fallback diagramを返せます。

Author向けの全constructは[言語ページ](../language/syntax)、互換性とtrust boundaryは[Versioningと安全性](../reference/versioning-and-safety)で説明します。
