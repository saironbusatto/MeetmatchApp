'use client'

import { useRef, type JSX } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { usePretext } from '@/hooks/usePretext'

interface EventItem {
  id: string
  title: string
  description?: string
  eventDate?: string
  maxCapacity?: number
  currentCount?: number
}

interface VirtualizedEventListProps {
  events: EventItem[]
  estimatedItemHeight?: number
}

function EventCardHeight({ item, width }: { item: EventItem; width: number }): number {
  const title = usePretext({
    text: item.title ?? '',
    width,
    font: '700 22px Bricolage Grotesque, Geist, system-ui, sans-serif',
    lineHeight: 28,
  })

  const desc = usePretext({
    text: item.description ?? '',
    width,
    font: '400 14px Geist, system-ui, sans-serif',
    lineHeight: 21,
  })

  // title + gap + description + gap + date + padding
  return 16 + title.height + 8 + desc.height + 8 + 20 + 16
}

export function VirtualizedEventList({
  events,
  estimatedItemHeight = 120,
}: VirtualizedEventListProps): JSX.Element {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '100%', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = events[virtualItem.index]
          if (!item) return null
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <article className="card">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                {item.eventDate && <time>{item.eventDate}</time>}
                {item.maxCapacity && (
                  <span>
                    {item.currentCount ?? 0}/{item.maxCapacity} vagas
                  </span>
                )}
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
