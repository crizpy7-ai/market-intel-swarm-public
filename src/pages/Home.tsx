import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useSwarmRun } from '@/lib/swarm-api'
import { StageRail } from '@/components/ui/stage-rail'
import { BootOverlay } from '@/components/dashboard/BootOverlay'
import { RunHeader } from '@/components/dashboard/RunHeader'
import { TickerTape } from '@/components/dashboard/TickerTape'
import { OvernightMatrix } from '@/components/dashboard/OvernightMatrix'
import { GlobalMarkets } from '@/components/dashboard/GlobalMarkets'
import { Headlines } from '@/components/dashboard/Headlines'
import { CalendarSection } from '@/components/dashboard/CalendarSection'
import { EarningsSection } from '@/components/dashboard/EarningsSection'
import { SecFilings } from '@/components/dashboard/SecFilings'
import { OptionsFlow } from '@/components/dashboard/OptionsFlow'
import { Institutional } from '@/components/dashboard/Institutional'
import { SentimentStrip } from '@/components/dashboard/SentimentStrip'
import { TechnicalsTable } from '@/components/dashboard/TechnicalsTable'
import { CrossVerificationSection } from '@/components/dashboard/CrossVerification'
import { RiskMatrix } from '@/components/dashboard/RiskMatrix'
import { OpportunityRanking } from '@/components/dashboard/OpportunityRanking'
import { PlaybookCta } from '@/components/dashboard/PlaybookCta'

const STAGES = [
  { num: '01', id: 'stage-overnight' },
  { num: '02', id: 'stage-global' },
  { num: '03', id: 'stage-headlines' },
  { num: '04', id: 'stage-calendar' },
  { num: '05', id: 'stage-earnings' },
  { num: '06', id: 'stage-filings' },
  { num: '07', id: 'stage-options' },
  { num: '08', id: 'stage-institutional' },
  { num: '09', id: 'stage-sentiment' },
  { num: '10', id: 'stage-technicals' },
  { num: '11', id: 'stage-crossver' },
  { num: '12', id: 'stage-risks' },
  { num: '13', id: 'stage-opportunities' },
  { num: '14', id: 'stage-playbook' },
]

export default function Home() {
  const {
    run,
    isFallback,
    viewDate,
    setViewDate,
    newRunDate,
    loadNewRun,
    dismissNewRun,
  } = useSwarmRun()
  const [params] = useSearchParams()
  const dateParam = params.get('date')

  // Sync ?date= into the provider (archive view) and back.
  useEffect(() => {
    if (dateParam !== viewDate) setViewDate(dateParam)
  }, [dateParam, viewDate, setViewDate])

  const isArchive = Boolean(viewDate)
  const holiday = (run.market_status || '').toLowerCase() === 'holiday'

  return (
    <div key={run.run_date}>
      <BootOverlay runDate={run.run_date} />
      <StageRail items={STAGES} />

      {/* NEW RUN banner */}
      <AnimatePresence>
        {newRunDate && (
          <motion.div
            className="sticky top-14 z-40 border-b border-hair border-l-[3px] border-l-phosphor bg-panel2"
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2.5 md:px-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-phosphor">
                NEW RUN DETECTED — {newRunDate}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadNewRun}
                  className="cursor-pointer rounded-[2px] border border-phosphor px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-phosphor transition-colors hover:bg-phosphor/10"
                >
                  LOAD
                </button>
                <button
                  onClick={dismissNewRun}
                  className="cursor-pointer rounded-[2px] border border-hair px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim transition-colors hover:bg-panel"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holiday banner */}
      {holiday && (
        <div className="border-b border-hair bg-warn/[0.08]">
          <p className="mx-auto max-w-[1440px] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-warn md:px-6">
            MARKET CLOSED — HOLIDAY
          </p>
        </div>
      )}

      {/* Archive banner */}
      {isArchive && (
        <div className="border-b border-hair bg-warn/[0.06]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2 md:px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-warn">
              ARCHIVE VIEW — {run.run_date}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-warn/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warn transition-colors hover:bg-warn/10"
            >
              <RotateCcw className="h-3 w-3" />
              Return to latest
            </Link>
          </div>
        </div>
      )}

      <RunHeader run={run} isFallback={isFallback} isArchive={isArchive} />
      <TickerTape items={run.overnight} />

      {/* 12-col stage grid */}
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 xl:pl-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
          <OvernightMatrix items={run.overnight} />
          <GlobalMarkets items={run.global_markets} />
          <Headlines items={run.headlines} />
          <CalendarSection items={run.calendar} />
          <EarningsSection earnings={run.earnings} />
          <SecFilings items={run.sec_filings} />
          <OptionsFlow rows={run.options_flow} />
          <Institutional items={run.institutional} />
          <SentimentStrip sentiment={run.sentiment} />
          <TechnicalsTable rows={run.technicals} />
          <CrossVerificationSection items={run.cross_verification} />
          <RiskMatrix risks={run.risks} />
          <OpportunityRanking items={run.opportunities} />
          <PlaybookCta playbook={run.playbook} />
        </div>
      </div>
    </div>
  )
}
