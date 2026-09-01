import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* ToneChip — headline tone tag (2px radius, 10px mono uppercase)      */
/* ------------------------------------------------------------------ */

const TONE_STYLES: Record<string, string> = {
  risk: 'border-down/50 bg-down/10 text-down',
  bull: 'border-up/50 bg-up/10 text-up',
  bear: 'border-down/50 bg-down/10 text-down',
  neutral: 'border-bright bg-panel2 text-inkdim',
}

export function ToneChip({ tone, label }: { tone: string; label?: string }) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.neutral
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[2px] border px-1.5 py-0.5',
        'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
        style,
      )}
    >
      {label ?? tone}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* BiasChip — semantic bias map                                        */
/* bullish→green, bearish→red, defensive/cautious→amber, neutral→dim   */
/* ------------------------------------------------------------------ */

const BIAS_STYLES: Record<string, string> = {
  bullish: 'border-up/50 bg-up/10 text-up',
  long: 'border-up/50 bg-up/10 text-up',
  bearish: 'border-down/50 bg-down/10 text-down',
  short: 'border-down/50 bg-down/10 text-down',
  defensive: 'border-warn/50 bg-warn/10 text-warn',
  cautious: 'border-warn/50 bg-warn/10 text-warn',
  neutral: 'border-bright bg-panel2 text-inkdim',
  'neutral-cautious': 'border-bright bg-panel2 text-inkdim',
}

export function BiasChip({ bias, className }: { bias: string; className?: string }) {
  const key = bias.toLowerCase()
  const style = BIAS_STYLES[key] ?? BIAS_STYLES.neutral
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] border px-1.5 py-0.5',
        'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
        style,
        className,
      )}
    >
      {bias}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* SeverityDot — squares, not dots: high=filled red 8px, medium=amber  */
/* ------------------------------------------------------------------ */

export function SeverityDot({ severity, className }: { severity: string; className?: string }) {
  const s = severity.toLowerCase()
  const color = s === 'high' ? 'bg-down' : s === 'medium' || s === 'med' ? 'bg-warn' : 'bg-inkfaint'
  return (
    <span
      title={`severity: ${severity}`}
      className={cn('inline-block h-2 w-2 shrink-0 rounded-[1px]', color, className)}
    />
  )
}

/* ------------------------------------------------------------------ */
/* ImportanceDot — signal-strength squares: high=3 amber, med=2, low=1 */
/* ------------------------------------------------------------------ */

export function ImportanceDot({ importance, className }: { importance: string; className?: string }) {
  const level = importance.toLowerCase()
  const count = level === 'high' ? 3 : level === 'med' || level === 'medium' ? 2 : 1
  return (
    <span
      title={`importance: ${importance}`}
      className={cn('inline-flex items-end gap-[2px]', className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'h-2 w-[5px] rounded-[1px]',
            i < count ? (count === 3 ? 'bg-warn' : count === 2 ? 'bg-warn/70' : 'bg-inkfaint') : 'bg-hair',
          )}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* LiveDot — 6px pulsing dot: green live, dim gray closed              */
/* ------------------------------------------------------------------ */

export function LiveDot({ state, className }: { state: string; className?: string }) {
  const live = state.toLowerCase() === 'live'
  return (
    <span
      className={cn(
        'inline-block h-1.5 w-1.5 shrink-0 rounded-full',
        live ? 'animate-pulse-dot bg-up' : 'bg-inkfaint',
        className,
      )}
    />
  )
}
