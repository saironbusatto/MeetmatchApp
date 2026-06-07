'use client'

import { useRef, useMemo, type JSX } from 'react'
import { usePretext, useContainerWidth } from '@/hooks/usePretext'

interface EventItem {
  id: string
  title: string
  description?: string
  eventDate?: string
}

interface MasonryEventGridProps {
  events: EventItem[]
  columns?: number
  gap?: number
}

const TITLE_FONT = '700 22px Bricolage Grotesque, Geist, system-ui, sans-serif'
const DESC_FONT = '400 14px Geist, system-ui, sans-serif'

function useCardHeight(item: EventItem, width: number): number {
  const title = usePretext({
    text: item.title ?? '',
    width,
    font: TITLE_FONT,
    lineHeight: 28,
  })
  const desc = usePretext({
    text: item.description ?? '',
    width,
    font: DESC_FONT,
    lineHeight: 21,
  })
  // padding(16) + title + gap(8) + desc + gap(8) + date(20) + padding(16)
  return 16 + title.height + 8 + desc.height + 8 + 20 + 16
}

function CardWithHeight({
  item,
  width,
}: {
  item: EventItem
  width: number
}): JSX.Element {
  const height = useCardHeight(item, width)
  return (
    <article className="card" style={{ height }}>
      <h3>{item.title}</h3>
      {item.description && <p>{item.description}</p>}
      {item.eventDate && <time>{item.eventDate}</time>}
    </article>
  )
}

export function MasonryEventGrid({
  events,
  columns = 2,
  gap = 16,
}: MasonryEventGridProps): JSX.Element {
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>()
  const colWidth = (containerWidth - gap * (columns - 1)) / columns

  // Distribute items into columns (shortest-first)
  const columnItems = useMemo(() => {
    const cols: EventItem[][] = Array.from({ length: columns }, () => [])
    events.forEach((item) => {
      // Simple round-robin for now; height-aware distribution
      // would need two-pass which isn't possible with hooks
      const shortest = cols.reduce(
        (minIdx, col, idx) =>
          col.length < (cols[minIdx]?.length ?? Infinity) ? idx : minIdx,
        0
      )
      cols[shortest]?.push(item)
    })
    return cols
  }, [events, columns])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        alignItems: 'start',
      }}
    >
      {columnItems.map((col, colIdx) => (
        <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
          {col.map((item) => (
            <CardWithHeight
              key={item.id}
              item={item}
              width={(colWidth > 0 ? colWidth : 300) - gap}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
