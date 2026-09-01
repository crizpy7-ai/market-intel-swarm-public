import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { CountUp } from '@/components/ui/count-up'
import {
  fetchRunHistory,
  getFallbackRun,
  useSwarmRun,
} from '@/lib/swarm-api'
import type { SwarmRunSummary } from '@/lib/swarm-api'
import { ArchiveRow } from '@/components/history/ArchiveRow'
import { ArchiveSkeleton } from '@/components/history/ArchiveSkeleton'
import { ArchiveNote } from '@/components/history/ArchiveNote'
import '@/components/history/history.css'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

type LoadState = 'loading' | 'ok' | 'empty' | 'error'

/**
 * History (`/history`) — run archive. Reads the PostgREST history list
 * (`select=run_date,created_at&order=run_date.desc&limit=30`) via the shared
 * data layer; on failure shows the bundled Sep 1, 2026 snapshot as a single
 * row. Rows deep-link to `/?date=…` (brief) and `/playbook?date=…`.
 */
export default function History() {
  const { run } = useSwarmRun()
  const [state, setState] = useState<LoadState>('loading')
  const [rows, setRows] = useState<SwarmRunSummary[]>([])

  useEffect(() => {
    let cancelled = false
    fetchRunHistory()
      .then((list) => {
        if (cancelled) return
        setRows(list)
        setState(list.length ? 'ok' : 'empty')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const fallback = getFallbackRun()
  const fallbackRow: SwarmRunSummary = {
    run_date: fallback.run_date,
    created_at: fallback.generated_at_utc,
  }

  const displayCount = state === 'ok' ? rows.length : state === 'error' ? 1 : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full max-w-[1440px] px-4 md:px-6"
    >
      <div className="mx-auto w-full xl:max-w-[1024px]">
        {/* Section 1 — Header */}
        <header className="pt-[88px] pb-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkdim">
              RUN ARCHIVE
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-[36px] font-bold leading-none tracking-[-0.02em] text-ink">
                PAST RUNS
              </h1>
              <div className="text-right max-md:text-left">
                <div className="flex items-baseline gap-2 max-md:justify-start md:justify-end">
                  {displayCount > 0 ? (
                    <CountUp
                      value={displayCount}
                      digits={0}
                      duration={0.5}
                      className="text-[20px] font-semibold text-ink"
                    />
                  ) : (
                    <span className="font-mono text-[20px] font-semibold tabular-nums text-inkfaint">
                      —
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                    RUNS ON RECORD
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                  RETENTION: LAST 30 TRADING DAYS
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            aria-hidden
            className="mt-6 h-px origin-left bg-hair"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
          />
        </header>

        {/* Section 2 — Archive list */}
        <Panel noMotion className="overflow-hidden p-0 md:p-0">
          {state === 'loading' && <ArchiveSkeleton />}

          {state === 'error' && (
            <>
              <div className="flex items-center gap-2 border-b border-hair bg-warn/10 px-4 py-2.5 md:px-5">
                <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-warn" aria-hidden />
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-warn">
                  LIVE ARCHIVE UNAVAILABLE — SHOWING BUNDLED SNAPSHOT
                </span>
              </div>
              <ArchiveRow row={fallbackRow} index={0} bundled />
            </>
          )}

          {state === 'empty' && (
            <p className="px-4 py-16 text-center font-mono text-[12px] text-inkfaint md:px-5">
              &gt; no runs archived yet — the swarm files its first brief
              tomorrow 08:00 UTC
            </p>
          )}

          {state === 'ok' && (
            <div className="divide-y divide-hair">
              {rows.map((r, i) => (
                <ArchiveRow
                  key={r.run_date}
                  row={r}
                  index={i}
                  isLatest={i === 0}
                  marketStatus={r.run_date === run.run_date ? run.market_status : null}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Section 3 — Archive note */}
        <ArchiveNote />

        <div className="h-16" />
      </div>
    </motion.div>
  )
}
