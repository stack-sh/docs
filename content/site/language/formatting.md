# Canonical formatting

Stack defines one canonical byte representation for every lexically and syntactically valid document. Formatting keeps diffs consistent without changing the declared language version, semantic meaning, or line comments.

## What formatting accepts

The formatter accepts UTF-8 without a byte order mark. Lexical or syntax errors return diagnostics and no partial formatted source. A syntactically valid document remains formattable when it has semantic or complexity diagnostics; formatting success does not mean the diagram is valid.

## Canonical output

Canonical source:

- uses UTF-8 without a byte order mark;
- normalizes every line ending to LF;
- uses two ASCII spaces for each block level and never formatting tabs;
- has no formatting whitespace at line ends;
- ends with exactly one LF;
- puts the opening brace on the declaration or `layout` line and closing braces on their own lines;
- separates the version and diagram, and adjacent body members, with one empty line;
- keeps properties and layout statements together without empty lines.

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

## Order and lists

The formatter preserves the authored order of diagram and group members, node and edge properties, layout statements, and list identifiers. It never groups or sorts them. Lists stay on one line with a comma and one space, no spaces just inside brackets, and no trailing comma.

## Strings

Valid strings are decoded and emitted directly as UTF-8 without Unicode normalization. Quotes and backslashes remain escaped; canonical output does not use `\uXXXX`. For example, a source spelling of `"API \u56F3 \uD83D\uDE80"` becomes `"API 図 🚀"`.

## Comments

Every line comment and its order are preserved. A trailing comment stays after its preceding token with one space. Own-line comments keep their token gap and appear immediately before the following member, statement, or property. A comment inside a construct can force a continuation line; this is the only exception to the usual one-line rules.

Formatting canonical source again must produce byte-identical output. When normalized IR exists, source before and after formatting must produce semantically equal IR.
