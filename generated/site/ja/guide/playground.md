# Playgroundの使い方

Playgroundは[stack-diagram.com](https://stack-diagram.com/)で公開しているbrowser consumerです。Editorはnative text inputを維持し、shared TextMate grammarがsyntax colorを提供します。Validation、format、layout、SVGは常に公開Stack WebAssembly engineから生成されます。

## Action

| Action           | Result                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Format**       | Syntaxがvalidなsourceをcanonicalizeし、commentを保持します。Semantic errorは表示に残ります。 |
| **Check**        | 新しいSVGを作らず、compiler、theme、icon、layout、routingを確認します。                      |
| **Run**          | Pipeline全体を実行し、renderを妨げるerrorがなければSVGを更新します。                         |
| **Download SVG** | 現在のstandalone SVGを保存します。                                                           |

<kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>でも実行できます。Source変更時には古いrangeを現在の結果として見せないよう、stale diagnosticを消去します。

## Diagnosticの読み方

Error resultには次の情報が含まれます。

```text
error[STK2002] at 4:22
4 |   layout { direction hoo }
  |                      ^^^ unexpected layout direction 'hoo'
  = expected: right, down
  = help: use 'right' for horizontal flow or 'down' for vertical flow
```

Diagnosticやrelated informationを選ぶと対応sourceへfocusします。Errorはsuccessful renderを止めます。Warningはfallbackや可読性の懸念を表し、SVGと同時に返ることがあります。

## 独立した2つのcolor設定

Headerのcolor modeはPlaygroundとeditorの表示を変えます。`theme dark`のようなsource statementは生成diagramを変えます。Siteをdark modeへ切り替えてもdiagram themeを変更・解釈し直さないよう、両者は独立しています。

## Browser behaviorとdata

Playgroundは公開WebAssembly moduleをloadし、browser内で同期的な`format`、`check`、`render`を実行します。Engine自体はfile読込、network接続、DOM参照、clock観測、host font計測をしません。

現在はaccount、cloud persistence、collaboration、paid themeを提供していません。保持したいsourceやSVGはdownloadしてください。

## Accessibility

Editorはnativeのcaret、selection、clipboard、undo、keyboard、IME behaviorを保持します。Diagnosticからsource rangeへ移動でき、previewはtext alternativeを持つkeyboard-accessibleなdialogで開きます。320px layout、light/dark contrast、visible focus、reduced motionに対応します。
