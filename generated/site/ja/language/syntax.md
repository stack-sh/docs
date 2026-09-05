# Documentとsyntax

Stack sourceは意図的に小さく設計されています。このページではdraft Stack 1.0のlexical structureとgrammarをすべて説明します。

## Document構造

DocumentはBOMなしUTF-8の`.stack` fileです。LFとCRLFは同じ意味です。最初のnon-comment tokenはversion directiveで、その後にちょうど1つのdiagramが続き、後続declarationは置けません。

```stack
// One file, one diagram.
stack 1.0

diagram "Example" {
  node api "API"
}
```

Diagram titleは必須で1〜80 Unicode scalar、先頭・末尾にUnicode whitespaceは置けません。Diagramには最低1 nodeが必要です。

## Commentとwhitespace

Space、tab、line endingはtokenを分離しますが、それ以外の意味を持ちません。Line commentは`//`からline endingまでで、whitespaceを置ける場所に記述できます。Block commentはありません。

Formatting自体はsemanticではありませんが、canonical formatterは[Canonical formatting](./formatting)の一定形式を生成します。

## Identifier

Node、group、theme、reference identifierは次に一致します。

```text
[a-z][a-z0-9_-]*
```

1〜64 ASCII文字でcase-sensitive、画面には表示されません。Nodeとgroupは1つのglobal namespaceを共有します。Keywordはcontextualなのでidentifier位置にも置けますが、読みにくい名前は避けてください。

Icon identifierはquoted stringで、decode後が`[a-z0-9][a-z0-9-]*`に一致する1〜64 ASCII文字です。Effective theme内で解決されます。

## String

Stringはdouble quoteで囲み、Unicodeを直接書けます。Escapeは3種類だけです。

| Escape   | Meaning           |
| -------- | ----------------- |
| `\"`     | Double quote      |
| `\\`     | Backslash         |
| `\uXXXX` | Unicode code unit |

Decode後のstringにline break、tab、control character、unpaired surrogateは置けません。Title、label、detailの先頭・末尾にUnicode whitespaceは置けません。Stringはplain textであり、MarkdownやHTMLとして解釈されません。

## 完全なgrammar

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

## Contextual keyword

Stack 1.0はgrammar上の位置で次のwordを認識します。

```text
stack diagram group node edge theme layout kind icon detail direction
rank same order right down actor client service function worker
database cache queue storage external flow request event data dependency
```

Unknown declaration、property、enum value、operatorはerrorです。見た目だけ成功してauthorの意味を失わないよう、toolはunknown syntaxを黙って無視しません。
