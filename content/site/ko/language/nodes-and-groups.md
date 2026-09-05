# 노드와 그룹

노드는 참조 가능한 아키텍처 엔티티이고 그룹은 라벨이 있는 포함 경계입니다. 둘을 사용해 다이어그램에 보이는 컴포넌트와 스코프를 설명합니다.

## 노드

노드에는 전역으로 고유한 식별자와 보이는 라벨이 필요합니다. 식별자는 엣지와 레이아웃 문장에서 참조하지만 렌더링되지 않습니다. 라벨은 1~60 Unicode scalar입니다.

```stack
stack 1.0

diagram "Node example" {
  node api "Public API" {
    kind service
    detail "Order orchestration"
  }
}
```

서로 다른 엔티티는 같은 보이는 라벨을 사용할 수 있지만 위치에 의존하지 않아도 이해되는 이름을 권장합니다. 노드 블록에서는 `kind`, `icon`, `detail`을 중복할 수 없습니다.

## 노드 종류

`kind`는 큰 범주의 아키텍처 의미를 제공하고 테마가 관리하는 모양과 fallback 아이콘을 선택합니다. 기본값은 `service`입니다.

| Kind       | 의도한 의미                                          |
| ---------- | ---------------------------------------------------- |
| `actor`    | 사람, 역할, 팀, 자율 참여자                          |
| `client`   | 브라우저, 모바일/데스크톱 앱, 디바이스 등 클라이언트 |
| `service`  | 장기 실행 앱, API, 게이트웨이, 일반 컴포넌트         |
| `function` | 온디맨드 또는 serverless 컴퓨팅 단위                 |
| `worker`   | 백그라운드 프로세서나 예약 작업                      |
| `database` | 지속적이고 조회 가능한 데이터 저장소                 |
| `cache`    | 내용을 폐기하거나 재생성할 수 있는 데이터 저장소     |
| `queue`    | 비동기 전달용 큐, 스트림, 버스, broker               |
| `storage`  | Blob, object, file, archive storage                  |
| `external` | 아키텍처 제어 경계 밖의 시스템                       |

Kind는 벤더별 모양이 아닌 의미 범주입니다. 호스팅된 PostgreSQL도 `database`이며 기술 이름은 `detail`에 작성합니다.

## 라벨과 상세

`detail`은 선택적인 두 번째 표시 줄이며 1~80 Unicode scalar입니다. `"Next.js"`, `"PostgreSQL 17"`, `"Order orchestration"`처럼 한 기술이나 짧은 책임을 적습니다. 모든 렌더링에서 보이며 tooltip만으로 축소할 수 없습니다.

라벨과 상세는 일반 텍스트입니다. 명시적 `icon`은 노드를 꾸미지만 kind, identity, 접근성 라벨을 바꾸지 않습니다. [테마와 아이콘](./themes-and-icons)도 참고하세요.

## 그룹

그룹에는 전역으로 고유한 식별자, 1~60 Unicode scalar 라벨, 최소 하나의 하위 노드가 필요합니다. 노드, 중첩 그룹, 하나의 레이아웃 블록을 포함할 수 있습니다.

```stack
stack 1.0

diagram "Boundaries" {
  group platform "Platform" {
    group data "Data layer" {
      node primary "Primary database" {
        kind database
      }
    }
  }
}
```

그룹은 다이어그램 아래 최대 세 레벨까지 중첩할 수 있습니다. 노드는 가장 가까운 그룹과 모든 상위 그룹에 속합니다. 선언을 재사용할 수 없으므로 한 노드가 두 독립 그룹에 동시에 속할 수 없습니다.

엣지는 항상 다이어그램 스코프에서 선언하며 노드만 endpoint가 될 수 있습니다. 그룹은 암시적 노드나 관계를 만들지 않습니다. 라벨로 시스템, 도메인, 네트워크, 배포 영역, 팀 같은 경계의 의미를 설명합니다. 포함만으로 runtime isolation, security, ownership, deployment semantics를 의미하지 않습니다.
