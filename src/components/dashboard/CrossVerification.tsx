import { motion } from 'framer-motion'
import type { CrossVerification } from '@/lib/swarm-api'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function VerdictChip({ verdict }: { verdict: string }) {
  const v = verdict.toLowerCase()
  if (v === 'confirmed') {
    return (
      <span className="rounded-[2px] border border-up/50 bg-up/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-up">
        CONFIRMED
      </span>
    )
  }
  if (v.includes('confirmed')) {
    return (
      <span className="inline-flex overflow-hidden rounded-[2px] border border-up/50 font-mono text-[10px] uppercase tracking-[0.1em]">
        <span className="bg-up/10 px-1.5 py-0.5 text-up">CONFIRMED</span>
        <span className="border-l border-warn/50 bg-warn/10 px-1.5 py-0.5 text-warn">
          W/ EVENT RISK
        </span>
      </span>
    )
  }
  return (
    <span className="animate-pulse-amber rounded-[2px] border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-warn">
      {verdict.toUpperCase()}
    </span>
  )
}

/** Agreement meter: "5/5" → 5 small squares, filled = agree. */
function AgreementSquares({ agree }: { agree: string }) {
  const m = agree.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (!m) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-warn">
        {agree}
      </span>
    )
  }
  const filled = Number(m[1])
  const total = Number(m[2])
  return (
    <span className="inline-flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          className={cn('h-2.5 w-2.5 rounded-[1px]', i < filled ? 'bg-up' : 'bg-hair')}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.2 }}
        />
      ))}
      <span className="ml-1.5 font-mono text-[11px] tabular-nums text-inkdim">{agree}</span>
    </span>
  )
}

/** 11 / CROSS-VERIFICATION — did the swarm agree with itself? */
export function CrossVerificationSection({ items }: { items: CrossVerification[] }) {
  return (
    <section id="stage-crossver" className="lg:col-span-6">
      <SectionHeader num="11" title="Cross-Verification" meta={`${items.length} CLAIMS`} />
      <div className="mt-3 space-y-3">
        {items.map((c, i) => (
          <motion.div
            key={c.claim}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Panel noMotion>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-ink">{c.claim}</p>
                <VerdictChip verdict={c.verdict} />
              </div>
              <div className="mt-2.5">
                <AgreementSquares agree={c.agree} />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-inkdim">{c.evidence}</p>
            </Panel>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
