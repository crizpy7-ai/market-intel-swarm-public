import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwarmRun } from '@/lib/swarm-api'
import { PlaybookHeader } from '@/components/playbook/PlaybookHeader'
import { MasterSwitch } from '@/components/playbook/MasterSwitch'
import { OptionsSection } from '@/components/playbook/OptionsSection'
import { StockSetups } from '@/components/playbook/StockSetups'
import { RiskProtocol } from '@/components/playbook/RiskProtocol'
import { DisclaimerBlock } from '@/components/playbook/DisclaimerBlock'

/**
 * Playbook page (`/playbook`) — the Day Trading Playbook.
 * Layout: header → master-switch banner → CALLS grid → PUTS grid →
 * STOCK SETUPS → risk protocol strip → disclaimer block.
 * Respects `?date=YYYY-MM-DD` for archived runs (shared provider owns fetch).
 */
export default function Playbook() {
  const { run, viewDate, setViewDate, newRunDate, loadNewRun, dismissNewRun } = useSwarmRun()
  const [params] = useSearchParams()
  const dateParam = params.get('date')

  // Sync ?date= into the provider (archive view) and back.
  useEffect(() => {
    if (dateParam !== viewDate) setViewDate(dateParam)
  }, [dateParam, viewDate, setViewDate])

  const isArchive = Boolean(viewDate)

  return (
    <motion.div
      key={run.run_date}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* NEW RUN banner (app-wide refresh UX) */}
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

      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <PlaybookHeader run={run} isArchive={isArchive} />
        <MasterSwitch text={run.playbook.master_switch} />
        <OptionsSection kind="call" items={run.playbook.calls} />
        <OptionsSection kind="put" items={run.playbook.puts} />
        <StockSetups stocks={run.playbook.stocks} />
      </div>

      <RiskProtocol />

      <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-6">
        <DisclaimerBlock disclaimer={run.disclaimer} />
      </div>
    </motion.div>
  )
}
