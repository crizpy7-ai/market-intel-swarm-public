import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Opportunity } from '@/lib/swarm-api'
import { ConfidenceMeter } from '@/components/ui/confidence-meter'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 13 / OPPORTUNITY RANKING — ranked podium bars; click → /playbook. */
export function OpportunityRanking({ items }: { items: Opportunity[] }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('date')

  const open = () => navigate(date ? `/playbook?date=${date}` : '/playbook')

  return (
    <section id="stage-opportunities" className="lg:col-span-12">
      <SectionHeader num="13" title="Opportunity Ranking" meta={`${items.length} SETUPS`} />
      <div className="mt-3 space-y-2.5">
        {items.map((o, i) => {
          const top = o.rank === 1
          return (
            <motion.button
              key={o.rank}
              type="button"
              onClick={open}
              className={cn(
                'group flex w-full cursor-pointer items-center gap-4 rounded border p-4 text-left transition-colors',
                top
                  ? 'border-warn/60 bg-warn/[0.04] hover:bg-warn/[0.08]'
                  : 'border-hair bg-panel hover:border-bright hover:bg-panel2',
              )}
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
            >
              <span
                className={cn(
                  'w-8 shrink-0 font-mono text-[28px] font-bold tabular-nums leading-none',
                  top ? 'text-warn' : 'text-inkfaint',
                )}
              >
                {o.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink transition-colors group-hover:text-phosphor">
                  {o.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-inkdim">{o.thesis}</p>
                <motion.div
                  className="mt-2 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.8, ease: EASE }}
                  style={{ width: `${Math.min(100, o.confidence + 20)}%` }}
                >
                  <ConfidenceMeter score={o.confidence} showScore={false} height={3} />
                </motion.div>
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-[18px] font-bold tabular-nums text-ink">
                {o.confidence}
              </span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
