# 快速开始

使用 Stack 最快的方法是浏览器 [Playground](https://stack-diagram.com/)。格式化器、验证器、布局引擎和 SVG 渲染器都通过 WebAssembly 在本地运行；无需安装命令，也不会把源文件发送到渲染 API。

## 安装原生 CLI

对于终端工作流和本地自动化，请使用 `brew install stack-sh/tap/stack` 安装由 Stack 维护的 Homebrew formula。它使用规范的 Stack CLI 0.4.0 发布归档，并支持符合 Homebrew 当前 Tier 1 要求的 Apple Silicon macOS，以及 arm64 / x86_64 的 glibc Linux。Homebrew 通过 `brew upgrade stack-sh/tap/stack` 管理升级；卸载 formula 不会删除 Stack 配置和图标存储。有关准确的平台矩阵、直接安装方式和恢复策略，请参阅 [CLI 分发约定](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#homebrew-installation)。

## 编写第一份文档

将编辑器内容替换为下面的示例：

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

## 渲染并查看

选择 **Run**，或按 <kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>。预览区会显示独立 SVG。选择预览可放大查看，需要保存时使用 **Download SVG**。

源文件由四部分组成：

1. `stack 1.0` 声明语言版本。
2. `diagram` 提供一个标题并包含完整架构。
3. `node` 和 `group` 声明组件与边界。
4. `edge` 记录关系，`layout` 提供受约束的布局意图。

## 检查与格式化

**Check** 在不替换 SVG 的情况下运行完整验证与布局流程。**Format** 保留行注释和语义，将语法有效的源文件改写成规范的两空格格式。

发现问题时，诊断会显示严重级别、稳定代码、位置、源码片段、候选值，以及可用的修复帮助。选择诊断会聚焦对应源码范围。

## 接下来阅读

- [文档与语法](../language/syntax)介绍词法规则和完整语法。
- [节点与分组](../language/nodes-and-groups)介绍组件和边界建模。
- [连线与布局](../language/edges-and-layout)介绍关系和布局意图。
- 选择视觉系统或显式图标前，请阅读[主题与图标](../language/themes-and-icons)。
