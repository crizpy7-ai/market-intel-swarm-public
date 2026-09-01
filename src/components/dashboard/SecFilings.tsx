import { motion } from 'framer-motion'
import type { SecFiling } from '@/lib/swarm-api'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 06 / SEC FILINGS — compact 8-K activity list. */
export function SecFilings({ items }: { items: SecFiling[] }) {
  return (
    <section id="stage-filings" className="lg:col-span-4">
      <SectionHeader num="06" title="SEC Filings" meta={`${items.length} ITEMS`} />
      <Panel className="mt-3 divide-y divide-hair p-0 md:p-0">
        {items.map((f, i) => {
          const none = f.item.toLowerCase().startsWith('none')
          return (
            <motion.div
              key={`${f.ticker}-${i}`}
              className={cn(
                'px-4 py-3 md:px-5',
                none && 'opacity-55',
                !none && 'border-l-2 border-l-phosphor/60',
              )}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: none ? 0.55 : 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[13px] font-bold text-ink">{f.ticker}</span>
                <span className="font-mono text-[11px] tabular-nums text-inkdim">{f.date}</span>
                <span className="rounded-[2px] border border-hair px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-inkdim">
                  {none ? 'NO FILING' : f.item}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-inkdim">{f.description}</p>
            </motion.div>
          )
        })}
      </Panel>
    </section>
  )
}
