# 시작하기

Stack을 가장 빠르게 사용하는 방법은 브라우저 [Playground](https://stack-diagram.com/)입니다. 포매터, 검증기, 레이아웃 엔진, SVG 렌더러가 WebAssembly로 로컬에서 실행되므로 명령 설치나 렌더링 API로의 소스 전송이 필요 없습니다.

## 네이티브 CLI 설치

터미널 워크플로와 로컬 자동화에서는 `brew install stack-sh/tap/stack`으로 Stack이 관리하는 Homebrew formula를 설치합니다. 이 formula는 표준 Stack CLI 0.4.0 릴리스 아카이브를 사용하며, Homebrew의 현재 Tier 1 요구 사항을 충족하는 Apple Silicon macOS와 arm64 / x86_64 glibc Linux를 지원합니다. 업그레이드는 Homebrew가 `brew upgrade stack-sh/tap/stack`으로 관리하며, formula를 제거해도 Stack 설정과 아이콘 저장소는 유지됩니다. 정확한 플랫폼 매트릭스, 직접 설치 방법 및 복구 정책은 [CLI 배포 계약](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#homebrew-installation)을 참고하세요.

## 첫 문서 작성

에디터 내용을 다음 예제로 바꿉니다.

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

- 어휘 규칙과 전체 문법은 [문서와 문법](../language/syntax)을 참고하세요.
- 컴포넌트와 경계는 [노드와 그룹](../language/nodes-and-groups)을 참고하세요.
- 관계와 배치 의도는 [엣지와 레이아웃](../language/edges-and-layout)을 참고하세요.
- 시각 시스템이나 명시적 아이콘을 고르기 전에 [테마와 아이콘](../language/themes-and-icons)을 읽으세요.
