import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { fetchGrades, getFallbackGrades } from '@/lib/swarm-api'
import type { Grade } from '@/lib/swarm-api'
import { StatBand } from '@/components/trackrecord/StatBand'
import { BreakdownGrid } from '@/components/trackrecord/BreakdownGrid'
import { GradesTable } from '@/components/trackrecord/GradesTable'
import { sessionCount } from '@/components/trackrecord/grade-stats'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** Simple loading skeleton matching the page's panel rhythm. */
function TrackRecordSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="h-[168px] rounded border border-hair bg-panel" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="h-[220px] rounded border border-hair bg-panel" />
        <div className="h-[220px] rounded border border-hair bg-panel" />
        <div className="h-[220px] rounded border border-hair bg-panel" />
      </div>
      <div className="h-[420px] rounded border border-hair bg-panel" />
    </div>
  )
}

/**
 * Track Record (`/track-record`) — the swarm's batting average. Every
 * playbook pick is graded against that session's actual OHLC after the
 * close: WIN = target reached before stop, LOSS = stop/invalidation hit
 * first, FLAT = entry condition never triggered. Live data from the
 * `swarm_grades` PostgREST table; on any error/timeout the bundled
 * snapshot renders with an amber OFFLINE SNAPSHOT badge.
 */
export default function TrackRecord() {
  const [grades, setGrades] = useState<Grade[] | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchGrades()
      .then((list) => {
        if (cancelled) return
        if (!list.length) throw new Error('no grades')
        setGrades(list)
        setIsFallback(false)
      })
      .catch(() => {
        if (cancelled) return
        setGrades(getFallbackGrades())
        setIsFallback(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full max-w-[1440px] px-4 md:px-6"
    >
      <div className="mx-auto w-full xl:max-w-[1280px]">
        {/* Section 1 — Header */}
        <header className="pt-[88px] pb-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkdim">
                PLAYBOOK GRADING · ALL SESSIONS
              </p>
              {isFallback && (
                <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.1em] text-warn">
                  <TriangleAlert className="h-3 w-3" aria-hidden />
                  OFFLINE SNAPSHOT
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-[36px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[48px]">
              TRACK RECORD
            </h1>
            <p className="mt-4 max-w-[720px] font-sans text-[14px] leading-[1.55] text-inkdim">
              Every pick is scored against that session&apos;s actual high/low:{' '}
              <span className="font-mono text-[12px] text-up">WIN</span> = target reached
              before stop, <span className="font-mono text-[12px] text-down">LOSS</span> =
              stop/invalidation hit first,{' '}
              <span className="font-mono text-[12px] text-warn">FLAT</span> = entry
              condition never triggered.
            </p>
          </motion.div>
          <motion.div
            aria-hidden
            className="mt-6 h-px origin-left bg-hair"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
          />
        </header>

        {grades === null ? (
          <TrackRecordSkeleton />
        ) : (
          <div className="flex flex-col gap-8">
            {/* Section 2 — Headline stat band */}
            <section className="flex flex-col gap-3">
              <SectionHeader
                num="01"
                title="SCOREBOARD"
                meta={`${sessionCount(grades)} SESSIONS GRADED`}
              />
              <StatBand grades={grades} />
            </section>

            {/* Section 3 — Breakdowns */}
            <section className="flex flex-col gap-3">
              <SectionHeader num="02" title="BREAKDOWNS" meta="TYPE · DIRECTION · CONFIDENCE" />
              <BreakdownGrid grades={grades} />
            </section>

            {/* Section 4 — Graded picks table */}
            <section className="flex flex-col gap-3">
              <SectionHeader
                num="03"
                title="GRADED PICKS"
                meta={`${grades.length} PICKS ON RECORD`}
              />
              <GradesTable grades={grades} />
            </section>

            {/* Section 5 — Footer note */}
            <section className="flex flex-col gap-3">
              <Panel accent="amber" noMotion>
                <p className="font-sans text-[11px] leading-[1.6] text-inkdim">
                  Past playbook results do not predict future performance. Educational
                  research, not financial advice.
                </p>
              </Panel>
            </section>
          </div>
        )}

        <div className="h-16" />
      </div>
    </motion.div>
  )
}
