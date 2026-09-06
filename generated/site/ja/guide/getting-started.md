# はじめる

導入方法を1つ選び、このページの手順で最初のSVGを作ります。ターミナルや[coding agent](./coding-agents)で使うならCLIを、インストールせず試すなら[Playground](https://stack-diagram.com/)と下のブラウザー向けの例を使ってください。

## CLIを導入する

Stack CLI 0.5.3はarm64 / x86_64のmacOSとglibc Linuxに対応します。配布バイナリーの要件はmacOS 13以降またはglibc 2.31以降です。WindowsとAlpine/muslは対象外です。`PATH`上で複数のバイナリーが競合しないよう、導入方法を1つ選んでください。正確な対応表は[配布契約](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#supported-platform-matrix)が正本です。

### Homebrew

Apple Silicon macOSまたは対応するLinuxで、導入済みのHomebrewを使います。Homebrew自身のTier 1要件も満たす必要があります。

```text
brew install stack-sh/tap/stack
```

### Cargo

Rust 1.85以降とネイティブリンカーが必要です。macOSではXcode Command Line Tools、LinuxではCコンパイラーとリンカーを用意し、Cargoのbinディレクトリを`PATH`へ追加してください。パッケージ名は`stack-diagram-cli`、コマンド名は`stack`です。

```text
cargo install stack-diagram-cli --version 0.5.3 --locked
```

### Aqua

Gitリポジトリのルート（`.git`があるディレクトリ）に、次の内容を`aqua.yaml`として保存します。新しいプロジェクトでは先に`git init`を実行してください。

```yaml
checksum:
  enabled: true
  require_checksum: true
  supported_envs:
    - all
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 42702cda91a4156901b9a601bd143c43dcf05766
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli@v0.5.3
    registry: stack-sh
```

次の限定的なポリシーを`aqua-policy.yaml`として保存し、内容を確認してから許可・インストールします。

```yaml
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 'Version == "42702cda91a4156901b9a601bd143c43dcf05766"'
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli
    registry: stack-sh
    version: semver(">= 0.3.0")
```

```text
aqua policy allow
aqua update-checksum
aqua install
```

`aqua.yaml`、`aqua-policy.yaml`、生成された`aqua-checksums.json`をcommitしてください。Aquaのbinディレクトリを`PATH`に追加します。レジストリは不変のrevisionに固定しており、`main`へ置き換えないでください。

### 直接ダウンロード

[GitHub CLI](https://cli.github.com/)を導入・認証済みの対応ホストで、POSIXシェルから実行します。新しい一時ディレクトリへ取得し、チェックサムとタグ付き公開元の認証を検証してから展開します。既存の`~/.local/bin/stack`は置き換えません。macOSの署名はad-hocで、公証はされていません。検証に失敗したら中断してください。

```text
(
  set -eu
  version=0.5.3
  case "$(uname -s)/$(uname -m)" in
    Darwin/arm64) target=aarch64-apple-darwin ;;
    Darwin/x86_64) target=x86_64-apple-darwin ;;
    Linux/aarch64) target=aarch64-unknown-linux-gnu ;;
    Linux/x86_64) target=x86_64-unknown-linux-gnu ;;
    *) echo "Unsupported platform" >&2; exit 1 ;;
  esac
  archive="stack-v${version}-${target}.tar.gz"
  download_dir=$(mktemp -d)
  cd "$download_dir"
  gh release download "v$version" --repo stack-sh/cli --pattern "$archive" --pattern "stack-v${version}-checksums.txt"
  awk -v archive="$archive" '$2 == archive { print }' "stack-v${version}-checksums.txt" > archive-checksum.txt
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum --check archive-checksum.txt
  else
    shasum -a 256 --check archive-checksum.txt
  fi
  gh attestation verify "$archive" --repo stack-sh/cli --signer-workflow stack-sh/cli/.github/workflows/release.yaml --source-ref "refs/tags/v$version" --deny-self-hosted-runners
  tar -xzf "$archive"
  mkdir -p "$HOME/.local/bin"
  test ! -e "$HOME/.local/bin/stack"
  install -m 0755 "stack-v${version}-${target}/stack" "$HOME/.local/bin/stack"
)
export PATH="$HOME/.local/bin:$PATH"
```

## 最初のSVGを作る

新しい空の作業ディレクトリで実行します。Aquaを使う場合は、`aqua.yaml`があるGitリポジトリの内側に作ってください。

```sh
$ stack --version
$ stack init
$ stack check diagram.stack
$ stack render diagram.stack -o diagram.svg
```

`stack 0.5.3`と表示され、`diagram.stack`が作成され、checkがエラーなく終了し、空でない`diagram.svg`ができれば成功です。SVGはブラウザーで開いたりREADMEに貼ったりできます。`stack init`は既存ファイルを保護するため、上書きせず新しいディレクトリを使ってください。

`diagram.stack`を自分の構成に書き換え、checkとrenderを繰り返します。整形が必要な場合は次を実行します。

```sh
$ stack fmt diagram.stack
$ stack fmt --check diagram.stack
```

## 導入状態を確認し、シェル連携を有効にする

プロジェクトやcoding agentのworkflowで継続利用する前に、次のread-onlyな2コマンドで導入状態を確認します。

```text
$ stack doctor
$ stack config path
```

`stack doctor`はCLI version、選択された設定パス、設定の状態、有効なicon storeのパス、導入済みの既知provider packを報告します。デフォルトの設定やicon storeが存在しない状態は正常です。明示したパスが不正または読み取れない場合は、修正方法を示してstatus `2`で終了します。`stack config path`は、設定を作成・読み込みせず、選択される`config.yaml`のパスを表示します。

Homebrewはbinaryと一致する補完・manual fileを自動で導入します。直接ダウンロード、Aqua、Cargoでは、同じ決定的なfileを利用するshellに合わせて生成できます。

```text
$ stack completions bash
$ stack completions zsh
$ stack completions fish
$ stack manpage
```

これらのコマンドは標準出力へ書き出すだけで、shellのstartup fileを変更しません。[シェル連携ガイド](https://github.com/stack-sh/cli/blob/main/docs/completions.md)に従い、利用者が所有する補完・manual用ディレクトリへ保存してください。インストールせずにoffline manualを読むこともできます。

```text
$ stack manpage > stack.1
$ man ./stack.1
```

## 最初のdocumentを書く

ブラウザで試す場合は[Playground](https://stack-diagram.com/)を開き、エディタを次の作例に置き換えます。CLIの場合は同じソースを`diagram.stack`として保存し、上の検証・描画コマンドを実行できます。

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

- **Coding agentと書く:** 任意の[Stackスキル](./coding-agents)を導入し、共通の検証・描画手順を使います。
- **作例から始める:** [実行時に描画される作例](../examples/)をPlaygroundで開き、[テーマとアイコン](../language/themes-and-icons)を試します。
- **自分の環境に合わせる:** [プロバイダーアイコンを取り込み](./provider-icons)、[CLI設定ガイド](https://github.com/stack-sh/cli/blob/main/docs/configuration.md)で保存先を選びます。この設定はCLI用です。ブラウザではローカルのパックを明示的に読み込みます。
- **詳しく調べる:** [言語リファレンス](../language/syntax)と[診断・制限](../reference/diagnostics-and-limits)を参照しながら、より大きなシステムを記述します。

## 更新・アンインストール

Stack自身は更新を行いません。導入に使ったツールで管理します。バイナリーを削除しても設定とimport済みicon packは残ります。

| 導入方法 | 更新 | アンインストール |
| --- | --- | --- |
| Homebrew | `brew upgrade stack-sh/tap/stack` | `brew uninstall stack-sh/tap/stack` |
| Cargo | 上のCargo導入コマンドで目的のversionを指定します。 | `cargo uninstall stack-diagram-cli` |
| Aqua | `aqua update`, `aqua update-checksum`, `aqua install` | この設定がある状態で`aqua rm -m pl stack-sh,stack-sh/cli`を実行し、`aqua.yaml`から`stack-sh/cli`を削除します。他のプロジェクトが必要とする場合は再インストールされます。 |
| 直接ダウンロード | 新しいreleaseを検証し、直接導入したバイナリーだけを差し替えます。 | 自分で導入したバイナリー（`~/.local/bin/stack`）だけを削除します。 |

更新時の復旧とartifactの検証は[安全な更新](https://github.com/stack-sh/cli/blob/main/docs/self-update.md)と[配布物の検証](https://github.com/stack-sh/cli/blob/main/docs/supply-chain.md)を参照してください。
