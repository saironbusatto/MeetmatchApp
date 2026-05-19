# Text Measurement with Pretext

> Sources: chenglou/pretext, 2026-05-19
> Raw: [Pretext README](../../raw/pretext/2026-05-19-pretext-text-measurement.md)

## Overview

Pretext is a pure JS/TS library for measuring multiline text height and performing line-by-line layout without triggering DOM reflow. It uses canvas `measureText()` as ground truth and caches segment widths, making subsequent `layout()` calls pure arithmetic (~0.0002ms per text).

## Two-Phase Architecture

The library follows a strict two-phase design:

1. **`prepare(text, font)`** — One-time work: normalizes whitespace, segments via `Intl.Segmenter`, measures segments with canvas, returns an opaque handle. Expensive but called once per unique text+font combination.

2. **`layout(prepared, maxWidth, lineHeight)`** — Cheap hot path: walks cached widths with arithmetic to compute height and line count. Called on every resize.

This separation is the core performance insight: measure once, layout many times.

## API Surface

| Function | Use Case |
|----------|----------|
| `prepare()` + `layout()` | Height measurement without DOM reflow |
| `prepareWithSegments()` + `layoutWithLines()` | Manual line-by-line layout (Canvas, SVG, WebGL) |
| `walkLineRanges()` + `measureLineStats()` | Shrinkwrap / dynamic width / binary search |
| `layoutNextLineRange()` | Text flow around images |
| `Inline` type + `prepareWithSegments()` | Rich inline elements (chips, mentions, emoji) |

## Farmei Integration

The Farmei web app (`apps/web`) uses pretext via a custom React hook:

- **`usePretext({ text, width, font, lineHeight })`** — Memoizes `prepare()`, re-runs `layout()` on width change. Default font/lineHeight from CSS variables (`--font-body`, `--t-body`).
- **`useContainerWidth(ref)`** — ResizeObserver helper for responsive width tracking.

Components built on top:
- **VirtualizedEventList** — Virtual scroll for public event feed using pretext heights
- **ExpandableDescription** — "Ver mais" toggle based on measured line count
- **MasonryEventGrid** — Masonry layout with pre-calculated card heights
- **TruncatedNames** — Measures individual name widths for "João, Maria +5" truncation

## Caveats

- **system-ui font**: Canvas resolves differently than DOM on macOS. Use named fonts (Inter, Geist).
- **Browser-only**: `prepare()` requires Canvas 2D context. Not compatible with React Native or server-side (yet).
- **Font sync**: CSS `font` and `lineHeight` must match what's passed to pretext, or measurements will be off.

## See Also

- [Visual Foundations](../design-system/visual-foundations.md) — Design tokens and typography
- [System Design](../architecture/system-design.md) — Monorepo structure and stack
