import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CELLS = [
  { label: 'SIZE BY ATR', text: "Position size from each ticker's ATR.", blink: false },
  { label: 'HONOR STOPS', text: 'Stops are contract price, not stock price.', blink: false },
  { label: 'ISM AT 10:00', text: 'No new entries 9:55–10:05.', blink: false },
  { label: '0DTE CAN GO TO ZERO', text: 'Weekly/0DTE risk warning.', blink: true },
] as const

/**
 * Risk protocol strip: full-width bg-panel-2 band with amber hairlines,
 * four inline protocol cells (2×2 on mobile).
 */
export function RiskProtocol() {
  return (
    <section aria-label="Risk protocol" className="mt-12 border-y border-warn/30 bg-panel2">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-4 px-4 py-5 md:px-6 lg:grid-cols-4">
        {CELLS.map((cell, i) => (
          <motion.div
            key={cell.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: EASE }}
          >
            {cell.blink ? (
              <motion.p
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-warn"
                initial={{ opacity: 1 }}
                whileInView={{ opacity: [1, 0.25, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {cell.label}
              </motion.p>
            ) : (
              <p
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.12em]',
                  'text-inkfaint',
                )}
              >
                {cell.label}
              </p>
            )}
            <p className="mt-1 text-[12px] leading-relaxed text-inkdim">{cell.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
