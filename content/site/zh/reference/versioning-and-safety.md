# 版本与安全

Draft Stack 1.0 将源语言、实现、主题 catalog 和 package 版本分开。理解该边界有助于文档移植和追踪渲染输出。

## 语言版本

每份文档以 `major.minor` 指令开始：

```stack
stack 1.0

diagram "Versioned source" {
  node api "API"
}
```

它表示文档要求的最低语言语法与语义，不是引擎或主题版本。支持 `M.N` 的渲染器接受相同 major 且 minor 不大于 `N` 的文档，拒绝不同 major，并在未明确支持时拒绝更高 minor；不会猜测未来语法。

Specification release 使用 semantic versioning。Major 可带来不兼容语言变化；minor 添加向后兼容能力；patch 只澄清文字或修正勘误，不改变有效源码含义，因此文档指令不包含 patch。

## 渲染器与 catalog 标识

普通引擎结果包含引擎版本、编写的语言版本、主题 catalog 版本和 catalog 内容 revision。源码 `theme` 只选择符号标识符，不 pin package release，也不获取远程数据。

逐像素一致不是语言兼容性承诺。主题 metrics、渲染器版本、字体和画布决定可以改变位置，但必须保持节点、分组、关系、标签、kind 和约束。

## 安全的源文件边界

Stack 字符串是纯文本。源文件不能包含可执行代码、任意 HTML/Markdown、CSS、SVG、导入、宏、文件路径或网络 URL。引擎会转义编写文本，并生成包含已验证 catalog 图标、本地 marker reference、无障碍 title/description metadata 的独立 SVG。

渲染 SVG 不含脚本、事件处理器、任意外部引用、宿主字体测量或运行时 I/O。缺失图标或主题会选择已打包回退，而不是解析路径或连接 registry。

## 当前交付状态

- 浏览器 Playground 是受支持的公共体验。
- 公共 `@stack-sh/engine` 提供 Playground 使用的 typed WebAssembly `format`、`check` 和 `render`。
- 公共 `@stack-sh/language` 提供编辑器高亮使用的共享 TextMate grammar 和语言 metadata。
- 公共 [`stack-sh/cli`](https://github.com/stack-sh/cli) 提供原生 `format`、`check`、`render` 和 provider-icon store 操作。

规范语言合同位于 [`stack-sh/specification`](https://github.com/stack-sh/specification)，公共主题 catalog 位于 [`stack-sh/theme`](https://github.com/stack-sh/theme)，引擎行为位于 [`stack-sh/engine`](https://github.com/stack-sh/engine)。
