# 테마와 아이콘

테마는 다이어그램 레벨에서 렌더러가 관리하는 시각 시스템의 기호 참조입니다. 아이콘은 해당 테마 안에서 해결되는 논리 이름입니다. 둘 다 다이어그램 의미를 바꾸지 않습니다.

## 테마 선택

다이어그램 바로 안에 `theme` 문장을 최대 하나 추가합니다.

```stack
stack 1.0

diagram "Dark architecture" {
  theme dark

  node api "API"
}
```

생략하면 `default`를 사용합니다. Draft Stack 1.0은 코어 catalog에 다음 테마를 요구합니다.

| Theme     | 용도                                                        |
| --------- | ----------------------------------------------------------- |
| `default` | 일반 아키텍처 다이어그램을 위한 균형 잡힌 blue-gray surface |
| `light`   | 밝은 문서를 위한 따뜻한 중립 surface                        |
| `dark`    | 어두운 캔버스를 위한 고대비 차가운 surface                  |

소스는 식별자만 선택하며 catalog package 버전을 고르지 않습니다. 렌더 metadata는 사용한 시각 데이터를 식별하도록 catalog 버전과 content revision을 기록합니다.

생성 다이어그램 테마는 Playground의 라이트/다크 UI와 독립적입니다. 테마는 palette, typography metric, surface, icon, connector, background를 바꿀 수 있지만 노드, 그룹, 엣지, 라벨, kind, 방향, 레이아웃 제약을 숨기거나 바꿀 수 없습니다.

## Fallback 동작

세 코어 테마는 렌더러 필수 리소스입니다. 설치된 catalog에 없는 non-core 테마는 `STK6001` 경고 후 `default`로 렌더링합니다. 소스에 테마 식별자가 있다고 네트워크에서 테마를 가져오지 않습니다.

테마 식별자는 일반 Stack 식별자 문법을 사용합니다. 한 번 등록된 식별자는 폐기된 뒤에도 다른 테마에 재할당할 수 없습니다.

## Kind fallback 아이콘

각 테마는 모든 노드 kind에 fallback을 제공합니다. `icon`을 생략하면 렌더러가 이를 사용합니다.

| Node kind  | 현재 논리 fallback 아이콘 |
| ---------- | ------------------------- |
| `actor`    | `kind-actor`              |
| `client`   | `kind-client`             |
| `service`  | `kind-service`            |
| `function` | `kind-function`           |
| `worker`   | `kind-worker`             |
| `database` | `kind-database`           |
| `cache`    | `kind-cache`              |
| `queue`    | `kind-queue`              |
| `storage`  | `kind-storage`            |
| `external` | `kind-external`           |

현재 공개 코어 catalog는 `default`, `light`, `dark`에 이 열 개 식별자를 포함하지만 `postgresql`, `aws`, `github` 같은 벤더 아이콘은 아직 없습니다. 대부분의 문서는 의미에 맞는 `kind`를 선택하고 `icon`을 생략하세요.

## 명시적 아이콘

명시적 아이콘은 인용된 논리 식별자입니다.

```stack
stack 1.0

diagram "Explicit icon" {
  node gateway "Public API" {
    kind service
    icon "api"
  }
}
```

아이콘은 노드를 꾸밀 뿐 `service` kind, identity, label, 접근성 설명을 바꾸지 않습니다. 테마마다 색상과 그림은 달라질 수 있지만 같은 식별자는 같은 논리 대상을 나타냅니다.

## First-party 아이콘 catalog

무료 코어 catalog는 `default`, `light`, `dark`에 다음 provider-neutral 명시적 아이콘을 제공합니다.

| ID              | Stable subject                    | 주요 용도                        |
| --------------- | --------------------------------- | -------------------------------- |
| `api`           | Application programming interface | 공개 또는 내부 API               |
| `web`           | Web application                   | 브라우저용 Web 경험              |
| `mobile`        | Mobile application                | iOS 또는 Android 클라이언트      |
| `desktop`       | Desktop application               | 네이티브 데스크톱 클라이언트     |
| `server`        | Server host                       | 가상 머신 또는 물리 호스트       |
| `container`     | Application container             | 컨테이너화된 워크로드            |
| `cluster`       | Compute cluster                   | 오케스트레이션된 컴퓨팅 그룹     |
| `cloud`         | Cloud environment                 | provider-neutral 클라우드 경계   |
| `scheduler`     | Scheduled execution               | Cron 작업 또는 예약 실행         |
| `webhook`       | Webhook endpoint                  | 인바운드 또는 아웃바운드 콜백    |
| `identity`      | Identity and access               | 인증 또는 권한 부여              |
| `observability` | Observability system              | 메트릭, 로그 또는 트레이스       |
| `gateway`       | Network gateway                   | 공용 또는 사설 네트워크 진입점   |
| `load-balancer` | Load balancer                     | 트래픽 분산                      |
| `dns`           | Domain name service               | 호스트 이름 및 서비스 검색       |
| `cdn`           | Content delivery network          | 엣지 콘텐츠 전송                 |
| `firewall`      | Network firewall                  | 네트워크 접근 경계               |
| `network`       | Network topology                  | 일반 네트워크 또는 서브넷        |
| `event`         | Discrete event                    | 개별 도메인 또는 시스템 이벤트   |
| `stream`        | Event stream                      | 지속적인 이벤트 또는 데이터 흐름 |
| `search`        | Search service                    | 인덱싱 및 쿼리 시스템            |
| `analytics`     | Analytics system                  | 보고 또는 데이터 분석            |
| `repository`    | Source code repository            | 소스 코드 및 버전 관리           |
| `pipeline`      | Delivery pipeline                 | 빌드, 테스트 또는 배포 흐름      |
| `secret`        | Secret or credential              | 비밀, 키 또는 자격 증명          |
| `document`      | Document or knowledge base        | 문서 및 지식 기반                |
| `task`          | Task or issue tracker             | 작업, 티켓 또는 이슈 추적        |
| `chat`          | Chat or messaging tool            | 팀 채팅 또는 메시징              |
| `email`         | Email delivery                    | 이메일 전송 또는 받은편지함      |
| `ai`            | Artificial intelligence system    | AI 모델 또는 추론 서비스         |

아래 미리보기를 라이트와 다크로 전환하여 실제 출력을 비교할 수 있습니다. 각 이미지는 공개된 `@stack-sh/engine@0.7.0`이 로컬에서 렌더링하며 문서에 Theme SVG 에셋을 복제하지 않습니다. 문법 행을 선택하면 복사됩니다.

<IconCatalog locale="ko" />

의미를 나타내는 `kind`와 명시적 아이콘은 독립적으로 선택합니다. 예를 들어 `icon "web"`은 `client` 또는 `service` 노드를 꾸밀 수 있지만 노드의 의미를 바꾸지 않습니다.

## 누락 아이콘과 벤더 아이콘

코어 catalog에는 현재 `postgresql`, `aws`, `github`, `docker` 같은 벤더 또는 프로젝트 마크가 없습니다. 유효 테마가 작성한 아이콘 식별자를 제공하지 않으면 노드 kind fallback으로 계속 렌더링하고 `STK5001` 경고를 냅니다.

위 표의 provider-neutral 아이콘을 사용하거나 kind fallback만으로 역할이 명확하면 `icon`을 생략하세요. 벤더 마크는 에셋별 license, 재배포 및 trademark review를 완료해야 별도 catalog에 포함할 수 있습니다.

## Catalog와 에셋 안전성

공개 `stack-sh/theme` catalog가 palette, 결정적 폰트 metric, node-kind visual, connector, icon metadata, SVG bytes, provenance, 재배포 권한을 소유합니다. Catalog 에셋은 렌더러에 번들되며 작성한 식별자는 파일 경로나 URL로 취급하지 않습니다.

SVG 검증은 script, event handler, nested SVG, unsafe reference, data/network URL, style attribute, allowlist 밖의 요소와 속성을 거부합니다. 아이콘만 의미의 유일한 단서가 될 수 없으며 라벨과 비색상 구분을 유지해야 합니다.
