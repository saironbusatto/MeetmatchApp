# Pretext — Fast Text Measurement & Layout

> Source: https://github.com/chenglou/pretext
> Collected: 2026-05-19
> Published: Unknown

Pure JavaScript/TypeScript library for multiline text measurement & layout. Fast, accurate & supports all the languages. Allows rendering to DOM, Canvas, SVG and soon, server-side.

Pretext side-steps the need for DOM measurements (e.g. `getBoundingClientRect`, `offsetHeight`), which trigger layout reflow, one of the most expensive operations in the browser. It implements its own text measurement logic, using the browsers' own font engine as ground truth.

## Installation

```sh
npm install @chenglou/pretext
```

## API

### 1. Measure a paragraph's height without touching DOM

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('AGI 春天到了. بدأت الرحلة 🚀‎', '16px Inter')
const { height, lineCount } = layout(prepared, 320, 20)
```

`prepare()` does the one-time work: normalize whitespace, segment the text, apply glue rules, measure the segments with canvas, and return an opaque handle. `layout()` is the cheap hot path: pure arithmetic over cached widths. Do not rerun `prepare()` for the same text and configs. For resize, only rerun `layout()`.

For textarea-like text where ordinary spaces, tabs, and hard breaks stay visible, pass `{ whiteSpace: 'pre-wrap' }`.

### 2. Manual paragraph line layout

```ts
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments(text, '16px Inter')
const result = layoutWithLines(prepared, containerWidth, 20)
// result.lines[i] = { x, y, ranges, text, width }
```

Each line has position and rich text ranges. `x` comes from `text-align` and `direction`.

### 3. Dynamic text wrapping (shrinkwrap)

```ts
import { prepareWithSegments, walkLineRanges, measureLineStats } from '@chenglou/pretext'

const prepared = prepareWithSegments('Hello World', '16px Inter')
for (const { stats } of walkLineRanges(prepared, 100, 20)) {
  // stats.width, stats.maxHeight, stats.maxAscent, stats.maxDescent
}
```

`walkLineRanges` never needs to know `maxWidth` ahead of time. Binary search: call `measureLineStats(prepared, width, lineHeight, count)` to measure the first `count` lines at `width` without materializing line objects.

### 4. Text around images (flow layout)

```ts
import { prepareWithSegments, layoutNextLineRange } from '@chenglou/pretext'

const prepared = prepareWithSegments(text, '16px Inter')
const state = { context: prepared, x: 0, offset: 0 }
let line
while ((line = layoutNextLineRange(state, getMaxWidth, 20))) {
  // Render line.ranges
}
```

`getMaxWidth(y, lineHeight)` returns available width at vertical position `y`.

### 5. Rich inline elements

```ts
import { prepareWithSegments, layoutWithLines, type Inline } from '@chenglou/pretext'

const inlines: Inline[] = [
  { type: 'text', text: 'Hello ' },
  { type: 'custom', width: 16, height: 16, data: { kind: 'chip', label: '@alice' } },
  { type: 'text', text: ' World' },
]
const prepared = prepareWithSegments(inlines, '16px Inter')
```

Custom inlines participate in line layout. Use `walkLineRanges` to position them. Provide `measureCustomInline` callback to `prepareWithSegments` to report metrics back to your system.

## Internals

### Measurement

Uses canvas `measureText()` for segment widths. Caches per-font per-segment. Auto-detects emoji inflation (Chrome/Firefox canvas measures emoji wider than DOM at <24px on macOS).

### Line breaking

Two-pass approach:
1. **Analysis**: segments text via `Intl.Segmenter`, classifies break opportunities (spaces, CJK, punctuation)
2. **Breaking**: greedy algorithm with CJK kinsoku rules, keep-all after punctuation, trailing whitespace handling

### Bidi

Simplified rich-path metadata for mixed LTR/RTL rendering. `computeSegmentLevels()` produces embedding levels; higher-level code applies directional runs.

### Engine Profile

Auto-detects browser-specific quirks:
- `lineFitEpsilon`: tolerance for line-fit decisions
- `carryCJKAfterClosingQuote`: whether CJK after closing quotes stays on same line
- `breakKeepAllAfterPunctuation`: keep-all behavior after punctuation
- `preferPrefixWidthsForBreakableRuns`: Safari prefix-fit policy
- `preferEarlySoftHyphenBreak`: soft hyphen break behavior

## Caveats

- **system-ui font**: canvas resolves to different optical variants than DOM on macOS. Use named fonts (Helvetica, Inter, etc.) for accuracy.
- **React Native**: requires browser Canvas 2D context. Not compatible with RN.
- **Server-side**: planned but not yet shipped. `layout()` is pure arithmetic but `prepare()` needs canvas.
