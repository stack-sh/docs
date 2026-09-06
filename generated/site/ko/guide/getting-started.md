# 시작하기

설치 방법 하나를 선택하고 이 페이지의 순서대로 첫 SVG를 만드세요. 터미널이나[coding agent](./coding-agents)에서 작업한다면 CLI를 사용하세요. 설치 없이 시험하려면 [Playground](https://stack-diagram.com/)를 열고 아래 브라우저 예제를 따라 하세요.

## CLI 설치

Stack CLI 0.5.3은 arm64 / x86_64 macOS와 glibc Linux를 지원합니다. 미리 빌드된 파일은 macOS 13 또는 glibc 2.31 이상이 필요하며 Windows와 Alpine/musl은 지원하지 않습니다. 여러 바이너리가 `PATH`에서 충돌하지 않도록 설치 방법 하나를 선택하세요. 정확한 지원 범위는 [배포 계약](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#supported-platform-matrix)이 정합니다.

### Homebrew

Apple Silicon macOS 또는 지원되는 Linux에서 이미 설치된 Homebrew를 사용하세요. Homebrew 자체의 Tier 1 호스트 요구 사항도 충족해야 합니다.

```text
brew install stack-sh/tap/stack
```

### Cargo

Rust 1.85 이상과 네이티브 링커가 필요합니다. macOS는 Xcode Command Line Tools, Linux는 C 컴파일러와 링커를 준비하세요. Cargo의 bin 디렉터리를 `PATH`에 추가하세요. 패키지 이름은 `stack-diagram-cli`, 설치되는 명령은 `stack`입니다.

```text
cargo install stack-diagram-cli --version 0.5.3 --locked
```

### Aqua

Git 저장소의 루트(`.git`이 있는 디렉터리)에 다음 내용을 `aqua.yaml`로 저장하세요. 새 프로젝트라면 먼저 `git init`을 실행하세요.

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

다음의 제한된 정책을 `aqua-policy.yaml`로 저장하고 검토한 뒤 허용 및 설치하세요.

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

`aqua.yaml`, `aqua-policy.yaml`, 생성된 `aqua-checksums.json`을 commit하세요. Aqua의 bin 디렉터리가 `PATH`에 있어야 합니다. 레지스트리는 불변 revision에 고정되어 있으며 `main`으로 바꾸면 안 됩니다.

### 직접 다운로드

지원되는 호스트에 [GitHub CLI](https://cli.github.com/)를 설치하고 로그인한 뒤 POSIX 셸에서 실행하세요. 새 임시 디렉터리에 다운로드하고 체크섬과 정확한 태그의 게시자 신원을 확인한 후 압축을 풉니다. 기존 `~/.local/bin/stack`은 교체하지 않습니다. macOS 파일은 ad-hoc 서명이며 공증되지 않았습니다. 검증이 실패하면 중단하세요.

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

## 첫 SVG 만들기

새로운 빈 작업 디렉터리에서 실행하세요. Aqua를 사용한다면 `aqua.yaml`이 있는 Git 저장소 안에 디렉터리를 만드세요.

```sh
$ stack --version
$ stack init
$ stack check diagram.stack
$ stack render diagram.stack -o diagram.svg
```

`stack 0.5.3`이 표시되고 `diagram.stack`이 생성되며 오류 없이 검사되고 비어 있지 않은 `diagram.svg`가 만들어지면 성공입니다. SVG를 브라우저에서 열거나 README에 넣으세요. `stack init`은 기존 파일을 보호하므로 덮어쓰는 대신 새 디렉터리를 사용하세요.

`diagram.stack`을 자신의 시스템에 맞게 수정하고 check와render를 반복하세요. 필요할 때 다음 명령으로 포맷하세요.

```sh
$ stack fmt diagram.stack
$ stack fmt --check diagram.stack
```

## 설치 상태 확인 및 셸 연동 설정

프로젝트나coding agent workflow에서 Stack을 계속 사용하기 전에 다음 두 read-only 명령으로 설치 상태를 확인하세요.

```text
$ stack doctor
$ stack config path
```

`stack doctor`는 CLI 버전, 선택된 설정 경로, 설정 상태, 실제 icon store 경로, 설치된 알려진 provider pack을 보고합니다. 기본 설정이나icon store가 없는 상태는 정상입니다. 명시적으로 설정한 경로가 잘못되었거나 읽을 수 없으면 수정 방법을 표시하고 상태 코드 `2`로 종료합니다. `stack config path`는 설정을 만들거나 읽지 않고 선택될 `config.yaml` 경로만 출력합니다.

Homebrew는binary와 일치하는 자동 완성 및manual 파일을 자동으로 설치합니다. 직접 다운로드, Aqua, Cargo 사용자는 자신의 셸에 맞춰 동일하고 결정적인 파일을 생성할 수 있습니다.

```text
$ stack completions bash
$ stack completions zsh
$ stack completions fish
$ stack manpage
```

이 명령은 표준 출력에만 쓰며 셸 시작 파일을 수정하지 않습니다. [셸 연동 가이드](https://github.com/stack-sh/cli/blob/main/docs/completions.md)에 따라 사용자 소유의 자동 완성 또는manual 디렉터리에 출력을 저장하세요. 설치하지 않고offline manual을 읽을 수도 있습니다.

```text
$ stack manpage > stack.1
$ man ./stack.1
```

## 첫 문서 작성

브라우저에서 체험하려면 [Playground](https://stack-diagram.com/)를 열고 에디터 내용을 다음 예제로 바꾸세요. CLI 사용자는 같은 소스를 `diagram.stack`으로 저장한 뒤 위의 검사·렌더링 명령을 다시 실행할 수 있습니다.

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

## 렌더링하고 확인하기

**Run**을 선택하거나 <kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>를 누릅니다. 프리뷰에 독립형 SVG가 표시됩니다. 프리뷰를 선택해 크게 확인하고, 필요하면 **Download SVG**로 저장합니다.

소스는 네 부분으로 구성됩니다.

1. `stack 1.0`은 언어 버전을 선언합니다.
2. `diagram`은 하나의 제목과 전체 아키텍처를 포함합니다.
3. `node`와 `group`은 컴포넌트와 경계를 선언합니다.
4. `edge`는 관계를, `layout`은 제한된 배치 의도를 기록합니다.

## 검사와 포맷

**Check**는 SVG를 바꾸지 않고 전체 검증과 레이아웃 파이프라인을 실행합니다. **Format**은 줄 주석과 의미를 보존하면서 문법적으로 유효한 소스를 표준 2칸 형식으로 다시 씁니다.

문제가 있으면 진단에 심각도, 안정적인 코드, 위치, 소스 프레임, 예상 값과 가능한 수정 도움말이 표시됩니다. 진단을 선택하면 해당 소스 범위에 포커스합니다.

## 다음으로 읽을 내용

- **코딩 에이전트와 작성하기:** 선택 사항인 [Stack 스킬](./coding-agents)을 설치하고 공통 검사·렌더링 흐름을 사용하세요.
- **예제에서 시작하기:** [실시간 렌더링 예제](../examples/)를 Playground에서 열고 [테마와 아이콘](../language/themes-and-icons)을 살펴보세요.
- **내 환경에 맞추기:** [공급자 아이콘을 가져온](./provider-icons) 다음 [CLI 설정 가이드](https://github.com/stack-sh/cli/blob/main/docs/configuration.md)에서 로컬 저장소를 선택하세요. 이 설정은 CLI용이며, 브라우저에서는 로컬 팩을 명시적으로 가져옵니다.
- **세부 사항 찾아보기:** 더 큰 시스템을 모델링할 때 [언어 레퍼런스](../language/syntax)와 [진단과 제한](../reference/diagnostics-and-limits)을 참고하세요.

## 업데이트 또는 제거

Stack은 스스로 업데이트하지 않습니다. 바이너리를 설치한 도구로 관리하세요. 바이너리를 제거해도 설정과 가져온 아이콘 팩은 유지됩니다.

| 설치 방법 | 업데이트 | 제거 |
| --- | --- | --- |
| Homebrew | `brew upgrade stack-sh/tap/stack` | `brew uninstall stack-sh/tap/stack` |
| Cargo | 원하는 버전으로 위 Cargo 설치 명령을 다시 실행하세요. | `cargo uninstall stack-diagram-cli` |
| Aqua | `aqua update`, `aqua update-checksum`, `aqua install` | 이 설정이 있는 상태에서 `aqua rm -m pl stack-sh,stack-sh/cli`를 실행하고 `aqua.yaml`에서 `stack-sh/cli`를 제거하세요. 다른 프로젝트에서 필요하면 다시 설치될 수 있습니다. |
| 직접 다운로드 | 새release를 검증한 뒤 직접 설치한 바이너리만 교체하세요. | 직접 설치한 바이너리(`~/.local/bin/stack`)만 제거하세요. |

업데이트 복구와artifact 검증은 [안전한 업데이트](https://github.com/stack-sh/cli/blob/main/docs/self-update.md)와 [공급망 검증](https://github.com/stack-sh/cli/blob/main/docs/supply-chain.md)을 참고하세요.
