import { motion } from 'framer-motion'
import type { InstitutionalItem } from '@/lib/swarm-api'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 08 / INSTITUTIONAL ACTIVITY — three stacked memo cards. */
export function Institutional({ items }: { items: InstitutionalItem[] }) {
  return (
    <section id="stage-institutional" className="lg:col-span-4">
      <SectionHeader num="08" title="Institutional Activity" meta={`${items.length} MEMOS`} />
      <div className="mt-3 space-y-3">
        {items.map((m, i) => (
          <motion.div
            key={m.tag}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
          >
            <Panel noMotion>
              <motion.span
                className="inline-block rounded-[2px] border border-phosphor/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-phosphor"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.15, duration: 0.3, ease: EASE }}
              >
                {m.tag}
              </motion.span>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">{m.text}</p>
            </Panel>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
