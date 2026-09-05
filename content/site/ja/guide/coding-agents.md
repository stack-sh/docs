# Coding agentで使う

Coding agentでStackを読み書きすると、構成図をレビュー可能なsourceとして管理できます。言語referenceを読み、CLIをlocal実行するため、remote MCP serverは不要です。

## Skillの導入

`npx skills add stack-sh/cli`で図作成skillだけをcurrent projectへ導入します。User全体へ導入したい場合だけ`-g`を付け、取得したinstructionを確認してください。CLI本体は別途必要です。再現可能な導入にはrepositoryをcloneして確認済みcommitをcheckoutし、`npx skills add /absolute/path/to/cli --skill stack-diagrams`で導入します。Installerはcommit SHAをremote branchとして直接指定する方法には対応していません。

[SKILL.md](https://github.com/stack-sh/cli/blob/main/skills/stack-diagrams/SKILL.md)

## 導入せずに使う

次のinstructionをagentへ渡し、作りたい構成を追記してください。HTTPSの参照とlocal command実行ができれば、skillに未対応のclientでも使えます。

```text
{{agentPrompt}}
```

詳しい[agent workflow](./agent-workflow)はCLIスキルと同じ原稿から生成します。正本のagent向け指示は英語です。上のMarkdown URLをagentに読ませるか、指示をコピーしてください。

## 参照と更新

- [Examples](../examples/index)
- [Syntax](../language/syntax)
- [Diagnostics](../reference/diagnostics-and-limits)
- [Provider icons](./provider-icons)
- [Markdown index](https://stack-diagram.com/docs/llms.txt)
