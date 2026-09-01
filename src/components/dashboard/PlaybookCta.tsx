import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Playbook } from '@/lib/swarm-api'

/**
 * 14 / DAY TRADING PLAYBOOK CTA strip — full-width band, teal left border,
 * master-switch teaser + meta chips + OPEN PLAYBOOK button.
 */
export function PlaybookCta({ playbook }: { playbook: Playbook }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('date')
  const href = date ? `/playbook?date=${date}` : '/playbook'

  return (
    <section id="stage-playbook" className="lg:col-span-12">
      <motion.div
        className="flex flex-col gap-5 rounded border border-hair border-l-[3px] border-l-phosphor bg-panel2 p-5 md:flex-row md:items-center md:justify-between md:p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-medium tracking-[0.14em] text-inkfaint">
            14 <span className="text-inkfaint/60">/</span>{' '}
            <span className="font-display font-bold uppercase tracking-[0.14em] text-ink">
              Day Trading Playbook
            </span>
          </p>
          <p className="mt-2 line-clamp-2 max-w-[720px] font-mono text-[12px] leading-relaxed text-inkdim">
            {playbook.master_switch}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              `${playbook.calls.length} CALLS`,
              `${playbook.puts.length} PUTS`,
              `${playbook.stocks.length} STOCK SETUPS`,
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-[2px] border border-hair bg-panel px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(href)}
          className="group/btn inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[2px] border border-phosphor px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-phosphor transition-colors hover:bg-phosphor/10"
        >
          OPEN PLAYBOOK
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </motion.div>
    </section>
  )
}
