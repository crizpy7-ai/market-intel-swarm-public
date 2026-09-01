import { Panel } from '@/components/ui/panel'
import { CountUp } from '@/components/ui/count-up'
import { cn } from '@/lib/utils'
import type { Grade } from '@/lib/swarm-api'
import { countResults, sessionCount, winRate } from './grade-stats'

function StatCell({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <CountUp
        value={value}
        digits={0}
        duration={0.6}
        className={cn('text-[24px] font-semibold leading-none text-ink md:text-[28px]', className)}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
        {label}
      </span>
    </div>
  )
}

/**
 * Headline stat band: big win-rate numeral (FLAT/OPEN excluded), totals
 * W / L / F, sessions graded, and the OHLC-proxy grading note.
 */
export function StatBand({ grades }: { grades: Grade[] }) {
  const counts = countResults(grades)
  const rate = winRate(counts)
  const sessions = sessionCount(grades)

  return (
    <Panel cornerTick>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        {/* Big win-rate numeral */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkdim">
            WIN RATE · DECIDED PICKS
          </span>
          <div className="flex items-baseline gap-2">
            {rate === null ? (
              <span className="font-mono text-[48px] font-bold leading-none tabular-nums text-inkfaint md:text-[64px]">
                —
              </span>
            ) : (
              <CountUp
                value={rate}
                digits={1}
                duration={0.8}
                suffix="%"
                className={cn(
                  'text-[48px] font-bold leading-none md:text-[64px]',
                  rate >= 50 ? 'text-up' : 'text-down',
                )}
              />
            )}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            {counts.wins + counts.losses} DECIDED · {counts.flats} FLAT EXCLUDED
          </span>
        </div>

        {/* W / L / F / sessions */}
        <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-5 min-w-[260px] sm:grid-cols-4 md:justify-items-end">
          <StatCell label="WINS" value={counts.wins} className="text-up" />
          <StatCell label="LOSSES" value={counts.losses} className="text-down" />
          <StatCell label="FLAT" value={counts.flats} className="text-warn" />
          <StatCell label="SESSIONS GRADED" value={sessions} />
        </div>
      </div>

      <div className="mt-5 border-t border-hair pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          NOTE — GRADING USES UNDERLYING OHLC AS PROXY FOR OPTION PREMIUM
        </p>
      </div>
    </Panel>
  )
}
