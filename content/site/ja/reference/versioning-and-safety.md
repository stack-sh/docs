# Versioningと安全性

Draft Stack 1.0はsource language、implementation、theme catalog、package versionを分離します。この境界を理解するとdocumentをportableにし、rendered outputの由来を追跡できます。

## Language version

すべてのdocumentは`major.minor` directiveから始まります。

```stack
stack 1.0

diagram "Versioned source" {
  node api "API"
}
```

これはdocumentが必要とするminimum language grammar / semanticsで、engineやtheme versionではありません。`M.N`対応rendererは同じmajorでminorが`N`以下のdocumentをacceptし、異なるmajorや未対応のhigher minorをrejectします。Unknown future syntaxを推測しません。

Specification releaseはsemantic versioningを使います。Majorはincompatible language change、minorはbackwards-compatible capability追加、patchはvalid sourceの意味を変えないclarification / errataです。そのためdocument directiveにpatchはありません。

## Rendererとcatalog identity

通常のengine resultにはengine version、authored language version、theme catalog version、catalog content revisionが入ります。Sourceの`theme`はsymbolic identifierを選ぶだけで、package releaseをpinしたりremote dataを取得したりしません。

Exact pixel outputはlanguage compatibility promiseではありません。Theme metric、renderer version、font、canvas判断で位置が変わっても、node、group、relationship、label、kind、constraintは保持されます。

## 安全なsource boundary

Stack stringはplain textです。Sourceに実行code、任意HTML/Markdown、CSS、SVG、import、macro、file path、network URLは置けません。Engineはauthored textをescapeし、validated catalog icon、local marker reference、accessible title/description metadataを埋め込んだstandalone SVGを生成します。

Rendered SVGにはscript、event handler、任意external reference、host font measurement、runtime I/Oがありません。Missing icon/theme nameはpath解決やregistry接続ではなくbundled fallbackを選びます。

## 現在のdelivery status

- Browser Playgroundがsupport対象のpublic experienceです。
- Public `@stack-sh/engine`がPlaygroundで使うtyped WebAssembly `format`、`check`、`render`を提供します。
- Public `@stack-sh/language`がeditor highlight用のshared TextMate grammarと言語metadataを提供します。
- Public [`stack-sh/cli`](https://github.com/stack-sh/cli)がnative `format`、`check`、`render`、provider-icon store操作を提供します。

Normative language contractは[`stack-sh/specification`](https://github.com/stack-sh/specification)、public theme catalogは[`stack-sh/theme`](https://github.com/stack-sh/theme)、engine behaviorは[`stack-sh/engine`](https://github.com/stack-sh/engine)が正本です。
