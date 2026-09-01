import { motion } from 'framer-motion'
import type { GlobalMarket } from '@/lib/swarm-api'
import { fmtChg, fmtPrice } from '@/lib/swarm-api'
import { LiveDot } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 02 / GLOBAL MARKETS — Asia/Europe rows with live/closed state. */
export function GlobalMarkets({ items }: { items: GlobalMarket[] }) {
  return (
    <section id="stage-global" className="lg:col-span-5">
      <SectionHeader num="02" title="Global Markets" meta={`${items.length} INDICES`} />
      <Panel className="mt-3 divide-y divide-hair p-0 md:p-0">
        {items.map((m, i) => {
          const live = m.state.toLowerCase() === 'live'
          return (
            <motion.div
              key={m.name}
              className={cn('flex items-start gap-3 px-4 py-3 md:px-5', !live && 'opacity-55')}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: live ? 1 : 0.55, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
            >
              <LiveDot state={m.state} className="mt-1.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-medium text-ink">{m.name}</p>
                  <div className="flex items-baseline gap-2 font-mono text-[12px] tabular-nums">
                    <span className="text-ink">{fmtPrice(m.price)}</span>
                    <span className={m.chg >= 0 ? 'text-up' : 'text-down'}>
                      {fmtChg(m.chg)}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[11px] text-inkdim">
                  {m.note}
                  {!live && (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                      CLOSED
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )
        })}
      </Panel>
    </section>
  )
}
