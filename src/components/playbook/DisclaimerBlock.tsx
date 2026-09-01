import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const FIXED_LINE =
  'SWARM is an AI research pipeline. Nothing here is a recommendation to buy or sell any security. Options involve substantial risk of loss.'

/**
 * Mandatory prominent disclaimer: 3px red left border (draws in once),
 * red 6% alpha bg, payload disclaimer at full contrast + fixed second line.
 */
export function DisclaimerBlock({ disclaimer }: { disclaimer: string }) {
  return (
    <motion.section
      aria-label="Disclaimer"
      className="relative mt-12 overflow-hidden rounded border border-hair bg-down/[0.06] p-4 md:p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* 3px red left border draws top → bottom once */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] origin-top bg-down"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-down">
        DISCLAIMER — READ BEFORE ACTING
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-ink md:text-[14px]">{disclaimer}</p>
      <p className="mt-3 text-[12px] leading-relaxed text-inkdim">{FIXED_LINE}</p>
    </motion.section>
  )
}
