# Diagnosticとlimit

Stack diagnosticはconsole proseではなくstructured resultです。Stable code、`error`/`warning` severity、1-based end-exclusive source range、簡潔なmessage、ordered `expected` listを持ちます。必要に応じてcorrective helpとrelated source rangeも含みます。

## Processingとseverity

Toolはencoding/token、grammar、identifier/default、semantic limit、theme/icon、layout、renderの順で処理します。最初の4 stageのerrorはrenderを止めます。Theme、icon、density、layout-hint warningはfallback SVGと同時に返せます。

Playgroundはsource編集後にstale diagnosticを消します。Resultを選ぶとprimary sourceへfocusし、related informationから以前のdeclarationへ移動できます。

## Complexity limit

| Item                     |            Draft Stack 1.0 limit |
| ------------------------ | -------------------------------: |
| Documentあたりのdiagram  |                                1 |
| Node                     |                            1〜40 |
| Group                    |                            0〜12 |
| Diagram下のgroup nesting |                          3 level |
| Edge                     | 0〜80またはnode数の2倍の小さい方 |
| Warning前のnode degree   |     12 incident edge declaration |

Hard limit超過は`STK4003`です。推奨degreeを超えたnodeはvalidのまま`STK4002`を出します。大規模systemは1つへ圧縮せず、焦点を絞ったdiagramへ分けてください。

## Portable diagnostic code

| Code      | Severity | Meaning                                                  |
| --------- | -------- | -------------------------------------------------------- |
| `STK1001` | Error    | Inputがvalid UTF-8ではない                               |
| `STK1002` | Error    | Byte order markがある                                    |
| `STK1003` | Error    | String escapeまたはdecode valueがinvalid                 |
| `STK2001` | Error    | 宣言language versionがunsupported                        |
| `STK2002` | Error    | Unexpected token、declaration、property、value、operator |
| `STK2003` | Error    | Construct完了前にinputが終了した                         |
| `STK3001` | Error    | Identifierがinvalid                                      |
| `STK3002` | Error    | Identifierが重複宣言された                               |
| `STK3003` | Error    | Edgeがunknown nodeを参照した                             |
| `STK3004` | Error    | Groupをedge endpointに使った                             |
| `STK3005` | Error    | Edgeが同じnodeを接続した                                 |
| `STK3006` | Error    | Exact duplicate edgeを宣言した                           |
| `STK3007` | Error    | 1 block内でpropertyが重複した                            |
| `STK3008` | Error    | Title、label、detailがtext constraint違反                |
| `STK3009` | Error    | Groupにdescendant nodeがない                             |
| `STK3010` | Error    | Group nestingがlimit超過                                 |
| `STK3011` | Error    | Layout referenceがscope内でinvalid                       |
| `STK3012` | Error    | Layout blockまたはsingleton statementが重複した          |
| `STK3013` | Error    | Icon identifierがmalformed                               |
| `STK3014` | Error    | Diagramに複数theme statementがある                       |
| `STK4001` | Warning  | Order hintを満たせなかった                               |
| `STK4002` | Warning  | Nodeが推奨incident-edge degreeを超えた                   |
| `STK4003` | Error    | Diagramがlanguage complexity limit超過                   |
| `STK5001` | Warning  | Effective themeにiconがなくkind fallbackを使用した       |
| `STK6001` | Warning  | Requested non-core themeがなく`default`を使用した        |

Code familyは`STK1000`がencoding/lexical、`STK2000`がsyntax、`STK3000`がname/semantic、`STK4000`がlayout/complexity、`STK5000`がicon、`STK6000`がthemeです。`STK9000`はsource mistakeではなくimplementation failure用です。Implementation固有diagnosticはnon-`STK` prefixだけを使えます。

## Recovery rule

Parserは複数のindependent errorを報告するためrecoverできますが、partial diagramをvalidとしてrenderできません。Unknown declaration、property、enum value、operatorは無視されません。Authorの意味を失った成功風outputを防ぎます。
