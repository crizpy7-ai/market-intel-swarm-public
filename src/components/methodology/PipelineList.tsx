import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { STAGES } from '@/components/methodology/stages'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/**
 * Pipeline fallback for <1024px and reduced-motion users: the 14 stages
 * as a simple numbered list with stagger fade (no pin).
 */
export function PipelineList() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
      <SectionHeader num="02" title="The Pipeline" meta="14 STAGES" />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {STAGES.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.06, ease: EASE }}
            className="rounded border border-hair bg-panel p-4"
          >
            <p className="font-mono text-[11px] tracking-[0.14em] text-inkfaint">
              {s.num} <span className="text-inkfaint/60">/</span>{' '}
              <span className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
                {s.name}
              </span>
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-inkdim">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
