'use client'

import { useMemo, type JSX } from 'react'
import { usePretext, useContainerWidth } from '@/hooks/usePretext'

interface TruncatedNamesProps {
  names: string[]
  font?: string
  separator?: string
}

export function TruncatedNames({
  names,
  font = '400 14px Geist, system-ui, sans-serif',
  separator = ', ',
}: TruncatedNamesProps): JSX.Element {
  const [containerRef, width] = useContainerWidth<HTMLSpanElement>()

  const result = useMemo(() => {
    if (!width || names.length === 0) return { visible: names, overflow: 0 }

    let usedWidth = 0
    let visibleCount = names.length

    for (let i = 0; i < names.length; i++) {
      const sep = i > 0 ? separator : ''
      const segment = sep + names[i]
      // Use canvas directly for width measurement (inline, no line-breaking)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) break
      ctx.font = font
      const segWidth = ctx.measureText(segment).width

      // Reserve space for "+N" suffix if this isn't the last name
      const overflowSuffix = i < names.length - 1 ? ' +99' : ''
      const suffixWidth = ctx.measureText(overflowSuffix).width

      if (usedWidth + segWidth + suffixWidth > width) {
        visibleCount = i
        break
      }
      usedWidth += segWidth
    }

    return {
      visible: names.slice(0, visibleCount),
      overflow: names.length - visibleCount,
    }
  }, [names, width, font, separator])

  return (
    <span ref={containerRef} style={{ display: 'inline-block', width: '100%' }}>
      {result.visible.join(separator)}
      {result.overflow > 0 && (
        <span style={{ fontWeight: 600, marginLeft: 4 }}>
          +{result.overflow}
        </span>
      )}
    </span>
  )
}
