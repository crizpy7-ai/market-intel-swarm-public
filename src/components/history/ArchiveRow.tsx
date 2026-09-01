import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fmtUtcTime } from '@/lib/swarm-api'
import type { SwarmRunSummary } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** "SEP 01" from a YYYY-MM-DD run date. */
function fmtArchiveDay(runDate: string): string {
  const d = new Date(`${runDate}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return runDate
  const mon = d
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toUpperCase()
  return `${mon} ${String(d.getUTCDate()).padStart(2, '0')}`
}

/** "2026 · TUE" from a YYYY-MM-DD run date. */
function fmtArchiveSub(runDate: string): string {
  const d = new Date(`${runDate}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return ''
  const dow = d
    .toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
    .toUpperCase()
  return `${d.getUTCFullYear()} · ${dow}`
}

function Chip({
  className,
  children,
}: {
  className?: string
  children: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] border px-1.5 py-0.5',
        'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
        className,
      )}
    >
      {children}
    </span>
  )
}

interface ArchiveRowProps {
  row: SwarmRunSummary
  index: number
  /** Most recent row gets the pulsing LATEST chip. */
  isLatest?: boolean
  /**
   * Market status when this run's payload has been fetched this session
   * ('open' | 'holiday' | 'closed' | ...). Omitted otherwise.
   */
  marketStatus?: string | null
  /** Bundled offline snapshot row (error state). */
  bundled?: boolean
}

/**
 * One archive row: date block · generation meta + chips · BRIEF/PLAYBOOK
 * ghost buttons. Entire row deep-links to the dashboard brief; buttons
 * stop propagation. Hover: bg lift, 120ms teal left-border draw, date
 * numerals shift 2px right.
 */
export function ArchiveRow({
  row,
  index,
  isLatest = false,
  marketStatus = null,
  bundled = false,
}: ArchiveRowProps) {
  const navigate = useNavigate()
  const briefHref = `/?date=${row.run_date}`
  const playbookHref = `/playbook?date=${row.run_date}`

  const openBrief = useCallback(() => navigate(briefHref), [navigate, briefHref])

  const status = (marketStatus ?? '').toLowerCase()
  const showStatus = !bundled && status !== ''
  const isHoliday = status === 'holiday' || status === 'closed'

  return (
    <motion.div
      role="link"
      tabIndex={0}
      aria-label={`Open brief for ${row.run_date}`}
      onClick={openBrief}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          openBrief()
        }
      }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: EASE }}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-5',
        'transition-colors duration-150 hover:bg-panel2',
      )}
    >
      {/* 120ms teal left-border draw on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-phosphor transition-transform ease-out [transition-duration:120ms] group-hover:scale-y-100"
      />

      {/* Date block */}
      <div className="shrink-0 md:w-24">
        <div className="font-mono text-[18px] font-bold leading-none tabular-nums text-ink transition-transform duration-150 group-hover:translate-x-[2px]">
          {fmtArchiveDay(row.run_date)}
        </div>
        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint transition-transform duration-150 group-hover:translate-x-[2px]">
          {fmtArchiveSub(row.run_date)}
        </div>
      </div>

      {/* Meta + chips */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-[12px] tabular-nums text-inkdim">
          GENERATED {fmtUtcTime(row.created_at)} UTC
        </span>
        {bundled ? (
          <Chip className="border-warn/50 bg-warn/10 text-warn">BUNDLED SNAPSHOT</Chip>
        ) : (
          <>
            <Chip className="border-phosphor/50 text-phosphor">PRE-MARKET</Chip>
            {showStatus &&
              (isHoliday ? (
                <Chip className="border-warn/50 bg-warn/10 text-warn">
                  {status === 'holiday' ? 'HOLIDAY' : 'CLOSED'}
                </Chip>
              ) : (
                <Chip className="border-up/50 bg-up/10 text-up">OPEN</Chip>
              ))}
            {isLatest && (
              <Chip className={cn('latest-chip border-up/50 bg-up/10 text-up')}>
                LATEST
              </Chip>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2 max-md:w-full">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(briefHref)
          }}
          className={cn(
            'rounded-[2px] border border-hair px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim',
            'transition-colors duration-150 hover:border-bright hover:bg-phosphor/10 hover:text-phosphor',
            'max-md:flex-1',
          )}
        >
          BRIEF →
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(playbookHref)
          }}
          className={cn(
            'rounded-[2px] border border-hair px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim',
            'transition-colors duration-150 hover:border-bright hover:bg-phosphor/10 hover:text-phosphor',
            'max-md:flex-1',
          )}
        >
          PLAYBOOK →
        </button>
      </div>
    </motion.div>
  )
}
