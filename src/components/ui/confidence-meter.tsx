import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ConfidenceMeterProps {
  score: number
  className?: string
  /** Show the numeric score right-aligned in mono bold. */
  showScore?: boolean
  /** Bar height in px (default 4). */
  height?: number
}

function barColor(score: number): string {
  if (score >= 65) return '#2EE5A0' // up green
  if (score >= 55) return '#9CD65C' // amber-green blend
  return '#FFB224' // warn amber
}

/**
 * Confidence meter: thin 4px bar fills 0 → score over 800ms cubic ease
 * when scrolled into view; score numeral counts up in sync.
 */
export function ConfidenceMeter({
  score,
  className,
  showScore = true,
  height = 4,
}: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const color = barColor(clamped)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="relative flex-1 overflow-hidden rounded-[2px] bg-hair"
        style={{ height }}
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-[2px]"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        />
      </div>
      {showScore && (
        <motion.span
          className="shrink-0 font-mono text-[13px] font-bold tabular-nums text-ink"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {clamped}
        </motion.span>
      )}
    </div>
  )
}
