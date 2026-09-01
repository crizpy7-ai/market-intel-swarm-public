import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { useSwarmRun } from '@/lib/swarm-api'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const FALLBACK_DISCLAIMER =
  'Research/educational analysis only — NOT financial advice. 0DTE/short-dated options can go to zero. Verify all data at the open.'

const BULLETS = [
  'Briefs are point-in-time: data basis is the prior close plus overnight futures — verify everything at the open.',
  'The swarm reads public data only; it has no visibility into dark pools, flows off-exchange, or breaking headlines after generation time.',
  'AI pipelines can be wrong, stale, or misled by bad inputs. Cross-verification reduces — does not eliminate — error.',
] as const

/**
 * Section 5 — limitations + disclaimer. Same register as the Playbook
 * disclaimer: 3px red left border, red 6% alpha background. Sober: one
 * slide-up unit, bullets stagger 0.1s, no loops.
 */
export function Limitations() {
  const { run } = useSwarmRun()
  const disclaimer = run.disclaimer || FALLBACK_DISCLAIMER

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-6">
      <SectionHeader num="LIM" title="Limitations & Disclaimer" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-6 rounded border border-hair border-l-[3px] border-l-down bg-down/[0.06] p-4 md:p-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-down">
          LIMITATIONS
        </p>
        <ul className="mt-4 space-y-2.5">
          {BULLETS.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.1, ease: EASE }}
              className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink"
            >
              <span
                aria-hidden
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-down"
              />
              {b}
            </motion.li>
          ))}
        </ul>
        <p className="mt-6 border-t border-hair pt-4 text-[12.5px] leading-relaxed text-inkdim">
          {disclaimer}
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-inkdim">
          This page and every brief are for research and education only — not
          financial advice.
        </p>
      </motion.div>
    </section>
  )
}
