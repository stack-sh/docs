# Provider icon

Stackにはprovider-neutralなcore icon catalogが含まれます。AWS、Google Cloud、Azure、主要な開発・collaboration toolのartworkは、user-managed icon storeに保存するprovider packとして利用できます。

## 利用可能なprovider catalog

監査済みcatalogには合計1,051 IDがあります。AWS Architecture Icons 305件、Google Cloudのproduct・category icon 45件、Azure service icon 639件、主要tool icon 62件です。Tool catalogにはGitHub、GitHub Actions、Notion、Linear、Atlassian、Jira、Confluence、Docker、Kubernetes、Terraform、Datadog、Grafana、Sentryなどが含まれます。

Provider cardを選ぶとimport commandを確認できます。全catalogを検索・filterでき、小さいdeviceでも見やすいよう100件ずつ表示します。

<ProviderCatalog locale="ja" />

Provider packが追加するのはartworkです。Semantic stylingとlayoutはStack sourceに書いたnode `kind`が引き続き決めます。

## Quick start

Diagramで使うproviderを一度ずつimportします。`--accept-terms`は、link先のprovider・brand termsを確認して同意したことを記録します。

```sh
$ stack icons import gcp --accept-terms
$ stack icons import simple-icons --accept-terms
$ stack render architecture.stack -o architecture.svg
```

CLIは監査済みの公式archiveをdownloadし、archive全体のSHA-256を検証し、選択したSVGをsanitizeして、処理済みprovider packをshared icon storeへ保存します。Google Cloudのproduct・category artworkは1つの`gcp` commandで一緒にimportされます。

## CLIでprovider iconを使う

1つのStack fileで複数providerを利用できます。次の例はGoogle CloudのCloud RunとSimple IconsのGitHubを組み合わせます。

```stack
stack 1.0

diagram "Deploy from GitHub to Cloud Run" {
  node repository "GitHub" {
    kind external
    icon "simple-icons:github"
  }

  node service "Cloud Run" {
    kind service
    icon "gcp:cloud-run"
  }

  edge repository -> service "Deploy" {
    kind dependency
  }
}
```

2つをimportした後は、通常のrender commandが両方のpackを見つけます。

```sh
$ stack render architecture.stack -o architecture.svg --notice architecture.NOTICE.md
```

## Shared icon store

Default icon storeは`$XDG_CONFIG_HOME/stack/icons`です。`XDG_CONFIG_HOME`が未設定の場合は`$HOME/.config/stack/icons`を使います。

```text
icons/
  aws/
  gcp/
  azure/
  simple-icons/
```

`$XDG_CONFIG_HOME/stack/config.yaml`にabsolute pathを書くと、shared locationを変更できます。

```yaml
default_icons_path: /absolute/path/to/stack-icons
```

このlocationは`stack icons import`と`stack render`の両方で使われます。

## Playgroundでprovider iconを使う

**Icons**を開いて`stack/icons` folderを選ぶと、Playgroundがstore内の認識可能なprovider directoryをすべてloadします。Loadしたartworkを検索し、選択するとIDをStack sourceへcopyできます。

選択したpackは現在のbrowser tabで処理されます。生成diagramにprovider artworkが含まれる場合は、SVG download横の**Notice**からsource、terms、使用iconの記録を取得できます。

## Iconをprojectと一緒に管理する

Import済みpackをrepositoryへ含める場合は、`-o`でproject directoryを指定します。

```sh
$ stack icons import gcp --accept-terms -o .stack-icons
$ stack icons import simple-icons --accept-terms -o .stack-icons
```

Render時は`--provider-pack`へ同じicon-store rootを渡します。

```sh
$ stack render architecture.stack \
  --provider-pack .stack-icons \
  -o architecture.svg \
  --notice architecture.NOTICE.md
```

## Icon IDを探す

CLIまたはこのpageでcatalogを検索できます。

```sh
$ stack icons list
$ stack icons list aws s3
$ stack icons list azure database
$ stack icons list simple-icons github
```

CLI outputには`ID`、`PRODUCT`、`CATEGORY`、推奨`KIND`が含まれます。`gcp:cloud-run`や`simple-icons:github`のようなnamespaced IDが対応するpackのartworkを選択します。

## 検証・terms・notice

CLI catalogは公式HTTPS archive URL、release、archive全体のSHA-256、allowlist済みentry path、terms URL、review dateをpinしています。Importではarchive・SVGのsizeを制限し、active・external SVG contentをsanitizeして、packをatomicに保存します。

各packには`NOTICE.md`が含まれます。`stack render --notice <PATH>`は、実際のpack revision、source release、terms URL、attribution、non-endorsement text、使用icon IDを出力します。Catalogから各providerの公式sourceとterms、Simple Iconsのbrand sourceとguidelineを確認できます。
