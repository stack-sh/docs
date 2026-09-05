# 什么是 Stack？

Stack 是一种用于静态软件架构图和技术栈图的小型声明式语言。你在 UTF-8 `.stack` 文件中描述组件、边界与关系，由渲染器决定坐标、间距、连线路径、字体和视觉表现。

这种分工让源文件简洁、易审查，也适合版本控制。同一份文档可以由兼容工具格式化、检查和渲染，而不会变成绘图指令集合。

## 基本模型

每份文档包含一个语言版本和且仅一个图。图中可包含节点、分组、连线、主题和布局意图。

```stack
stack 1.0

diagram "Service architecture" {
  node client "Web app" {
    kind client
  }

  node api "API" {
    kind service
    detail "Order orchestration"
  }

  edge client -> api "HTTPS" {
    kind request
  }
}
```

这段源代码表达客户端调用服务，但没有规定方框位置或箭头如何转弯。

## Stack 的设计目标

{{productBenefits}}

一致的结果要求引擎版本、源文件、主题和图标包相同。渲染在本地完成，但安装工具、加载网站以及主动导入供应商图标可能需要网络。具体边界请参阅[版本与安全](../reference/versioning-and-safety)。

## Stack 不是什么

Stack 1.0 不是通用图语言、像素级画布、基础设施定义或可执行编程语言。它没有变量、导入、宏、条件、CSS、坐标、任意 URL 或嵌入 HTML，也不用于顺序图、状态机、类图、ER 图或完整 UML。

大型系统应拆成多张聚焦的图。Stack 为可读性设置了元素上限，而不是允许无限扩张。

## 处理模型

工具依次解码和解析文档、解析标识符与默认值、验证语义、解析主题与图标、求解布局并渲染。源代码错误会阻止渲染。可选主题或图标缺失、布局提示无法满足时会产生警告，并仍可返回回退图。

[语言页面](../language/syntax)介绍所有编写结构；[版本与安全](../reference/versioning-and-safety)介绍兼容性和信任边界。
