# Playground 사용법

Playground는 [stack-diagram.com](https://stack-diagram.com/)의 공개 브라우저 consumer입니다. 에디터는 네이티브 텍스트 입력을 유지하고 공유 TextMate grammar가 문법 색상을 제공합니다. 검증, 포맷, 레이아웃, SVG는 항상 공개 Stack WebAssembly 엔진에서 생성됩니다.

## 작업

| 작업             | 결과                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Format**       | 문법적으로 유효한 소스를 표준화하고 주석을 보존합니다. 의미 오류는 계속 표시됩니다. |
| **Check**        | 새 SVG를 만들지 않고 compiler, theme, icon, layout, routing을 검사합니다.           |
| **Run**          | 전체 파이프라인을 실행하고 렌더링을 막는 오류가 없으면 SVG를 갱신합니다.            |
| **Download SVG** | 현재 독립형 SVG를 저장합니다.                                                       |

<kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>로도 실행할 수 있습니다. 소스가 변경되면 이전 범위를 현재 결과로 보이지 않도록 오래된 진단을 지웁니다.

## 진단 읽기

오류 결과에는 다음 정보가 포함될 수 있습니다.

```text
error[STK2002] at 4:22
4 |   layout { direction hoo }
  |                      ^^^ unexpected layout direction 'hoo'
  = expected: right, down
  = help: use 'right' for horizontal flow or 'down' for vertical flow
```

진단이나 관련 정보를 선택하면 대응하는 소스에 포커스합니다. 오류는 성공적인 렌더링을 막습니다. 경고는 fallback 또는 가독성 문제를 설명하며 SVG와 함께 반환될 수 있습니다.

## 독립된 두 색상 설정

헤더의 색상 모드는 Playground와 에디터 표현만 바꿉니다. `theme dark` 같은 소스 문장은 생성된 다이어그램을 바꿉니다. 사이트를 다크 모드로 전환해도 다이어그램 테마를 다시 해석하거나 변경하지 않도록 둘은 독립적입니다.

## 브라우저 동작과 데이터

Playground는 공개 WebAssembly 모듈을 불러온 뒤 브라우저에서 동기식 `format`, `check`, `render`를 실행합니다. 엔진 자체는 파일을 읽거나 네트워크 서비스에 접속하거나 DOM, 시계, 호스트 폰트 측정을 사용하지 않습니다.

현재 Playground에는 계정, 클라우드 저장, 협업, 유료 테마가 없습니다. 보관할 소스와 SVG를 다운로드하세요.

## 접근성

에디터는 네이티브 캐럿, 선택, 클립보드, 실행 취소, 키보드, IME 동작을 유지합니다. 진단에서 소스 범위로 이동할 수 있습니다. 프리뷰는 텍스트 대체를 제공하고 키보드로 접근 가능한 다이얼로그에서 열립니다. 인터페이스는 320px 레이아웃, 라이트/다크 대비, 보이는 포커스, reduced motion을 지원합니다.
