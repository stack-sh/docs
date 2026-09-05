# 快速开始

选择一种安装方式，按本页步骤生成第一个SVG。在终端或[coding agent](./coding-agents)中工作时使用CLI；无需安装即可体验的方式是打开[Playground](https://stack-diagram.com/)，并使用下方的浏览器示例。

## 安装CLI

Stack CLI 0.5.1支持arm64 / x86_64的macOS和glibc Linux。预编译文件需要macOS 13或glibc 2.31及以上；不支持Windows和Alpine/musl。请选择一种安装方式，避免多个二进制文件在`PATH`中冲突。准确的支持范围以[分发契约](https://github.com/stack-sh/cli/blob/main/docs/distribution.md#supported-platform-matrix)为准。

### Homebrew

在Apple Silicon macOS或受支持的Linux上使用已安装的Homebrew。主机还必须满足Homebrew自身的Tier 1要求。

```text
brew install stack-sh/tap/stack
```

### Cargo

需要Rust 1.85及以上和本地链接器：macOS使用Xcode Command Line Tools，Linux使用C编译器和链接器。将Cargo的bin目录加入`PATH`。包名为`stack-diagram-cli`，安装后的命令为`stack`。

```text
cargo install stack-diagram-cli --version 0.5.1 --locked
```

### Aqua

在Git仓库的根目录（包含`.git`的目录）中，将以下内容保存为`aqua.yaml`。新项目请先运行`git init`：

```yaml
checksum:
  enabled: true
  require_checksum: true
  supported_envs:
    - all
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 42702cda91a4156901b9a601bd143c43dcf05766
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli@v0.5.1
    registry: stack-sh
```

将以下限定范围的策略保存为`aqua-policy.yaml`，审阅后允许该策略并安装：

```yaml
registries:
  - name: stack-sh
    type: github_content
    repo_owner: stack-sh
    repo_name: cli
    ref: 'Version == "42702cda91a4156901b9a601bd143c43dcf05766"'
    path: aqua/registry.yaml
packages:
  - name: stack-sh/cli
    registry: stack-sh
    version: semver(">= 0.3.0")
```

```text
aqua policy allow
aqua update-checksum
aqua install
```

提交`aqua.yaml`、`aqua-policy.yaml`和生成的`aqua-checksums.json`。确保Aqua的bin目录在`PATH`中。注册表固定到不可变revision，请勿改成`main`。

### 直接下载

在受支持的主机上安装并登录[GitHub CLI](https://cli.github.com/)，然后在POSIX shell中执行。此流程下载到新的临时目录，验证校验和与确切标签的发布者身份后才解压，并拒绝替换已有的`~/.local/bin/stack`。macOS文件使用ad-hoc签名，未经公证。任何验证失败时都应停止。

```text
(
  set -eu
  version=0.5.1
  case "$(uname -s)/$(uname -m)" in
    Darwin/arm64) target=aarch64-apple-darwin ;;
    Darwin/x86_64) target=x86_64-apple-darwin ;;
    Linux/aarch64) target=aarch64-unknown-linux-gnu ;;
    Linux/x86_64) target=x86_64-unknown-linux-gnu ;;
    *) echo "Unsupported platform" >&2; exit 1 ;;
  esac
  archive="stack-v${version}-${target}.tar.gz"
  download_dir=$(mktemp -d)
  cd "$download_dir"
  gh release download "v$version" --repo stack-sh/cli --pattern "$archive" --pattern "stack-v${version}-checksums.txt"
  awk -v archive="$archive" '$2 == archive { print }' "stack-v${version}-checksums.txt" > archive-checksum.txt
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum --check archive-checksum.txt
  else
    shasum -a 256 --check archive-checksum.txt
  fi
  gh attestation verify "$archive" --repo stack-sh/cli --signer-workflow stack-sh/cli/.github/workflows/release.yaml --source-ref "refs/tags/v$version" --deny-self-hosted-runners
  tar -xzf "$archive"
  mkdir -p "$HOME/.local/bin"
  test ! -e "$HOME/.local/bin/stack"
  install -m 0755 "stack-v${version}-${target}/stack" "$HOME/.local/bin/stack"
)
export PATH="$HOME/.local/bin:$PATH"
```

## 生成第一个SVG

在新的空工作目录中执行。使用Aqua时，请将该目录放在包含`aqua.yaml`的Git仓库内：

```sh
$ stack --version
$ stack init
$ stack check diagram.stack
$ stack render diagram.stack -o diagram.svg
```

预期结果：显示`stack 0.5.1`、生成`diagram.stack`、检查无错误，并生成非空的`diagram.svg`。用浏览器打开SVG或将其加入README。`stack init`会保护已有文件，请使用新目录而非覆盖原有工作。

修改`diagram.stack`描述自己的系统，再次运行check和render。需要格式化时执行：

```sh
$ stack fmt diagram.stack
$ stack fmt --check diagram.stack
```

## 编写第一份文档

在浏览器中试用时，打开[Playground](https://stack-diagram.com/)，将编辑器内容替换为下面的示例。CLI用户可以将相同源文件保存为`diagram.stack`，然后再次执行上面的检查与渲染命令：

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

- **与编程智能体协作：** 安装可选的[Stack技能](./coding-agents)，使用共享的检查与渲染流程。
- **从示例开始：** 在Playground中打开[实时渲染的示例](../examples/)，再尝试[主题与图标](../language/themes-and-icons)。
- **适配你的环境：** [导入供应商图标](./provider-icons)，然后通过[CLI配置指南](https://github.com/stack-sh/cli/blob/main/docs/configuration.md)选择本地存储位置。这些配置属于CLI；浏览器需要显式导入本地图标包。
- **查阅细节：** 描述更大的系统时，参考[语言文档](../language/syntax)和[诊断与限制](../reference/diagnostics-and-limits)。

## 更新或卸载

Stack不会自行更新。请使用安装该二进制文件的工具进行管理。卸载二进制文件不会删除配置和已导入的图标包。

| 安装方式 | 更新 | 卸载 |
| --- | --- | --- |
| Homebrew | `brew upgrade stack-sh/tap/stack` | `brew uninstall stack-sh/tap/stack` |
| Cargo | 用所需版本重新运行上面的Cargo安装命令。 | `cargo uninstall stack-diagram-cli` |
| Aqua | `aqua update`, `aqua update-checksum`, `aqua install` | 保留此配置时运行`aqua rm -m pl stack-sh,stack-sh/cli`，然后从`aqua.yaml`移除`stack-sh/cli`。其他项目需要此包时可能会重新安装。 |
| 直接下载 | 验证新release后，仅替换直接安装的二进制文件。 | 仅删除自己直接安装的二进制文件（`~/.local/bin/stack`）。 |

补全、man页面与恢复方法见[shell集成](https://github.com/stack-sh/cli/blob/main/docs/completions.md)、[安全更新](https://github.com/stack-sh/cli/blob/main/docs/self-update.md)和[供应链验证](https://github.com/stack-sh/cli/blob/main/docs/supply-chain.md)。
