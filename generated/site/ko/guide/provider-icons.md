# 클라우드 제공자 아이콘

Stack에는 제공자 중립적인 core icon catalog가 포함됩니다. AWS, Google Cloud, Azure 및 주요 개발·협업 도구 그림은 사용자가 관리하는 icon store에 저장된 provider pack으로 사용할 수 있습니다.

## 사용 가능한 제공자 catalog

감사 완료 catalog에는 총 1,051개 ID가 있습니다. AWS Architecture Icons 305개, Google Cloud 제품·category icon 45개, Azure service icon 639개, 주요 tool icon 62개입니다. Tool catalog에는 GitHub, GitHub Actions, Notion, Linear, Atlassian, Jira, Confluence, Docker, Kubernetes, Terraform, Datadog, Grafana, Sentry 등이 포함됩니다.

Provider 카드를 선택하면 import 명령을 확인할 수 있습니다. 전체 catalog를 검색·filter할 수 있으며 작은 화면에서도 안정적으로 보이도록 100개씩 표시합니다.

<ProviderCatalog locale="ko" />

Provider pack은 그림을 제공합니다. Stack source의 node `kind`가 계속 의미적 스타일과 레이아웃을 결정합니다.

## 빠른 시작

다이어그램에서 사용하는 각 provider를 한 번씩 import합니다. `--accept-terms`는 연결된 provider 및 brand terms를 검토하고 동의했음을 기록합니다.

```sh
$ stack icons import gcp --accept-terms
$ stack icons import simple-icons --accept-terms
$ stack render architecture.stack -o architecture.svg
```

CLI는 감사 완료 공식 archive를 다운로드하고 전체 SHA-256을 검증하며 선택한 SVG를 sanitize한 뒤 처리된 provider pack을 shared icon store에 기록합니다. Google Cloud 제품과 category 그림은 하나의 `gcp` 명령으로 함께 import됩니다.

## CLI에서 provider icon 사용하기

하나의 Stack 파일에서 여러 provider를 사용할 수 있습니다. 다음 예제는 Google Cloud의 Cloud Run과 Simple Icons의 GitHub를 함께 사용합니다.

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

두 pack을 import한 뒤 표준 render 명령이 모두 찾습니다.

```sh
$ stack render architecture.stack -o architecture.svg --notice architecture.NOTICE.md
```

## Shared icon store

기본 icon store는 `$XDG_CONFIG_HOME/stack/icons`입니다. `XDG_CONFIG_HOME`이 설정되지 않았으면 `$HOME/.config/stack/icons`를 사용합니다.

```text
icons/
  aws/
  gcp/
  azure/
  simple-icons/
```

`$XDG_CONFIG_HOME/stack/config.yaml`에서 절대 경로를 설정해 shared 위치를 변경할 수 있습니다.

```yaml
default_icons_path: /absolute/path/to/stack-icons
```

이 위치는 `stack icons import`와 `stack render`에서 함께 사용됩니다.

## Playground에서 provider icon 사용하기

**Icons**를 열고 `stack/icons` 폴더를 선택하면 Playground가 store 안의 인식 가능한 provider directory를 모두 불러옵니다. 불러온 그림을 검색하고 항목을 선택해 ID를 Stack source로 복사할 수 있습니다.

선택한 pack은 현재 브라우저 탭에서 처리됩니다. 생성한 다이어그램에 provider 그림이 있으면 SVG 다운로드 옆의 **Notice**에서 source, terms 및 사용 icon 기록을 확인할 수 있습니다.

## Icon을 프로젝트와 함께 관리하기

`-o`를 사용해 import한 pack을 repository와 함께 commit할 project directory에 둡니다.

```sh
$ stack icons import gcp --accept-terms -o .stack-icons
$ stack icons import simple-icons --accept-terms -o .stack-icons
```

Render할 때 같은 icon-store root를 `--provider-pack`으로 전달합니다.

```sh
$ stack render architecture.stack \
  --provider-pack .stack-icons \
  -o architecture.svg \
  --notice architecture.NOTICE.md
```

## Icon ID 찾기

CLI 또는 이 페이지에서 catalog를 검색할 수 있습니다.

```sh
$ stack icons list
$ stack icons list aws s3
$ stack icons list azure database
$ stack icons list simple-icons github
```

CLI 출력에는 `ID`, `PRODUCT`, `CATEGORY`, 권장 `KIND`가 포함됩니다. `gcp:cloud-run`, `simple-icons:github` 같은 namespaced ID가 해당 pack의 그림을 선택합니다.

## 검증, terms 및 notice

CLI catalog는 각 공식 HTTPS archive URL, release, 전체 SHA-256, 허용된 entry path, terms URL, review date를 pin합니다. Import는 archive와 SVG 크기를 제한하고 active 및 external SVG content를 sanitize하며 pack을 atomic하게 기록합니다.

각 pack에는 `NOTICE.md`가 포함됩니다. `stack render --notice <PATH>`는 실제 pack revision, source release, terms URL, attribution, non-endorsement text 및 사용 icon ID를 기록합니다. Catalog는 각 provider의 공식 source와 terms, Simple Icons mark의 brand source와 guideline도 연결합니다.
