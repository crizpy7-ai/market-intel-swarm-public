import { motion } from 'framer-motion'
import { ConfidenceMeter } from '@/components/ui/confidence-meter'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const TIERS = [
  {
    range: '≥65',
    label: 'HIGH CONVICTION',
    color: '#2EE5A0',
    text: 'Most independent checks pointed the same way.',
  },
  {
    range: '55–64',
    label: 'MODERATE',
    color: '#9CD65C',
    text: 'Signals agree with gaps — size the position accordingly.',
  },
  {
    range: '<55',
    label: 'SPECULATIVE',
    color: '#FFB224',
    text: 'Signals conflict; treat as a watch, not a trade.',
  },
] as const

/**
 * Section 4 — confidence-score explainer (demo meter at 65) + the
 * invalidation rule panel with a red perimeter border draw.
 */
export function ConfidenceExplainer() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-4 md:px-6">
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Left — how to read a confidence score */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded border border-hair bg-panel p-4 md:p-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkdim">
            HOW TO READ A CONFIDENCE SCORE
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-inkdim">
            Scores weigh signal agreement across stages — a 65 means most
            independent checks pointed the same way.
          </p>
          <div className="mt-5">
            <ConfidenceMeter score={65} height={4} />
          </div>
          <ul className="mt-5 space-y-3">
            {TIERS.map((t, i) => (
              <motion.li
                key={t.range}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                /* pops tied to the 800ms fill: 0.2s / 0.45s / 0.7s */
                transition={{ duration: 0.35, delay: 0.2 + i * 0.25, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span
                  aria-hidden
                  className="mt-[3px] h-2 w-2 shrink-0 rounded-[1px]"
                  style={{ backgroundColor: t.color }}
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em]">
                    <span className="font-semibold tabular-nums" style={{ color: t.color }}>
                      {t.range}
                    </span>{' '}
                    <span className="text-ink">{t.label}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-inkdim">{t.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — the invalidation rule (red perimeter draw) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="relative rounded bg-panel p-4 md:p-5"
        >
          {/* red border perimeter sweep, 600ms */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-px w-full origin-left bg-down"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.15, delay: 0.2, ease: 'linear' }}
          />
          <motion.span
            aria-hidden
            className="absolute right-0 top-0 h-full w-px origin-top bg-down"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.15, delay: 0.35, ease: 'linear' }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-0 right-0 h-px w-full origin-right bg-down"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.15, delay: 0.5, ease: 'linear' }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-full w-px origin-bottom bg-down"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.15, delay: 0.65, ease: 'linear' }}
          />

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-down">
            THE INVALIDATION RULE
          </p>
          <p className="mt-3 text-[14px] leading-[1.55] text-ink">
            Every playbook idea ships with the condition that kills it. If
            invalidation triggers, the idea is dead — the swarm doesn't average
            down, and neither should you.
          </p>
          <div className="mt-5 rounded-[2px] border border-hair bg-panel2 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
              EXAMPLE
            </p>
            <p className="mt-1 font-mono text-[12px] tabular-nums text-inkdim">
              NVDA $225C — invalidated below $217 or ISM &lt; 54
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
