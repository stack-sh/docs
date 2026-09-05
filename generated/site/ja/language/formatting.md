# Canonical formatting

Stackはlexically / syntactically validな各documentに、1つのcanonical byte representationを定義します。Formattingはlanguage version、semantic meaning、line commentを変えず、diffを一定にします。

## Formatできるsource

FormatterはBOMなしUTF-8を受け取ります。Lexical/syntax error時はdiagnosticだけを返し、partial formatted sourceを返しません。Syntaxがvalidならsemantic/complexity diagnosticがあってもformatできます。Format成功はdiagramのvalidityを意味しません。

## Canonical output

Canonical sourceは次の規則に従います。

- BOMなしUTF-8を使う。
- 全line endingをLFへ正規化する。
- Block levelごとにASCII space 2つを使い、formatting tabを使わない。
- Line末尾のformatting whitespaceを置かない。
- 最後はちょうど1 LFにする。
- Opening braceはdeclarationまたは`layout`行、closing braceは単独行に置く。
- Versionとdiagram、bodyの隣接member間に1 empty lineを置く。
- Propertyとlayout statement間にはempty lineを置かない。

```stack
stack 1.0

diagram "Title" {
  theme dark

  node client "Client"

  node api "API" {
    kind service
    detail "Public API"
  }

  edge client -> api "HTTPS" {
    kind request
  }

  layout {
    direction right
    order [client, api]
  }
}
```

## Orderとlist

Formatterはdiagram/group member、node/edge property、layout statement、list identifierのauthored orderを保持します。Group化やsortはしません。Listは1行でcomma後に1 space、bracket内側にspaceなし、trailing commaなしです。

## String

Valid stringをdecodeし、Unicode normalizationせずUTF-8で直接出力します。Quoteとbackslashはescapeし、canonical outputは`\uXXXX`を使いません。たとえば`"API \u56F3 \uD83D\uDE80"`は`"API 図 🚀"`になります。

## Comment

すべてのline commentと順序を保持します。Trailing commentは直前tokenの後へ1 spaceで続きます。Own-line commentはtoken gapを保ち、後続member、statement、propertyの直前に置きます。Construct内commentはcontinuation lineを強制でき、通常のone-line ruleに対する唯一の例外です。

Canonical sourceを再formatした結果はbyte-identicalでなければなりません。Normalized IRがある場合、format前後でsemantically equalなIRを生成します。
