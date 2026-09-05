# 云服务商图标

Stack 内置与服务商无关的核心图标目录。AWS、Google Cloud、Azure 以及常用开发和协作工具图形通过 provider pack 使用，并保存在用户管理的 icon store 中。

## 可用的服务商目录

已审核目录共有 1,051 个 ID：305 个 AWS Architecture Icons、45 个 Google Cloud 产品与分类图标、639 个 Azure 服务图标，以及 62 个常用工具图标。工具目录包括 GitHub、GitHub Actions、Notion、Linear、Atlassian、Jira、Confluence、Docker、Kubernetes、Terraform、Datadog、Grafana 和 Sentry 等。

选择服务商卡片即可查看导入命令。完整目录支持搜索与筛选，并以每次 100 项的方式在小屏设备上稳定显示。

<ProviderCatalog locale="zh" />

Provider pack 提供图形；Stack 源码中的节点 `kind` 继续决定语义样式和布局。

## 快速开始

为图中使用的每个服务商执行一次导入。`--accept-terms` 表示你已查看并接受链接中的服务商和品牌条款。

```sh
$ stack icons import gcp --accept-terms
$ stack icons import simple-icons --accept-terms
$ stack render architecture.stack -o architecture.svg
```

CLI 会下载已审核的官方压缩包，验证完整 SHA-256，清理选定 SVG，并将处理后的 provider pack 写入共享 icon store。一个 `gcp` 命令会同时导入 Google Cloud 产品和分类图形。

## 在 CLI 中使用服务商图标

一个 Stack 文件可以使用多个服务商。下面的例子组合了 Google Cloud 的 Cloud Run 与 Simple Icons 的 GitHub：

```stack
stack 1.0

diagram "Deploy from GitHub to Cloud Run" {
  node repository "GitHub" {
    kind external
    icon "simple-icons:github"
  }

  node service "Cloud Run" {
    kind service
    icon "gcp:cloud-run"
  }

  edge repository -> service "Deploy" {
    kind dependency
  }
}
```

完成两次导入后，标准渲染命令会发现两个 pack：

```sh
$ stack render architecture.stack -o architecture.svg --notice architecture.NOTICE.md
```

## 共享 icon store

默认 icon store 为 `$XDG_CONFIG_HOME/stack/icons`。未设置 `XDG_CONFIG_HOME` 时使用 `$HOME/.config/stack/icons`。

```text
icons/
  aws/
  gcp/
  azure/
  simple-icons/
```

可在 `$XDG_CONFIG_HOME/stack/config.yaml` 中设置绝对路径来更改共享位置：

```yaml
default_icons_path: /absolute/path/to/stack-icons
```

`stack icons import` 与 `stack render` 都会使用该位置。

## 在 Playground 中使用服务商图标

打开 **Icons**，选择 `stack/icons` 文件夹，Playground 会加载其中所有可识别的服务商目录。搜索已加载图形并选择一项，即可把 ID 复制到 Stack 源码中。

所选 pack 在当前浏览器标签页中处理。当生成图使用服务商图形时，SVG 下载旁的 **Notice** 会提供来源、条款和已使用图标记录。

## 将图标与项目一起管理

使用 `-o` 将导入的 pack 放进可随仓库提交的项目目录：

```sh
$ stack icons import gcp --accept-terms -o .stack-icons
$ stack icons import simple-icons --accept-terms -o .stack-icons
```

渲染时通过 `--provider-pack` 传入同一个 icon-store 根目录：

```sh
$ stack render architecture.stack \
  --provider-pack .stack-icons \
  -o architecture.svg \
  --notice architecture.NOTICE.md
```

## 查找图标 ID

可通过 CLI 或本页搜索目录：

```sh
$ stack icons list
$ stack icons list aws s3
$ stack icons list azure database
$ stack icons list simple-icons github
```

CLI 输出包含 `ID`、`PRODUCT`、`CATEGORY` 和推荐的 `KIND`。`gcp:cloud-run`、`simple-icons:github` 等带命名空间的 ID 会选择对应 pack 中的图形。

## 验证、条款与 notice

CLI 目录固定了每个官方 HTTPS 压缩包 URL、版本、完整 SHA-256、允许的条目路径、条款 URL 与审核日期。导入时会限制压缩包与 SVG 大小，清理活动及外部 SVG 内容，并以原子方式写入 pack。

每个 pack 都包含 `NOTICE.md`。`stack render --notice <PATH>` 会写入实际 pack 版本、来源版本、条款 URL、署名、非背书文本和已使用的图标 ID。目录还链接每个服务商的官方来源与条款，以及 Simple Icons 标志对应的品牌来源和指南。
