# 主题与图标

主题是图级别、由渲染器管理的视觉系统符号引用。图标是在该主题内解析的逻辑名称。两者都不会改变图的语义。

## 选择主题

在图中最多添加一条 `theme` 语句：

```stack
stack 1.0

diagram "Dark architecture" {
  theme dark

  node api "API"
}
```

省略时使用 `default`。Draft Stack 1.0 要求核心 catalog 提供：

| Theme     | 用途                         |
| --------- | ---------------------------- |
| `default` | 适合通用架构图的均衡蓝灰表面 |
| `light`   | 适合浅色文档的暖中性色表面   |
| `dark`    | 适合深色画布的高对比冷色表面 |

源文件选择标识符，而不是 catalog package 版本。渲染 metadata 记录 catalog 版本和内容 revision，以标识实际使用的视觉数据。

生成图主题与 Playground 的明暗界面相互独立。主题可改变 palette、字体 metrics、surface、icon、connector 和 background，但不能隐藏或改变节点、分组、连线、标签、kind、方向或布局约束。

## 回退行为

三个核心主题是渲染器必需资源。当前 catalog 中不存在的非核心主题会发出 `STK6001`，并使用 `default` 渲染。引擎不会因为源文件出现主题标识符就从网络下载主题。

主题标识符使用普通 Stack 标识符语法。一旦注册，即使废弃后也不能重新分配给另一个主题。

## Kind 回退图标

每个主题为所有节点 kind 提供回退。省略 `icon` 时渲染器使用它。

| Node kind  | 当前逻辑回退图标 |
| ---------- | ---------------- |
| `actor`    | `kind-actor`     |
| `client`   | `kind-client`    |
| `service`  | `kind-service`   |
| `function` | `kind-function`  |
| `worker`   | `kind-worker`    |
| `database` | `kind-database`  |
| `cache`    | `kind-cache`     |
| `queue`    | `kind-queue`     |
| `storage`  | `kind-storage`   |
| `external` | `kind-external`  |

当前开放核心 catalog 在 `default`、`light` 和 `dark` 中包含这十个回退标识符，尚不包含 `postgresql`、`aws` 或 `github` 等厂商图标。多数文档应选择语义 `kind` 并省略 `icon`。

## 显式图标

显式图标使用带引号的逻辑标识符：

```stack
stack 1.0

diagram "Explicit icon" {
  node gateway "Public API" {
    kind service
    icon "api"
  }
}
```

图标只装饰节点，不改变 `service` kind、identity、label 或无障碍说明。同一标识符在不同主题中表示同一个逻辑对象，但颜色与图形可以适配主题。

## 第一方图标目录

免费核心 catalog 在 `default`、`light` 和 `dark` 中提供以下与厂商无关的显式图标：

| ID              | Stable subject                    | 主要用途              |
| --------------- | --------------------------------- | --------------------- |
| `api`           | Application programming interface | 公共或内部 API        |
| `web`           | Web application                   | 面向浏览器的 Web 体验 |
| `mobile`        | Mobile application                | iOS 或 Android 客户端 |
| `desktop`       | Desktop application               | 原生桌面客户端        |
| `server`        | Server host                       | 虚拟机或物理主机      |
| `container`     | Application container             | 容器化工作负载        |
| `cluster`       | Compute cluster                   | 编排后的计算集群      |
| `cloud`         | Cloud environment                 | 与厂商无关的云边界    |
| `scheduler`     | Scheduled execution               | Cron 任务或定时工作   |
| `webhook`       | Webhook endpoint                  | 入站或出站回调        |
| `identity`      | Identity and access               | 身份验证或授权        |
| `observability` | Observability system              | 指标、日志或链路追踪  |
| `gateway`       | Network gateway                   | 公共或私有网络入口    |
| `load-balancer` | Load balancer                     | 流量分发              |
| `dns`           | Domain name service               | 主机名与服务发现      |
| `cdn`           | Content delivery network          | 边缘内容分发          |
| `firewall`      | Network firewall                  | 网络访问边界          |
| `network`       | Network topology                  | 通用网络或子网        |
| `event`         | Discrete event                    | 单个领域或系统事件    |
| `stream`        | Event stream                      | 连续事件或数据流      |
| `search`        | Search service                    | 索引与查询系统        |
| `analytics`     | Analytics system                  | 报告或数据分析        |
| `repository`    | Source code repository            | 源代码与版本控制      |
| `pipeline`      | Delivery pipeline                 | 构建、测试或部署流程  |
| `secret`        | Secret or credential              | 密钥或凭据            |
| `document`      | Document or knowledge base        | 文档与知识库          |
| `task`          | Task or issue tracker             | 任务、工单或问题跟踪  |
| `chat`          | Chat or messaging tool            | 团队聊天或消息        |
| `email`         | Email delivery                    | 邮件投递或收件箱      |
| `ai`            | Artificial intelligence system    | AI 模型或推理服务     |

切换下方预览的浅色与深色模式即可比较真实输出。每张图片都由已发布的 `@stack-sh/engine@0.7.0` 在本地渲染；文档没有复制 Theme SVG 资源。选择语法行即可复制。

<IconCatalog locale="zh" />

语义 `kind` 与显式图标应独立选择。例如，`icon "web"` 可以装饰 `client` 或 `service` 节点，但不会改变该节点的含义。

## 缺失图标与厂商图标

核心 catalog 目前不包含 `postgresql`、`aws`、`github` 或 `docker` 等厂商或项目标志。如果有效主题没有编写的图标标识符，引擎会继续使用节点 kind 的回退图标渲染，并发出 `STK5001`。

请优先选择上表中与厂商无关的图标；如果 kind 回退已能表达角色，也可以省略 `icon`。厂商标志只有在逐项完成资源 license、再分发和商标审查后，才能进入独立 catalog。

## Catalog 与资源安全

公共 `stack-sh/theme` catalog 拥有 palette、确定性字体 metrics、node-kind visual、connector、icon metadata、SVG bytes、来源和再分发许可。Catalog 资源随渲染器打包，编写的标识符绝不会被当成文件路径或 URL。

SVG 验证会拒绝脚本、事件处理器、嵌套 SVG、不安全引用、data/network URL、style 属性和 allowlist 外元素或属性。图标不能成为表达意义的唯一方式，标签和非颜色区分也必须保留。
