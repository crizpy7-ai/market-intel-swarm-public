import { AnimatePresence, motion } from 'framer-motion'
import type { Earnings, EarningsItem } from '@/lib/swarm-api'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function EarningsRows({ items }: { items: EarningsItem[] }) {
  return (
    <div className="divide-y divide-hair">
      {items.map((e, i) => (
        <motion.div
          key={e.ticker}
          className="flex items-start justify-between gap-3 py-2.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25, ease: EASE }}
        >
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-[13px] font-bold text-ink">{e.ticker}</span>
              <span className="text-[12px] text-inkdim">{e.name}</span>
            </p>
            {e.note && <p className="mt-0.5 text-[11px] text-inkdim">{e.note}</p>}
          </div>
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink">
            {e.est || '—'}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/** 05 / EARNINGS WATCH — tabbed BMO / AMC / this week. */
export function EarningsSection({ earnings }: { earnings: Earnings }) {
  const tabs = [
    { value: 'bmo', label: `BEFORE OPEN (${earnings.bmo.length})`, items: earnings.bmo },
    { value: 'amc', label: `AFTER CLOSE (${earnings.amc.length})`, items: earnings.amc },
    { value: 'week', label: `THIS WEEK (${earnings.week.length})`, items: earnings.week },
  ]

  return (
    <section id="stage-earnings" className="lg:col-span-7">
      <SectionHeader num="05" title="Earnings Watch" meta="BMO · AMC · WEEK" />
      <Panel className="mt-3">
        <Tabs defaultValue="bmo">
          <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-hair bg-transparent p-0">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  'rounded-none border-b-2 border-transparent px-1 pb-2 pt-1',
                  'font-mono text-[11px] uppercase tracking-[0.12em] text-inkdim',
                  'data-[state=active]:border-phosphor data-[state=active]:bg-transparent data-[state=active]:text-phosphor data-[state=active]:shadow-none',
                )}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {t.items.length ? (
                    <EarningsRows items={t.items} />
                  ) : (
                    <p className="py-4 text-center font-mono text-[12px] text-inkfaint">—</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </Panel>
    </section>
  )
}
