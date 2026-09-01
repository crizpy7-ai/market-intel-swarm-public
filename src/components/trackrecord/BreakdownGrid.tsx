import { motion, useReducedMotion } from 'framer-motion'
import { Panel } from '@/components/ui/panel'
import { cn } from '@/lib/utils'
import type { Grade } from '@/lib/swarm-api'
import { countResults, fmtRate, winRate } from './grade-stats'

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

function PanelLabel({ children }: { children: string }) {
  return (
    <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-inkdim">
      {children}
    </h3>
  )
}

/** Thin horizontal bar filling 0 → pct when scrolled into view. */
function RateBar({ pct, delay = 0 }: { pct: number | null; delay?: number }) {
  const reduced = useReducedMotion()
  const w = pct === null ? 0 : Math.max(0, Math.min(100, pct))
  return (
    <div
      className="relative h-1 min-w-[60px] flex-1 overflow-hidden rounded-[2px] bg-hair"
      role="meter"
      aria-valuenow={Math.round(w)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-[2px] bg-phosphor"
        initial={reduced ? false : { width: 0 }}
        whileInView={{ width: `${w}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reduced ? 0 : 0.8, delay, ease: EASE }}
      />
    </div>
  )
}

interface BreakdownRow {
  label: string
  labelClassName?: string
  grades: Grade[]
  /** Optional right-aligned sample-size note, e.g. "N=7". */
  note?: string
}

function BreakdownRows({ rows }: { rows: BreakdownRow[] }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {rows.map((row, i) => {
        const counts = countResults(row.grades)
        const rate = winRate(counts)
        return (
          <div key={row.label} className="flex items-center gap-3">
            <span
              className={cn(
                'w-[64px] shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink',
                row.labelClassName,
              )}
            >
              {row.label}
            </span>
            <span className="shrink-0 font-mono text-[10px] tabular-nums tracking-[0.06em] text-inkfaint">
              <span className="text-up">{counts.wins}W</span> ·{' '}
              <span className="text-down">{counts.losses}L</span> ·{' '}
              <span className="text-warn">{counts.flats}F</span>
            </span>
            <RateBar pct={rate} delay={i * 0.06} />
            <span
              className={cn(
                'w-[52px] shrink-0 text-right font-mono text-[12px] font-semibold tabular-nums',
                rate === null ? 'text-inkfaint' : rate >= 50 ? 'text-up' : 'text-down',
              )}
            >
              {fmtRate(rate, 0)}
            </span>
            {row.note && (
              <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-inkfaint sm:inline">
                {row.note}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Calibration buckets: 50–54, 55–59, 60–64, 65+. */
const CONF_BUCKETS: { label: string; test: (c: number) => boolean }[] = [
  { label: '50–54', test: (c) => c >= 50 && c < 55 },
  { label: '55–59', test: (c) => c >= 55 && c < 60 },
  { label: '60–64', test: (c) => c >= 60 && c < 65 },
  { label: '65+', test: (c) => c >= 65 },
]

/**
 * Breakdown panels (3-up grid): by pick type, by direction, and the
 * confidence-calibration read — realized win rate per confidence bucket.
 */
export function BreakdownGrid({ grades }: { grades: Grade[] }) {
  const byType: BreakdownRow[] = [
    {
      label: 'CALLS',
      labelClassName: 'text-up',
      grades: grades.filter((g) => g.pick_type.toLowerCase() === 'call'),
    },
    {
      label: 'PUTS',
      labelClassName: 'text-down',
      grades: grades.filter((g) => g.pick_type.toLowerCase() === 'put'),
    },
    {
      label: 'STOCKS',
      labelClassName: 'text-phosphor',
      grades: grades.filter((g) => g.pick_type.toLowerCase() === 'stock'),
    },
  ]

  const byDirection: BreakdownRow[] = [
    {
      label: 'LONG',
      labelClassName: 'text-up',
      grades: grades.filter((g) => g.direction.toLowerCase() === 'long'),
    },
    {
      label: 'SHORT',
      labelClassName: 'text-down',
      grades: grades.filter((g) => g.direction.toLowerCase() === 'short'),
    },
  ]

  const calibration: BreakdownRow[] = CONF_BUCKETS.map((b) => {
    const picks = grades.filter((g) => b.test(g.confidence))
    return { label: b.label, grades: picks, note: `N=${picks.length}` }
  })

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Panel>
        <PanelLabel>BY PICK TYPE</PanelLabel>
        <BreakdownRows rows={byType} />
      </Panel>
      <Panel>
        <PanelLabel>BY DIRECTION</PanelLabel>
        <BreakdownRows rows={byDirection} />
      </Panel>
      <Panel>
        <PanelLabel>CALIBRATION</PanelLabel>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          DOES CONFIDENCE PREDICT OUTCOMES?
        </p>
        <BreakdownRows rows={calibration} />
      </Panel>
    </div>
  )
}
