import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CountUpProps {
  value: number
  digits?: number
  duration?: number
  className?: string
  /** Group thousands with commas. */
  grouped?: boolean
  prefix?: string
  suffix?: string
}

/**
 * Count-up numeral: animates 0 → value over 600ms ease-out, once,
 * when scrolled into view. Uses framer-motion `animate` on a ref to
 * avoid re-rendering every frame.
 */
export function CountUp({
  value,
  digits = 2,
  duration = 0.6,
  className,
  grouped = false,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const played = useRef(false)

  useEffect(() => {
    if (!inView || played.current || !ref.current) return
    played.current = true
    const node = ref.current
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        const text = grouped
          ? v.toLocaleString('en-US', {
              minimumFractionDigits: digits,
              maximumFractionDigits: digits,
            })
          : v.toFixed(digits)
        node.textContent = `${prefix}${text}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, digits, duration, grouped, prefix, suffix])

  return (
    <span ref={ref} className={cn('font-mono tabular-nums', className)}>
      {prefix}
      {grouped
        ? (0).toLocaleString('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
          })
        : (0).toFixed(digits)}
      {suffix}
    </span>
  )
}
