import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/count-up'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const SUB =
  'Each U.S. trading day, an autonomous research pipeline sweeps overnight markets, filings, flow, and sentiment — cross-examines its own findings — and files a pre-market brief with a disciplined playbook. This page shows exactly how.'

interface Word {
  text: string
  teal?: boolean
}

/** "One swarm. [14 /] Fourteen stages. Every trading day before the bell." */
const WORDS: Word[] = [
  { text: 'One' },
  { text: 'swarm.' },
  { text: '__NUMERAL__', teal: true },
  { text: 'Fourteen', teal: true },
  { text: 'stages.', teal: true },
  { text: 'Every' },
  { text: 'trading' },
  { text: 'day' },
  { text: 'before' },
  { text: 'the' },
  { text: 'bell.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const word = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/**
 * Section 1 — hero statement: word-by-word headline (teal "Fourteen stages."),
 * a "14 /" numeral that counts 0→14 as the phrase lands, sub copy, scroll cue.
 */
export function HeroStatement() {
  return (
    <section className="relative flex min-h-[70dvh] items-center justify-center">
      <div className="mx-auto w-full max-w-[760px] px-4 py-16 text-center md:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkdim"
        >
          METHODOLOGY
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-5 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[44px]"
        >
          {WORDS.map((w, i) =>
            w.text === '__NUMERAL__' ? (
              <motion.span
                key={i}
                variants={word}
                className="mr-[0.35em] inline-block font-mono text-[0.55em] font-bold tracking-[0.08em] text-phosphor"
              >
                <CountUp value={14} digits={0} duration={1} />
                <span className="text-phosphor/50"> /</span>
              </motion.span>
            ) : (
              <motion.span
                key={i}
                variants={word}
                className={cn('inline-block', w.teal && 'text-phosphor')}
              >
                {w.text}
                {i < WORDS.length - 1 ? ' ' : ''}
              </motion.span>
            ),
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="mx-auto mt-6 max-w-[640px] text-[16px] leading-[1.55] text-inkdim"
        >
          {SUB}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-inkfaint">
          SCROLL ↓
        </span>
        <span className="scroll-cue-line block h-8 w-px bg-phosphor/60" />
      </motion.div>
    </section>
  )
}
