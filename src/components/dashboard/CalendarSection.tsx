import { motion } from 'framer-motion'
import type { CalendarEvent } from '@/lib/swarm-api'
import { ImportanceDot } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 04 / ECONOMIC CALENDAR — vertical timeline with importance nodes. */
export function CalendarSection({ items }: { items: CalendarEvent[] }) {
  return (
    <section id="stage-calendar" className="lg:col-span-5">
      <SectionHeader num="04" title="Economic Calendar" meta={`${items.length} EVENTS`} />
      <Panel className="mt-3">
        <div className="relative">
          {/* connecting line — draws top→bottom */}
          <motion.div
            className="absolute bottom-2 left-[74px] top-2 w-px origin-top bg-hair"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
            aria-hidden
          />
          <div className="space-y-3">
            {items.map((e, i) => {
              const high = e.importance.toLowerCase() === 'high'
              const isJobs = /jobs report/i.test(e.event)
              return (
                <motion.div
                  key={`${e.time}-${e.event}`}
                  className={cn(
                    'relative flex items-start gap-3 rounded px-2 py-2',
                    high && !isJobs && 'border-l-2 border-l-warn bg-warn/[0.08]',
                  )}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35, ease: EASE }}
                >
                  <span className="w-[62px] shrink-0 pt-0.5 text-right font-mono text-[12px] tabular-nums text-inkdim">
                    {e.time}
                  </span>
                  <span className="pt-1">
                    <ImportanceDot importance={e.importance} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[13px] text-ink">
                      {e.event}
                      {isJobs && (
                        <span className="rounded-[2px] border border-down/50 bg-down/10 px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-down">
                          HIGH
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] tabular-nums text-inkdim">
                      cons {e.consensus} · prior {e.prior}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Panel>
    </section>
  )
}
