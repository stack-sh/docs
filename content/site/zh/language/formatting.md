# 规范格式化

Stack 为每份词法和语法有效的文档定义唯一规范字节形式。格式化保持语言版本、语义和所有行注释不变，并让 diff 保持一致。

## 可格式化的源文件

格式化器接受不含 BOM 的 UTF-8。词法或语法错误只返回诊断，不会返回部分改写结果。语法有效时，即使存在语义或复杂度诊断也可以格式化；格式化成功不代表图有效。

## 规范输出

规范源文件：

- 使用不含 BOM 的 UTF-8；
- 将所有换行规范为 LF；
- 每层缩进使用两个 ASCII 空格，不使用格式化制表符；
- 行尾没有格式化空白；
- 结尾恰好一个 LF；
- 左花括号留在声明或 `layout` 行，右花括号独占一行；
- 版本与图、相邻 body member 之间有一个空行；
- 属性和布局语句之间没有空行。

```stack
stack 1.0

diagram "Title" {
  theme dark

  node client "Client"

  node api "API" {
    kind service
    detail "Public API"
  }

  edge client -> api "HTTPS" {
    kind request
  }

  layout {
    direction right
    order [client, api]
  }
}
```

## 顺序与列表

格式化器保持图和分组成员、节点和连线属性、布局语句及列表标识符的原始顺序，绝不分组或排序。列表保持一行，逗号后一个空格，方括号内侧无空格，也没有尾随逗号。

## 字符串

有效字符串会被解码，并在不进行 Unicode normalization 的情况下直接输出为 UTF-8。引号和反斜杠保持转义；规范输出不使用 `\uXXXX`。例如 `"API \u56F3 \uD83D\uDE80"` 会变成 `"API 図 🚀"`。

## 注释

所有行注释及其顺序都会保留。尾随注释在前一个 token 后用一个空格连接。独立行注释保持 token gap，紧邻后续成员、语句或属性。结构内部的注释可以强制续行，这是通常单行规则的唯一例外。

再次格式化规范源文件必须得到逐字节相同结果。存在 normalized IR 时，格式化前后必须产生语义相同的 IR。
