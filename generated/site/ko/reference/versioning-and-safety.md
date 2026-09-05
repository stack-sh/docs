# 버전과 안전성

Draft Stack 1.0은 소스 언어, 구현, 테마 catalog, package 버전을 분리합니다. 이 경계를 이해하면 문서를 이식 가능하게 하고 렌더 결과의 출처를 추적할 수 있습니다.

## 언어 버전

모든 문서는 `major.minor` 지시문으로 시작합니다.

```stack
stack 1.0

diagram "Versioned source" {
  node api "API"
}
```

이 값은 문서가 요구하는 최소 언어 문법과 의미이며 엔진이나 테마 버전이 아닙니다. `M.N`을 지원하는 렌더러는 같은 major에서 minor가 `N` 이하인 문서를 받고, 다른 major나 명시적으로 지원하지 않는 더 높은 minor를 거부합니다. 미래 문법의 의미를 추측하지 않습니다.

Specification release는 semantic versioning을 사용합니다. Major는 호환되지 않는 언어 변경, minor는 하위 호환 기능 추가, patch는 유효 소스 의미를 바꾸지 않는 설명과 오류 수정입니다. 그래서 문서 지시문은 patch를 생략합니다.

## 렌더러와 catalog 식별

일반 엔진 결과에는 엔진 버전, 작성한 언어 버전, 테마 catalog 버전, catalog content revision이 포함됩니다. 소스 `theme`은 기호 식별자만 선택하며 package release를 pin하거나 원격 데이터를 가져오지 않습니다.

정확한 픽셀 출력은 언어 호환성 약속이 아닙니다. 테마 metric, 렌더러 버전, 폰트, 캔버스 결정이 위치를 바꿀 수 있지만 노드, 그룹, 관계, 라벨, kind, 제약은 보존해야 합니다.

## 안전한 소스 경계

Stack 문자열은 일반 텍스트입니다. 소스에는 실행 코드, 임의 HTML/Markdown, CSS, SVG, import, macro, 파일 경로, 네트워크 URL을 넣을 수 없습니다. 엔진은 작성한 텍스트를 escape하고 검증된 catalog 아이콘, local marker reference, 접근 가능한 title/description metadata가 포함된 독립형 SVG를 만듭니다.

렌더된 SVG에는 script, event handler, 임의 external reference, host font measurement, runtime I/O가 없습니다. 없는 아이콘과 테마 이름은 경로나 registry를 찾는 대신 번들 fallback을 선택합니다.

## 현재 제공 상태

- 브라우저 Playground가 지원되는 공개 경험입니다.
- 공개 `@stack-sh/engine`은 Playground가 사용하는 typed WebAssembly `format`, `check`, `render`를 제공합니다.
- 공개 `@stack-sh/language`는 에디터 하이라이트용 공유 TextMate grammar와 언어 metadata를 제공합니다.
- 공개 [`stack-sh/cli`](https://github.com/stack-sh/cli)는 native `format`, `check`, `render` 및 provider-icon store 작업을 제공합니다.

표준 언어 계약은 [`stack-sh/specification`](https://github.com/stack-sh/specification), 공개 테마 catalog는 [`stack-sh/theme`](https://github.com/stack-sh/theme), 엔진 동작은 [`stack-sh/engine`](https://github.com/stack-sh/engine)이 소유합니다.
