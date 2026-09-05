# 节点与分组

节点是可引用的架构实体，分组是带标签的包含边界。两者共同描述图中可见的组件与作用域。

## 节点

节点需要全局唯一标识符和可见标签。标识符供连线和布局语句引用，但不会渲染；标签长度为 1 至 60 个 Unicode scalar。

```stack
stack 1.0

diagram "Node example" {
  node api "Public API" {
    kind service
    detail "Order orchestration"
  }
}
```

不同实体可以使用相同可见标签，但最好让标签不依赖位置也能理解。节点块不能重复 `kind`、`icon` 或 `detail`。

## 节点种类

`kind` 表示粗粒度架构语义，并选择由主题控制的形状和回退图标。默认值是 `service`。

| Kind       | 预期含义                                |
| ---------- | --------------------------------------- |
| `actor`    | 人、角色、团队或自主参与者              |
| `client`   | 浏览器、移动/桌面应用、设备或其他客户端 |
| `service`  | 长期运行的应用、API、网关或通用组件     |
| `function` | 按需或 serverless 计算单元              |
| `worker`   | 后台处理器或定时任务                    |
| `database` | 持久、可查询的数据存储                  |
| `cache`    | 内容可丢弃或可重新生成的数据存储        |
| `queue`    | 用于异步传递的队列、流、总线或 broker   |
| `storage`  | Blob、对象、文件或归档存储              |
| `external` | 架构控制边界之外的系统                  |

Kind 是语义分类，不是厂商形状。托管 PostgreSQL 仍是 `database`，技术名称应写入 `detail`。

## 标签与详情

`detail` 是可选的可见第二行，长度为 1 至 80 个 Unicode scalar。可填写一种技术或简短职责，如 `"Next.js"`、`"PostgreSQL 17"` 或 `"Order orchestration"`。它必须在所有渲染图中可见，不能只放在 tooltip 中。

标签和详情是纯文本。显式 `icon` 只装饰节点，不改变 kind、identity 或无障碍标签。另见[主题与图标](./themes-and-icons)。

## 分组

分组需要全局唯一标识符、1 至 60 个 Unicode scalar 的标签，以及至少一个后代节点。它可包含节点、嵌套分组和一个布局块。

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

分组最多可在图下嵌套三层。节点属于最近的分组，也传递地属于所有祖先分组。声明不能复用，因此一个节点不能同时属于两个独立分组。

连线必须在图作用域声明，且只有节点可作为端点。分组不会产生隐式节点或连线。标签用于说明它代表系统、领域、网络、部署区域、团队或其他边界；包含关系本身不表示运行时隔离、安全性、所有权或部署语义。
