# 문서와 문법

Stack 소스는 의도적으로 작게 설계되었습니다. 이 페이지는 draft Stack 1.0의 전체 어휘 구조와 문법을 설명합니다.

## 문서 구조

문서는 BOM이 없는 UTF-8 `.stack` 파일 하나입니다. LF와 CRLF는 같은 의미입니다. 첫 non-comment token은 버전 지시문이어야 하며, 그 뒤에는 정확히 하나의 다이어그램만 있고 추가 선언은 올 수 없습니다.

```stack
// One file, one diagram.
stack 1.0

diagram "Example" {
  node api "API"
}
```

다이어그램 제목은 필수이며 1~80 Unicode scalar입니다. 시작과 끝에 Unicode 공백을 둘 수 없습니다. 다이어그램에는 노드가 적어도 하나 필요합니다.

## 주석과 공백

공백, 탭, 줄바꿈은 token을 구분하지만 그 밖의 의미는 없습니다. 줄 주석은 `//`에서 줄 끝까지이며 공백이 허용되는 곳에 쓸 수 있습니다. 블록 주석은 지원하지 않습니다.

포맷 자체는 의미가 없지만 표준 포매터는 [표준 포매팅](./formatting)에 정의된 일관된 표현을 생성합니다.

## 식별자

노드, 그룹, 테마, 참조 식별자는 다음과 일치합니다.

```text
[a-z][a-z0-9_-]*
```

1~64 ASCII 문자이며 대소문자를 구분하고 화면에 표시되지 않습니다. 노드와 그룹은 하나의 전역 namespace를 공유합니다. 키워드는 문맥적이므로 식별자 위치에도 쓸 수 있지만 읽기 어려운 이름은 피하세요.

아이콘 식별자는 인용 문자열이며 디코드된 값이 `[a-z0-9][a-z0-9-]*`와 일치하는 1~64 ASCII 문자입니다. 유효 테마 안에서 해결됩니다.

## 문자열

문자열은 큰따옴표를 사용하고 Unicode를 직접 포함할 수 있습니다. 이스케이프는 세 종류뿐입니다.

| 이스케이프 | 의미              |
| ---------- | ----------------- |
| `\"`       | 큰따옴표          |
| `\\`       | 역슬래시          |
| `\uXXXX`   | Unicode code unit |

디코드된 문자열에는 줄바꿈, 탭, 제어 문자, 짝이 없는 surrogate를 넣을 수 없습니다. 제목, 라벨, 상세의 시작과 끝에는 Unicode 공백을 둘 수 없습니다. 문자열은 항상 일반 텍스트이며 Markdown이나 HTML로 해석되지 않습니다.

## 전체 문법

```text
document          = version-directive, diagram-declaration, EOF ;
version-directive = "stack", integer, ".", integer ;
diagram-declaration
                  = "diagram", string, "{", { diagram-member }, "}" ;
diagram-member    = node-declaration | group-declaration | edge-declaration
                  | theme-statement | layout-block ;
theme-statement   = "theme", identifier ;
group-declaration = "group", identifier, string, "{", { group-member }, "}" ;
group-member      = node-declaration | group-declaration | layout-block ;
node-declaration  = "node", identifier, string, [ node-block ] ;
node-block        = "{", node-property, { node-property }, "}" ;
node-property     = "kind", node-kind | "icon", string | "detail", string ;
node-kind         = "actor" | "client" | "service" | "function" | "worker"
                  | "database" | "cache" | "queue" | "storage" | "external" ;
edge-declaration  = "edge", identifier, edge-operator, identifier,
                    [ string ], [ edge-block ] ;
edge-operator     = "->" | "<->" | "--" ;
edge-block        = "{", edge-property, { edge-property }, "}" ;
edge-property     = "kind", edge-kind ;
edge-kind         = "flow" | "request" | "event" | "data" | "dependency" ;
layout-block      = "layout", "{", layout-statement,
                    { layout-statement }, "}" ;
layout-statement  = direction-statement | rank-statement | order-statement ;
direction-statement
                  = "direction", ( "right" | "down" ) ;
rank-statement    = "rank", "same", identifier-list ;
order-statement   = "order", identifier-list ;
identifier-list   = "[", identifier, ",", identifier,
                    { ",", identifier }, "]" ;
integer           = "0" | nonzero-digit, { digit } ;
```

## 문맥적 키워드

Stack 1.0은 문법 위치에 따라 다음 단어를 인식합니다.

```text
stack diagram group node edge theme layout kind icon detail direction
rank same order right down actor client service function worker
database cache queue storage external flow request event data dependency
```

알 수 없는 선언, 속성, enum 값, 연산자는 오류입니다. 도구는 작성자의 의미를 잃은 채 그럴듯한 다이어그램을 만들 수 있는 문법을 조용히 무시하지 않습니다.
