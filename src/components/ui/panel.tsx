import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PanelProps {
  children: ReactNode
  className?: string
  /** Hero panels get a 2px L-shaped corner tick in border-bright (top-left). */
  cornerTick?: boolean
  /** Extra left-border accent color. */
  accent?: 'teal' | 'amber' | 'red' | 'none'
  /** Disable the standard entrance animation. */
  noMotion?: boolean
}

/**
 * Shared terminal panel: bg-panel + 1px border-hair + radius 4px.
 * Entrance: slide up 24px + fade, triggered at 15% viewport entry, once.
 */
export function Panel({
  children,
  className,
  cornerTick = false,
  accent = 'none',
  noMotion = false,
}: PanelProps) {
  const accentCls =
    accent === 'teal'
      ? 'border-l-2 border-l-phosphor'
      : accent === 'amber'
        ? 'border-l-2 border-l-warn'
        : accent === 'red'
          ? 'border-l-2 border-l-down'
          : ''

  const inner = (
    <>
      {cornerTick && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-3 w-3 text-bright"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M1 11V1h10" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {children}
    </>
  )

  const cls = cn(
    'relative rounded border border-hair bg-panel p-4 md:p-5',
    accentCls,
    className,
  )

  if (noMotion) return <div className={cls}>{inner}</div>

  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {inner}
    </motion.div>
  )
}
