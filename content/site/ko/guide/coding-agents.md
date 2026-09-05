# Coding agent 사용

Coding agent로 Stack을 읽고 쓰면 아키텍처 다이어그램을 검토 가능한 소스로 관리할 수 있습니다. 언어 레퍼런스를 읽고 CLI를 로컬에서 실행하므로 원격 MCP 서버가 필요하지 않습니다.

## Skill 설치

`npx skills add stack-sh/cli`로 현재 프로젝트에 다이어그램 skill만 설치합니다. 사용자 전체에 설치하려는 경우에만 `-g`를 추가하고 다운로드한 지침을 검토하세요. CLI는 별도로 설치해야 합니다. 재현 가능한 설치에는 저장소를 clone하고 검토한 commit을 checkout한 다음 `npx skills add /absolute/path/to/cli --skill stack-diagrams`를 실행하세요. 설치 프로그램은 commit SHA를 원격 브랜치로 직접 지정하는 방식을 지원하지 않습니다.

[SKILL.md](https://github.com/stack-sh/cli/blob/main/skills/stack-diagrams/SKILL.md)

## 설치 없이 사용

다음 지침을 agent에게 전달하고 아키텍처 요구 사항을 추가하세요. HTTPS 문서를 읽고 로컬 명령을 실행할 수 있다면 skill 미지원 클라이언트에서도 사용할 수 있습니다.

```text
{{agentPrompt}}
```

전체 [agent workflow](./agent-workflow)는 CLI skill과 같은 원본에서 생성됩니다. 정본 agent 지침은 영어입니다. 위 Markdown URL을 agent가 읽게 하거나 전체 지침을 복사하세요.

## 레퍼런스와 업데이트

- [Examples](../examples/index)
- [Syntax](../language/syntax)
- [Diagnostics](../reference/diagnostics-and-limits)
- [Provider icons](./provider-icons)
- [Markdown index](https://stack-diagram.com/docs/llms.txt)
