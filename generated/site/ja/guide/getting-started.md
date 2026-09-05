# はじめる

最短の利用方法はbrowser [Playground](https://stack-diagram.com/)です。Formatter、validator、layout engine、SVG rendererがWebAssemblyとしてlocalで動作するため、commandのinstallやrendering APIへのsource送信は不要です。

## Native CLIをinstallする

Terminal workflowとlocal automationでは、owner管理のHomebrew formulaを`brew install stack-sh/tap/stack`でinstallします。CanonicalなStack CLI 0.4.0 release archiveを使用し、Homebrewの現行Tier 1要件を満たすApple Silicon macOSと、arm64 / x86_64のglibc Linuxをsupportします。UpgradeはHomebrewが`brew upgrade stack-sh/tap/stack`で管理し、formulaをuninstallしてもStackのconfigとicon storeは保持されます。正確なplatform matrix、direct install、recovery policyは[CLI distribution contract](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#homebrew-installation)を参照してください。

## 最初のdocumentを書く

Editorを次のexampleへ置き換えます。

```stack
stack 1.0

diagram "Checkout" {
  theme default

  node shopper "Shopper" {
    kind actor
  }

  group application "Application" {
    node web "Web app" {
      kind client
      detail "React"
    }

    node api "Checkout API" {
      kind service
      detail "Rust"
    }

    layout {
      direction right
      order [web, api]
    }
  }

  node orders "Orders" {
    kind database
    detail "PostgreSQL"
  }

  edge shopper -> web "HTTPS" {
    kind request
  }

  edge web -> api "JSON" {
    kind request
  }

  edge api -> orders "SQL" {
    kind data
  }

  layout {
    direction right
    order [shopper, application, orders]
  }
}
```

## Renderして確認する

**Run**を選ぶか、<kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>を押します。Previewにstandalone SVGが表示されます。Previewを選ぶと拡大でき、必要なら**Download SVG**で保存できます。

Sourceは4つの要素で構成されています。

1. `stack 1.0`がlanguage versionを宣言します。
2. `diagram`が1つのtitleとarchitecture全体を持ちます。
3. `node`と`group`がcomponentとboundaryを宣言します。
4. `edge`がrelationshipを、`layout`が制約された配置intentを記録します。

## CheckとFormat

**Check**はSVGを置き換えず、validationとlayout pipeline全体を実行します。**Format**はline commentと意味を保持しながら、syntaxがvalidなsourceをcanonicalな2-space形式へ書き換えます。

問題があると、severity、stable code、location、source frame、expected value、利用可能なcorrective helpが表示されます。Diagnosticを選ぶと該当source rangeへfocusします。

## 次に読むもの

- Lexical ruleと完全なgrammarは[Documentとsyntax](../language/syntax)を参照します。
- Componentとboundaryは[Nodeとgroup](../language/nodes-and-groups)を参照します。
- Relationshipと配置intentは[Edgeとlayout](../language/edges-and-layout)を参照します。
- Visual systemや明示iconを選ぶ前に[Themeとicon](../language/themes-and-icons)を参照します。
