'use client'

import { useMemo, useState, useEffect, useRef, type RefObject } from 'react'
import { prepare, layout } from '@chenglou/pretext'

// ─── Types ───────────────────────────────────────────────────────

export interface UsePretextInput {
  text: string
  width: number
  font?: string
  lineHeight?: number
}

export interface UsePretextResult {
  height: number
  lineCount: number
}

// ─── Defaults from design tokens ─────────────────────────────────

const DEFAULT_FONT = '400 16px Geist, system-ui, -apple-system, Segoe UI, sans-serif'
const DEFAULT_LINE_HEIGHT = 24.8 // 16px * 1.55 (--t-body)

// ─── Hook ────────────────────────────────────────────────────────

export function usePretext({
  text,
  width,
  font,
  lineHeight,
}: UsePretextInput): UsePretextResult {
  const resolvedFont = font ?? DEFAULT_FONT
  const resolvedLineHeight = lineHeight ?? DEFAULT_LINE_HEIGHT

  // Memoize prepare() — only re-run when text or font change
  const prepared = useMemo(() => {
    if (!text) return null
    return prepare(text, resolvedFont)
  }, [text, resolvedFont])

  // Re-run layout() when width, prepared, or lineHeight change
  const result = useMemo(() => {
    if (!prepared || width <= 0) {
      return { height: 0, lineCount: 0 }
    }
    return layout(prepared, width, resolvedLineHeight)
  }, [prepared, width, resolvedLineHeight])

  return result
}

// ─── Helper: useContainerWidth ───────────────────────────────────

export function useContainerWidth<T extends HTMLElement>(): [
  RefObject<T | null>,
  number,
] {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setWidth(entry.contentRect.width)
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}
