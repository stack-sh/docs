# 使用 Playground

Playground 是位于 [stack-diagram.com](https://stack-diagram.com/) 的公共浏览器客户端。编辑器保留原生文本输入行为，共享 TextMate grammar 提供语法着色。验证、格式化、布局和 SVG 始终来自已发布的 Stack WebAssembly 引擎。

## 操作

| 操作             | 结果                                                   |
| ---------------- | ------------------------------------------------------ |
| **Format**       | 规范化语法有效的源文件并保留注释；语义错误仍会显示。   |
| **Check**        | 不生成新 SVG，运行编译器、主题、图标、布局和路由检查。 |
| **Run**          | 运行完整流程；若没有阻止渲染的错误，则更新 SVG。       |
| **Download SVG** | 保存当前独立 SVG。                                     |

<kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> 也可运行文档。源文件发生变化时会清除旧诊断，避免把过期范围当成当前结果。

## 阅读诊断

错误结果可以包含：

```text
error[STK2002] at 4:22
4 |   layout { direction hoo }
  |                      ^^^ unexpected layout direction 'hoo'
  = expected: right, down
  = help: use 'right' for horizontal flow or 'down' for vertical flow
```

选择诊断或相关信息可聚焦对应源码。错误会阻止成功渲染；警告说明回退行为或可读性风险，并可与 SVG 同时返回。

## 两个独立的颜色设置

页头的颜色模式只改变 Playground 与编辑器外观；`theme dark` 等源码语句改变生成图。两者故意相互独立，切换网站深色模式不会改写或重新解释图的主题。

## 浏览器行为与数据

Playground 加载公开 WebAssembly 模块，然后在浏览器中同步执行 `format`、`check` 和 `render`。引擎本身不读取文件、不连接网络服务、不检查 DOM、不读取时钟，也不测量宿主字体。

当前 Playground 不提供账号、云端持久化、协作或付费主题。请下载需要保留的源文件或 SVG。

## 无障碍

编辑器保留原生光标、选择、剪贴板、撤销、键盘和输入法行为。诊断可以导航到源码范围。预览有文本替代，并在键盘可访问的对话框中打开。界面支持 320 像素布局、明暗对比度、可见焦点和减少动态效果偏好。
