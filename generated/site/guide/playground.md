# Using the Playground

The Playground is the public browser consumer at [stack-diagram.com](https://stack-diagram.com/). The editor remains a native text input while a shared TextMate grammar supplies syntax color. Validation, formatting, layout, and SVG always come from the published Stack WebAssembly engine.

## Actions

| Action           | Result                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| **Format**       | Canonicalizes syntactically valid source and preserves comments. Semantic errors remain visible. |
| **Check**        | Runs compiler, theme, icon, layout, and routing checks without creating a new SVG.               |
| **Run**          | Runs the full pipeline and updates the SVG when no error prevents rendering.                     |
| **Download SVG** | Saves the current standalone SVG.                                                                |

<kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> runs the document. Source changes clear stale diagnostics so old ranges are not presented as current results.

## Reading diagnostics

An error result can include:

```text
error[STK2002] at 4:22
4 |   layout { direction hoo }
  |                      ^^^ unexpected layout direction 'hoo'
  = expected: right, down
  = help: use 'right' for horizontal flow or 'down' for vertical flow
```

Select a diagnostic or its related information to focus the corresponding source. Errors prevent a successful render. Warnings describe a fallback or readability concern and can accompany an SVG.

## Two independent color choices

The header color-mode control changes the Playground and editor presentation. A source statement such as `theme dark` changes the generated diagram. The two settings are intentionally independent: switching the site to dark mode must not rewrite or reinterpret the diagram theme.

## Browser behavior and data

The Playground loads a published WebAssembly module, then runs synchronous `format`, `check`, and `render` operations in the browser. The engine itself does not read files, contact a network service, inspect the DOM, observe a clock, or measure host fonts.

The current Playground does not provide accounts, cloud persistence, collaboration, or paid themes. Download source or SVG that you need to keep.

## Accessibility

The editor retains native caret, selection, clipboard, undo, keyboard, and IME behavior. Diagnostics can navigate to source ranges. The preview has text alternatives and opens in a keyboard-accessible dialog. The interface supports 320-pixel layouts, light and dark contrast, visible focus, and reduced-motion preferences.
