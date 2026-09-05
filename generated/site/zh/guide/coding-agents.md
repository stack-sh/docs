# 使用 coding agent

使用 coding agent 读写 Stack，可将架构图作为可审查的源文件管理。agent 阅读语言参考并在本地执行 CLI，不需要远程 MCP 服务器。

## 安装 skill

使用 `npx skills add stack-sh/cli` 仅将图表 skill 安装到当前项目。仅在需要用户级安装时添加 `-g`，并检查下载的指令。CLI 需要单独安装。需要可复现安装时，先 clone 仓库并 checkout 已审核的 commit，再运行 `npx skills add /absolute/path/to/cli --skill stack-diagrams`。安装器不能将 commit SHA 直接作为远程分支安装。

[SKILL.md](https://github.com/stack-sh/cli/blob/main/skills/stack-diagrams/SKILL.md)

## 不安装也能使用

将以下指令复制给 agent，并补充架构需求。只要客户端可以读取 HTTPS 页面和运行本地命令，即使不支持 skill 也能使用。

```text
Use Stack to create or edit the architecture described below. Read https://stack-diagram.com/docs/guide/agent-workflow.md and follow its local validation and safety workflow. Read the relevant language reference and examples as needed. Deliver editable .stack source and report verification results. Architecture requirements:
```

完整的 [agent workflow](./agent-workflow) 与 CLI skill 从同一份源文件生成。规范的 agent 指令使用英语；请让 agent 读取上面的 Markdown URL，或复制完整指令。

## 参考与更新

- [Examples](../examples/index)
- [Syntax](../language/syntax)
- [Diagnostics](../reference/diagnostics-and-limits)
- [Provider icons](./provider-icons)
- [Markdown index](https://stack-diagram.com/docs/llms.txt)
