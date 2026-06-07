'use client'

import { useState, useRef, type JSX } from 'react'
import { usePretext, useContainerWidth } from '@/hooks/usePretext'

interface ExpandableDescriptionProps {
  text: string
  maxLines?: number
  font?: string
  lineHeight?: number
}

export function ExpandableDescription({
  text,
  maxLines = 3,
  font = '400 14px Geist, system-ui, sans-serif',
  lineHeight = 21,
}: ExpandableDescriptionProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [containerRef, width] = useContainerWidth<HTMLDivElement>()

  const full = usePretext({ text, width, font, lineHeight })
  const maxHeight = maxLines * lineHeight
  const needsToggle = full.height > maxHeight

  return (
    <div ref={containerRef}>
      <p
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? undefined : maxHeight,
          transition: 'max-height 0.2s ease',
        }}
      >
        {text}
      </p>
      {needsToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--vermillion, #FF3B2E)',
            cursor: 'pointer',
            padding: '4px 0',
            font: '600 13px Geist, system-ui, sans-serif',
          }}
        >
          {expanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}
