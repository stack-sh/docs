# 文档与语法

Stack 源文件被刻意设计得很小。本页完整介绍 draft Stack 1.0 的词法结构与语法。

## 文档结构

文档是一个不含 BOM 的 UTF-8 `.stack` 文件。LF 与 CRLF 含义相同。第一个非注释 token 必须是版本指令，之后只能有且仅有一个图，不能再有其他声明。

```stack
// One file, one diagram.
stack 1.0

diagram "Example" {
  node api "API"
}
```

图标题必填，长度为 1 至 80 个 Unicode scalar，开头和结尾不能是 Unicode 空白。图中至少要有一个节点。

## 注释与空白

空格、制表符和换行用于分隔 token，除此之外没有语义。行注释从 `//` 开始，到行尾结束，可出现在允许空白的位置。不支持块注释。

格式本身没有语义，但规范格式化器会生成[规范格式化](./formatting)定义的一致形式。

## 标识符

节点、分组、主题和引用标识符匹配：

```text
[a-z][a-z0-9_-]*
```

长度为 1 至 64 个 ASCII 字符，区分大小写，且不会显示。节点和分组共享一个全局命名空间。关键字是上下文相关的，技术上也可用于标识符位置，但应避免降低可读性的名称。

图标标识符是带引号的字符串，解码后匹配 `[a-z0-9][a-z0-9-]*`，长度同样为 1 至 64 个 ASCII 字符，并在有效主题内解析。

## 字符串

字符串使用双引号，可直接包含 Unicode。只支持三种转义：

| 转义     | 含义              |
| -------- | ----------------- |
| `\"`     | 双引号            |
| `\\`     | 反斜杠            |
| `\uXXXX` | Unicode code unit |

解码后的字符串不能包含换行、制表符、控制字符或未配对 surrogate。标题、标签和详情不能以 Unicode 空白开头或结尾。字符串始终是纯文本，不会解释为 Markdown 或 HTML。

## 完整语法

```text
document          = version-directive, diagram-declaration, EOF ;
version-directive = "stack", integer, ".", integer ;
diagram-declaration
                  = "diagram", string, "{", { diagram-member }, "}" ;
diagram-member    = node-declaration | group-declaration | edge-declaration
                  | theme-statement | layout-block ;
theme-statement   = "theme", identifier ;
group-declaration = "group", identifier, string, "{", { group-member }, "}" ;
group-member      = node-declaration | group-declaration | layout-block ;
node-declaration  = "node", identifier, string, [ node-block ] ;
node-block        = "{", node-property, { node-property }, "}" ;
node-property     = "kind", node-kind | "icon", string | "detail", string ;
node-kind         = "actor" | "client" | "service" | "function" | "worker"
                  | "database" | "cache" | "queue" | "storage" | "external" ;
edge-declaration  = "edge", identifier, edge-operator, identifier,
                    [ string ], [ edge-block ] ;
edge-operator     = "->" | "<->" | "--" ;
edge-block        = "{", edge-property, { edge-property }, "}" ;
edge-property     = "kind", edge-kind ;
edge-kind         = "flow" | "request" | "event" | "data" | "dependency" ;
layout-block      = "layout", "{", layout-statement,
                    { layout-statement }, "}" ;
layout-statement  = direction-statement | rank-statement | order-statement ;
direction-statement
                  = "direction", ( "right" | "down" ) ;
rank-statement    = "rank", "same", identifier-list ;
order-statement   = "order", identifier-list ;
identifier-list   = "[", identifier, ",", identifier,
                    { ",", identifier }, "]" ;
integer           = "0" | nonzero-digit, { digit } ;
```

## 上下文关键字

Stack 1.0 在对应语法位置识别：

```text
stack diagram group node edge theme layout kind icon detail direction
rank same order right down actor client service function worker
database cache queue storage external flow request event data dependency
```

未知声明、属性、枚举值和操作符都是错误。工具不会静默忽略可能生成外观合理但语义错误图形的语法。
