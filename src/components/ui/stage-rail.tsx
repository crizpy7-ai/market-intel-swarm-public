import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface StageRailItem {
  num: string
  id: string
}

interface StageRailProps {
  items: StageRailItem[]
  className?: string
}

/**
 * Slim fixed left rail (48px) listing stage numbers 01…14 vertically.
 * Current in-viewport stage highlighted teal; click smooth-scrolls.
 * A thin progress line fills with scroll. Hidden below 1280px.
 */
export function StageRail({ items, className }: StageRailProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  // Scroll-spy via IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-30% 0px -55% 0px' },
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  // Scroll progress line.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Stage navigation"
      className={cn(
        'fixed left-0 top-14 z-40 hidden w-12 flex-col items-center xl:flex',
        'h-[calc(100dvh-3.5rem)] border-r border-hair bg-abyss/80 backdrop-blur-sm',
        className,
      )}
    >
      {/* progress line */}
      <div className="absolute bottom-0 left-0 top-0 w-px bg-hair" aria-hidden>
        <div
          className="w-px bg-phosphor transition-[height] duration-150"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1 py-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => jump(item.id)}
            className={cn(
              'flex h-6 w-8 cursor-pointer items-center justify-center rounded-[2px]',
              'font-mono text-[10px] tracking-[0.08em] transition-colors',
              active === item.id
                ? 'bg-phosphor/10 text-phosphor'
                : 'text-inkfaint hover:bg-panel2 hover:text-inkdim',
            )}
          >
            {item.num}
          </button>
        ))}
      </div>
    </nav>
  )
}
